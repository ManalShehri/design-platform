import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// POST /api/enhance
app.post("/api/enhance", async (req, res) => {
  const { template, styleTone, keywords, formData } = req.body;
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `
أنت مساعد تحرير عربي. أعطِ صياغة محسّنة ومختصرة للنص بناءً على:
- نوع القالب: ${template}
- الأسلوب: ${styleTone}
- الكلمات المفتاحية: ${keywords}
- البيانات: ${JSON.stringify(formData, null, 2)}

أعد نفس الحقول فقط بنص عربي منسّق (لا تغيّر أسماء المفاتيح)، مثال المخرجات:
{ "title": "...", "date": "...", "duration": "...", "topics": "سطر1\\nسطر2", "mainTitle": "...", "subTitle": "...", "content": "...", "image": "${formData.image||""}" }
    `.trim();

    const resp = await openai.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
      temperature: 0.7,
    });

    // استخرج النص
    const text = resp.output_text || "";
    // حاول نفكّه كـ JSON (لو فشل، رجّع النص كما هو داخل content)
    let enhanced = {};
    try { enhanced = JSON.parse(text); } catch { enhanced = { content: text }; }

    res.json({ enhanced });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "AI enhancement failed" });
  }
});

// شغّل الخادم
const PORT = process.env.PORT || 8787;
app.listen(PORT, () => console.log("API running on http://localhost:"+PORT));