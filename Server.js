// Server.js
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// ✅ تهيئة Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-light" });
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


// 👇 الحقول اللي نسمح للـ AI يعدلها لكل قالب
const ENHANCE_FIELDS_BY_TEMPLATE = {
  "تعريف بمنصة أو خدمة": ["titlePrimary", "titleSecondary", "body"],
};

// =========  API: /api/enhance  ==========
app.post("/api/enhance", async (req, res) => {
  try {
    const { template, styleTone, keywords, formData, selectedFields } = req.body;

    console.log("[Enhance] template:", template);

    // ========= قالب دعوة ورشة عمل: تحسين محاور الورشة فقط =========
    if (template === "دعوة ورشة عمل") {
      const agenda = Array.isArray(formData?.agendaItems)
        ? formData.agendaItems
        : [];

      // لو ما فيه محاور، ما نسوي شيء
      if (!agenda.length) {
        return res.json({ enhanced: {} });
      }

      const toneArabic =
        styleTone === "لطيف" ? "أسلوب لطيف وبسيط" : "أسلوب رسمي وعملي";

      const keywordsText = keywords
        ? `الكلمات المفتاحية (اختياري، يمكنك أخذها بعين الاعتبار دون إضافة معلومات جديدة): ${keywords}\n`
        : "";

      // نجهّز نسخة مبسّطة من المحاور (عنوان + وصف فقط)
      const plainAgenda = agenda.map((item, idx) => ({
        title: item.title || `محور ${idx + 1}`,
        body: item.body || "",
      }));

      const prompt = `
أنت مساعد لغوي محترف تكتب باللغة العربية.

المطلوب:
- إعادة صياغة محاور ورشة العمل التالية (العنوان والوصف لكل محور).
- حسّن وضوح اللغة، والترابط، والأسلوب، مع الحفاظ على المعنى الأساسي لكل محور.
- لا تضف محاور جديدة ولا تحذف محاور موجودة.
- لا تضف معلومات جديدة غير موجودة في النص الأصلي.
- لا تغيّر أسماء الأنظمة أو الجهات أو الأرقام إن وُجدت.
- الأسلوب المطلوب: ${toneArabic}.
${keywordsText}
أعد النتيجة بصيغة JSON فقط بالشكل الآتي (نفس عدد العناصر):
{
  "agendaItems": [
    { "title": "عنوان محسّن 1", "body": "وصف محسّن 1" },
    { "title": "عنوان محسّن 2", "body": "وصف محسّن 2" }
  ]
}

المحاور الأصلية:
${JSON.stringify(plainAgenda, null, 2)}
      `.trim();

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const responseText =
        result.response.text?.() ||
        result.response.candidates?.[0]?.content?.parts?.[0]?.text ||
        "";

      console.log("[Enhance][دعوة ورشة] raw model response:", responseText);

      const cleaned = responseText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      let enhancedJson;
      try {
        enhancedJson = JSON.parse(cleaned);
      } catch (err) {
        console.error("[Enhance][دعوة ورشة] JSON parse error:", err);
        return res.status(500).json({
          error: "PARSE_ERROR",
          raw: responseText,
        });
      }

      if (
        !enhancedJson ||
        !Array.isArray(enhancedJson.agendaItems) ||
        !enhancedJson.agendaItems.length
      ) {
        console.error("[Enhance][دعوة ورشة] invalid structure:", enhancedJson);
        return res.status(500).json({
          error: "INVALID_STRUCTURE",
          raw: enhancedJson,
        });
      }

      // نضمن نفس عدد المحاور ونظف النصوص
      const enhancedAgenda = enhancedJson.agendaItems
        .slice(0, plainAgenda.length)
        .map((item, idx) => ({
          id: agenda[idx]?.id || Date.now() + idx,
          title: typeof item.title === "string" ? item.title : plainAgenda[idx].title,
          body: typeof item.body === "string" ? item.body : plainAgenda[idx].body,
        }));

      console.log("[Enhance][دعوة ورشة] filtered agenda:", enhancedAgenda);

      return res.json({
        enhanced: {
          agendaItems: enhancedAgenda,
        },
      });
    }

        // ========= قالب إطلاق خدمة: تحسين النص التعريفي + أهداف الخدمة =========
    if (template === "إطلاق خدمة") {
      const bodyText = formData?.serviceBody || "";

      const objectives = Array.isArray(formData?.serviceObjectives)
        ? formData.serviceObjectives
        : [];

      // لو لا في نص تعريفي ولا أهداف → ما نسوي شيء
      if (!bodyText && !objectives.length) {
        return res.json({ enhanced: {} });
      }

      const toneArabic =
        styleTone === "لطيف" ? "أسلوب لطيف وبسيط" : "أسلوب رسمي وعملي";

      const keywordsText = keywords
        ? `الكلمات المفتاحية (اختياري، يمكنك أخذها بعين الاعتبار دون إضافة معلومات جديدة): ${keywords}\n`
        : "";

      // نسخة مبسّطة من الأهداف (نص فقط)
      const plainObjectives = objectives.map((obj, idx) => ({
        text: obj.text || `هدف ${idx + 1}`,
      }));

      const prompt = `
أنت مساعد لغوي محترف تكتب باللغة العربية.

المطلوب:
1) تحسين "النص التعريفي للخدمة" (serviceBody).
2) تحسين "أهداف الخدمة" (serviceObjectives) بحيث يكون كل هدف بصياغة أوضح وأكثر احترافية.

الشروط:
- حسّن وضوح اللغة، والترابط، والأسلوب.
- لا تغيّر المعنى أو الفكرة الأساسية للنص أو الأهداف.
- لا تضف معلومات جديدة غير موجودة في النص الأصلي.
- لا تغيّر أسماء الأنظمة أو الجهات أو الأرقام أو التواريخ إن وُجدت.
- الأسلوب المطلوب: ${toneArabic}.
${keywordsText}
- أعد النتيجة بصيغة JSON فقط بالشكل التالي:

{
  "serviceBody": "نص تعريفي محسّن",
  "serviceObjectives": [
    { "text": "هدف محسّن 1" },
    { "text": "هدف محسّن 2" }
  ]
}

النص التعريفي الأصلي (serviceBody):
${JSON.stringify(bodyText, null, 2)}

أهداف الخدمة الأصلية (serviceObjectives):
${JSON.stringify(plainObjectives, null, 2)}
      `.trim();

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const responseText =
        result.response.text?.() ||
        result.response.candidates?.[0]?.content?.parts?.[0]?.text ||
        "";

      console.log("[Enhance][إطلاق خدمة] raw model response:", responseText);

      const cleaned = responseText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      let enhancedJson;
      try {
        enhancedJson = JSON.parse(cleaned);
      } catch (err) {
        console.error("[Enhance][إطلاق خدمة] JSON parse error:", err);
        return res.status(500).json({
          error: "PARSE_ERROR",
          raw: responseText,
        });
      }

      // نتأكد إن فيه على الأقل body أو أهداف
      const finalBody =
        typeof enhancedJson.serviceBody === "string"
          ? enhancedJson.serviceBody
          : bodyText;

      let finalObjectives = objectives;

      if (
        Array.isArray(enhancedJson.serviceObjectives) &&
        enhancedJson.serviceObjectives.length
      ) {
        finalObjectives = enhancedJson.serviceObjectives
          .slice(0, plainObjectives.length)
          .map((item, idx) => ({
            id: objectives[idx]?.id || Date.now() + idx,
            text:
              typeof item.text === "string"
                ? item.text
                : plainObjectives[idx].text,
          }));
      }

      console.log("[Enhance][إطلاق خدمة] filtered:", {
        serviceBody: finalBody,
        serviceObjectives: finalObjectives,
      });

      return res.json({
        enhanced: {
          serviceBody: finalBody,
          serviceObjectives: finalObjectives,
        },
      });
    }
    // 1) نحدد الحقول المسموح تعديلها في هذا القالب
    const defaultAllowed = ENHANCE_FIELDS_BY_TEMPLATE[template] || [];
    const effectiveFields =
      Array.isArray(selectedFields) && selectedFields.length
        ? selectedFields
        : defaultAllowed;

    if (!effectiveFields.length) {
      return res.json({ enhanced: {} });
    }

    // 2) نأخذ النصوص الحالية من formData فقط
    const sourceFields = {};
    for (const field of effectiveFields) {
      if (formData?.[field]) {
        sourceFields[field] = formData[field];
      }
    }

    if (!Object.keys(sourceFields).length) {
      return res.json({ enhanced: {} });
    }

    const toneArabic =
      styleTone === "لطيف" ? "أسلوب لطيف وبسيط" : "أسلوب رسمي وعملي";
    const keywordsText = keywords
      ? `الكلمات المفتاحية (اختياري، يمكنك أخذها بعين الاعتبار دون إضافة معلومات جديدة): ${keywords}\n`
      : "";

    // 3) البرومبت — يطلب JSON فقط، بدون إضافة معلومات جديدة
    const prompt = `
أنت مساعد لغوي محترف تكتب باللغة العربية.

المطلوب:
- إعادة صياغة النصوص التالية في سياق تعريف رسمي بمنصة أو خدمة تقنية.
- حسّن الوضوح، والترابط، والأسلوب، لكن:
  - لا تغيّر المعنى أو الفكرة الأساسية.
  - لا تعدّل الأرقام أو التواريخ أو أسماء الأنظمة أو الجهات.
  - الطول المطلوب (طويل - اكثر من 6 اسطر للمحتوى) 
- الأسلوب المطلوب: ${toneArabic}.
${keywordsText}
- إذا كان النص قصيرًا (مثل العنوان)، فحافظ على طول قريب من النص الأصلي.
- أعد النتيجة بصيغة JSON بدون أي نص إضافي خارج JSON، وبنفس أسماء الحقول التالية فقط:
  ${effectiveFields.join(", ")}

النصوص الأصلية (بصيغة JSON):
${JSON.stringify(sourceFields, null, 2)}
    `.trim();

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const responseText =
      result.response.text?.() || result.response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    console.log("[Enhance] raw model response:", responseText);

    // أحيانًا Gemini يرجع ```json ... ``` فننظفها
    const cleaned = responseText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let enhanced = {};
    try {
      enhanced = JSON.parse(cleaned);
    } catch (err) {
      console.error("[Enhance] JSON parse error:", err);
      return res.status(500).json({
        error: "PARSE_ERROR",
        raw: responseText,
      });
    }

    // نضمن أننا ما نرجع إلا الحقول المسموح تعديلها
    const filtered = {};
    for (const f of effectiveFields) {
      if (typeof enhanced[f] === "string") {
        filtered[f] = enhanced[f];
      }
    }

    console.log("[Enhance] filtered:", filtered);

    return res.json({ enhanced: filtered });
  } catch (err) {
    console.error("Enhance API error:", err);
    return res.status(500).json({
      error: "SERVER_ERROR",
      message: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Enhance API listening on port ${PORT}`);
});