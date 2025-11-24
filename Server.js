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
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-light" });
// const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


// 👇 الحقول اللي نسمح للـ AI يعدلها لكل قالب
const ENHANCE_FIELDS_BY_TEMPLATE = {
  "تعريف بمنصة أو خدمة": ["titlePrimary", "titleSecondary", "body"],
};

// =========  API: /api/enhance  ==========
app.post("/api/enhance", async (req, res) => {
  try {
    const { template, styleTone, keywords, formData, selectedFields } = req.body;

    console.log("[Enhance] template:", template);

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
  - لا تضف معلومات جديدة غير موجودة في النص الأصلي.
  - لا تعدّل الأرقام أو التواريخ أو أسماء الأنظمة أو الجهات.
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