import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const { template, styleTone, keywords, formData } = req.body;

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
أنت مساعد لتنسيق محتوى منشورات رسمية.
النبرة: ${styleTone}
الكلمات المفتاحية: ${keywords}

أعيدي صياغة المحتوى التالي بطريقة محسّنة:
${JSON.stringify(formData, null, 2)}
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: "أنت محرر محترف." },
                 { role: "user", content: prompt }],
    });

    const enhancedText = completion.choices[0].message.content;

    // رجّعي النتيجة للواجهة
    res.status(200).json({ enhanced: JSON.parse(enhancedText) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to enhance text." });
  }
}