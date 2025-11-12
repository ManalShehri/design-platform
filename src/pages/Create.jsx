import { useMemo, useState } from "react";

const TEMPLATES = {
  "ورشة عمل": [
    { name: "title",    label: "عنوان الورشة", type: "text" },
    { name: "date",     label: "التاريخ",      type: "text" },
    { name: "duration", label: "المدة",        type: "text" },
    { name: "topics",   label: "محاور الورشة (سطر لكل محور)", type: "textarea" },
  ],
  "إعلان توعوي": [
    { name: "mainTitle", label: "العنوان الرئيسي", type: "text" },
    { name: "subTitle",  label: "العنوان الفرعي",  type: "text" },
    { name: "content",   label: "المحتوى",        type: "textarea" },
    { name: "images",    label: "روابط صور (مفصولة بفواصل)", type: "text" },
  ],
};

export default function Create({ onBack }) {
  const [template, setTemplate] = useState("ورشة عمل");
  const [styleTone, setStyleTone] = useState("رسمي");
  const [keywords, setKeywords] = useState("");
  const [formData, setFormData] = useState({});
  const fields = useMemo(() => TEMPLATES[template] ?? [], [template]);

  const handleChange = (e) => setFormData((d) => ({ ...d, [e.target.name]: e.target.value }));

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 grid md:grid-cols-[420px_minmax(0,1fr)] gap-6">
      {/* يمين: لوحة الإدخال */}
      <aside className="bg-white rounded-xl2 shadow-card p-5 md:p-7 h-max md:sticky md:top-20">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-brand-800">إنشاء منشور جديد</h2>
          <button onClick={onBack} className="text-sm px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">
            الرجوع
          </button>
        </div>

        {/* اختيار القالب */}
        <div className="mt-5 space-y-2">
          <label className="font-semibold text-slate-700">اختيار القالب</label>
          <select
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            value={template}
            onChange={(e) => { setTemplate(e.target.value); setFormData({}); }}
          >
            {Object.keys(TEMPLATES).map((key) => <option key={key} value={key}>{key}</option>)}
          </select>
        </div>

        {/* الحقول */}
        <div className="mt-4 grid gap-4">
          {fields.map((f) => (
            <div key={f.name} className="space-y-1">
              <label className="font-semibold text-slate-700">{f.label}</label>
              {f.type === "textarea" ? (
                <textarea
                  name={f.name}
                  rows={4}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  onChange={handleChange}
                  value={formData[f.name] || ""}
                  placeholder={f.label}
                />
              ) : (
                <input
                  type="text"
                  name={f.name}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  onChange={handleChange}
                  value={formData[f.name] || ""}
                  placeholder={f.label}
                />
              )}
            </div>
          ))}
        </div>

        {/* AI تحسين */}
        <div className="mt-6 border rounded-xl p-4 bg-slate-50 space-y-3">
          <h3 className="font-bold text-brand-800">التحسين بالذكاء الاصطناعي</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold">الأسلوب</label>
              <select
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={styleTone}
                onChange={(e) => setStyleTone(e.target.value)}
              >
                <option>رسمي</option>
                <option>لطيف</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold">كلمات مفتاحية</label>
              <input
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="ابتكار، تمكين، تعلّم…"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500">لاحقًا سنربط محرّك صياغة لتكييف النص حسب الأسلوب والكلمات.</p>
        </div>
      </aside>

      {/* يسار: المعاينة + أزرار التحميل */}
      <section className="space-y-4">
        <div className="bg-white rounded-xl2 shadow-card p-5 md:p-7">
          <h3 className="text-lg font-bold text-brand-800">المعاينة</h3>
          <div className="mt-4">
            {template === "ورشة عمل" ? (
              <WorkshopPreview data={formData} tone={styleTone} />
            ) : (
              <AwarenessPreview data={formData} tone={styleTone} />
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <button className="bg-brand-500 text-white font-semibold py-3 rounded-xl hover:brightness-110 transition">
            تحميل كصورة (PNG)
          </button>
          <button className="bg-brand-900 text-white font-semibold py-3 rounded-xl hover:brightness-110 transition">
            تحميل PDF
          </button>
        </div>
      </section>
    </div>
  );
}

/* ——— معاينات ——— */

function Badge({ children, color = "#46C752" }) {
  return (
    <span className="inline-block rounded-full px-3 py-1 text-sm font-semibold text-white" style={{ backgroundColor: color }}>
      {children}
    </span>
  );
}

function ToneNote({ tone }) {
  return (
    <p className="text-xs text-slate-500 mt-2">
      ملاحظة الأسلوب: <strong>{tone}</strong>
    </p>
  );
}

function WorkshopPreview({ data }) {
  const { title, date, duration, topics } = data;
  const lines = (topics || "").split("\n").filter(Boolean);

  return (
    <div className="border rounded-xl p-5 space-y-3">
      <Badge>ورشة عمل</Badge>
      <h1 className="text-2xl font-extrabold text-brand-800">{title || "عنوان الورشة"}</h1>
      <div className="grid sm:grid-cols-2 gap-2 text-slate-700">
        <p><strong>التاريخ:</strong> {date || "—"}</p>
        <p><strong>المدة:</strong> {duration || "—"}</p>
      </div>
      <div className="mt-2">
        <h2 className="font-bold text-brand-800">محاور الورشة</h2>
        {lines.length ? (
          <ul className="list-disc pr-5 text-slate-800 leading-8">{lines.map((l, i) => <li key={i}>{l}</li>)}</ul>
        ) : (
          <p className="text-slate-500">أدخل محاور الورشة (كل محور في سطر)</p>
        )}
      </div>
      <ToneNote />
    </div>
  );
}

function AwarenessPreview({ data }) {
  const { mainTitle, subTitle, content, images } = data;
  const imgs = (images || "").split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div className="border rounded-xl p-5 space-y-3">
      <Badge color="#02CCDF">إعلان توعوي</Badge>
      <h1 className="text-2xl font-extrabold text-brand-800">{mainTitle || "العنوان الرئيسي"}</h1>
      <h2 className="text-xl font-bold text-slate-800">{subTitle || "العنوان الفرعي"}</h2>
      <p className="text-slate-700 leading-8">{content || "اكتب المحتوى التوعوي هنا…"}</p>

      {imgs.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {imgs.map((src, i) => (
            <img key={i} src={src} alt="" className="w-full h-32 object-cover rounded-lg border" />
          ))}
        </div>
      )}
      <ToneNote />
    </div>
  );
}