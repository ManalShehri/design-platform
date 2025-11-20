import { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import GeneralInfoPoster from "../components/GeneralInfoPoster.jsx";
import WorkshopInvitePoster from "../components/WorkshopInvitePoster.jsx";
import ServiceLaunchPoster from "../components/ServiceLaunchPoster.jsx";

// 950/1689
/* ————— القوالب (الحقول) ————— */
const TEMPLATES = {
 "تعريف بمنصة أو خدمة": [
  { name: "deptLine1",     label: "الجهة الرئسية  (مسمى الوكالة)", type: "text" },
  { name: "deptLine2",     label: "الجهة الفرعية (إدارة عامة أو إدارة)", type: "text" },
  { name: "titlePrimary",  label: "العنوان الرئيسي", type: "text" },
  { name: "titleSecondary",label: "العنوان الفرعي", type: "text" },
  { name: "body",          label: "النص التعريفي", type: "textarea" },
  { name: "image",         label: "الصورة (مرفق)", type: "file" },   // 👈 هنا
  { name: "email",         label: "البريد الإلكتروني", type: "text" },
  { name: "sourceLabel",   label: "نص المصدر في الأسفل", type: "text" },
//   { name: "logoUrl",       label: "رابط الشعار", type: "text" },
],
  "دعوة ورشة عمل": [
   { name: "deptLine1",     label: "الجهة الرئسية  (مسمى الوكالة)", type: "text" },
  { name: "deptLine2",     label: "الجهة الفرعية (إدارة عامة أو إدارة)", type: "text" },

    { name: "inviteLine",   label: " الدعوة الرئيسي", type: "text" },
    { name: "audienceLine", label: " الفئة المستهدفة", type: "text" },
    { name: "systemLine",   label: " النظام / الموضوع", type: "text" },

    { name: "agenda1Title", label: "محور 1 - العنوان", type: "text" },
    { name: "agenda1Body",  label: "محور 1 - الوصف",   type: "textarea" },
    { name: "agenda2Title", label: "محور 2 - العنوان", type: "text" },
    { name: "agenda2Body",  label: "محور 2 - الوصف",   type: "textarea" },
    { name: "agenda3Title", label: "محور 3 - العنوان", type: "text" },
    { name: "agenda3Body",  label: "محور 3 - الوصف",   type: "textarea" },
    { name: "agenda4Title", label: "محور 4 - العنوان", type: "text" },
    { name: "agenda4Body",  label: "محور 4 - الوصف",   type: "textarea" },

    { name: "boxDate",          label: " التاريخ", type: "text" },
    { name: "boxTime",          label: " الوقت", type: "text" },
    { name: "boxWorkshopTitle", label: "عنوان الورشة", type: "text" },
    { name: "boxAudience",      label: "الجمهور المستهدف", type: "text" },
    { name: "boxQrNote",        label: "نص الباركود", type: "text" },

    { name: "qrImage",   label: "صورة الباركود", type: "file" },
    // { name: "logoUrl",   label: "رابط الشعار (اختياري)", type: "text" },
    { name: "email",     label: "البريد الإلكتروني", type: "text" },
    { name: "sourceLabel", label: "نص التذييل (المصدر)", type: "text" },
    {name: "workshopImage", label: "صورة", type: "file"}
  ], 
  "إطلاق خدمة": [
  { name: "deptLine1",     label: "الجهة الرئسية  (مسمى الوكالة)", type: "text" },
  { name: "deptLine2",     label: "الجهة الفرعية (إدارة عامة أو إدارة)", type: "text" },

  { name: "serviceTagline", label: "العنوان (إطلاق خدمة إصدار…)", type: "text" },
  { name: "serviceTitle",   label: "عنوان الخدمة الرئيسي",       type: "text" },
  { name: "serviceBody",    label: "النص التعريفي",              type: "textarea" },

  { name: "objective1Text", label: "هدف الخدمة 01", type: "textarea" },
  { name: "objective2Text", label: "هدف الخدمة 02", type: "textarea" },

  { name: "mainImage", label: "الصورة الرئيسية", type: "file" },

  { name: "launchDate", label: "تاريخ الإطلاق", type: "text" },
  { name: "audience",   label: "المستفيدون",       type: "text" },
  { name: "qrLabel",    label: "عنوان خانة الوصول للخدمة", type: "text" },
  { name: "accessText", label: "وصف الوصول للخدمة",       type: "text" },

  { name: "qrImage",    label: "صورة الباركود", type: "file" },
//   { name: "logoUrl",    label: "رابط الشعار (اختياري)", type: "text" },
  { name: "email",      label: "البريد الإلكتروني", type: "text" },
  { name: "sourceLabel",   label: "نص المصدر في الأسفل", type: "text" },
//   { name: "sourceLabel",label: "نص الفوتر الأيمن", type: "text" },
],
};

const DEFAULT_INVITE_BOXES = [
  {
    id: 1,
    label: "التاريخ",
    icon: "📅",
    text: "الثلاثاء 11/11/2025",
  },
  {
    id: 2,
    label: "الوقت",
    icon: "⏰",
    text: "من 10:30 ص إلى 11:30 ص",
  },
  {
    id: 3,
    label: "الفئة المستهدفة",
    icon: "👥",
    text: "منسوبو منظومة البيئة والمياه والزراعة",
  },
  {
    id: 4,
    label: "الباركود",
    icon: "� QR",
    text: "للانضمام للورشة يمكن مسح الباركود",
  },
];

/* خريطة القوالب → مكوّن المعاينة */
const previewByTemplate = {
  "تعريف بمنصة أو خدمة": (data) => <GeneralInfoPoster data={data} />,
    "دعوة ورشة عمل": (data) => <WorkshopInvitePoster data={data} />,
      "إطلاق خدمة": (data) => <ServiceLaunchPoster data={data} />,

};

function renderPreview(template, data) {
  const renderer = previewByTemplate[template];
  if (renderer) return renderer(data);
  // قالب افتراضي لو الاسم غير معروف
  return <GeneralInfoPoster data={data} />;
}

/* ————— Component الرئيسي ————— */

export default function Create({ onBack }) {
  const [template, setTemplate] = useState("ورشة عمل");
  const [styleTone, setStyleTone] = useState("رسمي");
  const [keywords, setKeywords] = useState("");
  const [formData, setFormData] = useState({});
  const [busy, setBusy] = useState(false);

  const fields = useMemo(() => TEMPLATES[template] ?? [], [template]);

    // 🟢 هنا نحدد البوكسات التي ستُستخدم في الفورم والمعاينة لقالب دعوة ورشة عمل
  const inviteBoxes =
    template === "دعوة ورشة عمل"
      ? (formData.boxes && formData.boxes.length
          ? formData.boxes          // لو فيه بوكسات محفوظة من المستخدم
          : DEFAULT_INVITE_BOXES)   // لو مافي → نرجع الافتراضية
      : [];

  const previewRef = useRef(null);

  useEffect(() => {
    // مكان لأي تهيئة مستقبلية (مثل تحميل الخطوط)
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((d) => ({ ...d, [name]: value }));
    if (e.target.type === "file") {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((d) => ({ ...d, [name]: reader.result }));
    };
    reader.readAsDataURL(file);
  }
  return;
}
  };

  const handleFileChange = (name, file) => {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const result = e.target.result; // data URL
    setFormData((d) => ({ ...d, [name]: result }));
  };
  reader.readAsDataURL(file);
};
  /* ————— التصدير كـ PNG ————— */
//   const exportPNG = async () => {
//     if (!previewRef.current) return;
//     setBusy(true);
//     try {
//       const canvas = await html2canvas(previewRef.current, {
//         scale: 2,
//         backgroundColor: "#ffffff",
//         useCORS: true,
//       });
//       const dataUrl = canvas.toDataURL("image/png");
//       const a = document.createElement("a");
//       a.href = dataUrl;
//       a.download = "poster.png";
//       a.click();
//     } finally {
//       setBusy(false);
//     }
//   };

const exportPNG = async () => {
  if (!previewRef.current) return;
  setBusy(true);

  try {
    // 1) تأكد أن كل الخطوط جاهزة قبل التصوير
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const node = previewRef.current;

    // 2) نحفظ أي transform على الأب ونعطلّه مؤقتًا أثناء الالتقاط
    const parent = node.parentElement;
    const oldTransform = parent.style.transform;
    parent.style.transform = "none";

    // 3) نأخذ المقاس الحقيقي للبوستر
    const width = node.offsetWidth;
    const height = node.offsetHeight;

    const canvas = await html2canvas(node, {
      scale: 2, // جودة أعلى
      width,
      height,
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    // نرجّع الـ transform القديم
    parent.style.transform = oldTransform;

    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "poster.png";
    a.click();
  } finally {
    setBusy(false);
  }
};
  /* ————— التصدير كـ PDF ————— */
  const exportPDF = async () => {
    if (!previewRef.current) return;
    setBusy(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const ratio = canvas.width / canvas.height;
      let w = pageWidth - 60;
      let h = w / ratio;
      if (h > pageHeight - 60) {
        h = pageHeight - 60;
        w = h * ratio;
      }
      const x = (pageWidth - w) / 2;
      const y = (pageHeight - h) / 2;

      pdf.addImage(imgData, "PNG", x, y, w, h);
      pdf.save("poster.pdf");
    } finally {
      setBusy(false);
    }
  };

  /* ————— تحسين بالنص الذكي ————— */
  const enhanceText = async () => {
    try {
      setBusy(true);
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template, styleTone, keywords, formData }),
      });
      const json = await res.json();
      setFormData((d) => ({ ...d, ...json.enhanced }));
    } catch (e) {
      alert("تعذر تحسين النص الآن.");
    } finally {
      setBusy(false);
    }
  };

  const addBox = () => {
  setFormData((d) => {
    let boxes = Array.isArray(d.boxes) && d.boxes.length
      ? [...d.boxes]
      : [...DEFAULT_INVITE_BOXES];

    if (boxes.length >= 5) return d;
    boxes.push({ id: Date.now(), label: "", text: "", icon: "" });
    return { ...d, boxes };
  });
};

const updateBox = (index, field, value) => {
  setFormData((d) => {
    let boxes =
      Array.isArray(d.boxes) && d.boxes.length
        ? [...d.boxes]
        : [...DEFAULT_INVITE_BOXES];

    if (!boxes[index]) return d;
    boxes[index] = { ...boxes[index], [field]: value };
    return { ...d, boxes };
  });
};

const removeBox = (index) => {
  setFormData((d) => {
    let boxes =
      Array.isArray(d.boxes) && d.boxes.length
        ? [...d.boxes]
        : [...DEFAULT_INVITE_BOXES];

    boxes.splice(index, 1);
    return { ...d, boxes };
  });
};


  const previewData =
    template === "دعوة ورشة عمل"
      ? {
          ...formData,
          boxes: inviteBoxes, // سواء كانت افتراضية أو معدلة من المستخدم
        }
      : formData;
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 grid md:grid-cols-[420px_minmax(0,1fr)] gap-6">
      {/* يمين: لوحة الإدخال —Scrollable only */}
      <aside className="bg-white rounded-xl shadow-card p-5 md:p-6 md:h-[calc(100vh-6rem)] md:sticky md:top-20 overflow-auto">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-extrabold text-brand-800">
            إنشاء منشور جديد
          </h2>
          <button
            onClick={onBack}
            className="text-sm px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            الرجوع
          </button>
        </div>

        {/* اختيار القالب */}
        <div className="space-y-2">
          <label className="font-semibold text-slate-700">اختيار القالب</label>
          <select
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            value={template}
            onChange={(e) => {
              setTemplate(e.target.value);
              setFormData({});
            }}
          >
            {Object.keys(TEMPLATES).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        {/* الحقول */}
        <div className="mt-4 grid gap-4">
         {fields.map((f) => (
  <div key={f.name} className="space-y-1">
    <label className="font-semibold text-slate-700">{f.label}</label>

    {f.type === "textarea" && (
      <textarea
        name={f.name}
        rows={4}
        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
        onChange={handleChange}
        value={formData[f.name] || ""}
        placeholder={f.label}
      />
    )}

    {f.type === "text" && (
      <input
        type="text"
        name={f.name}
        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
        onChange={handleChange}
        value={formData[f.name] || ""}
        placeholder={f.label}
      />
    )}

    {f.type === "file" && (
      <input
        type="file"
        accept="image/*"
        className="w-full border rounded-lg p-2 text-sm bg-white"
        onChange={(e) => handleFileChange(f.name, e.target.files[0])}
      />
    )}
  </div>
))}
        </div>
        {/* =========================
    بوكسات دعوة ورشة عمل فقط
    ========================= */}
    
{template === "دعوة ورشة عمل" && (
  <div className="mt-6 border-t pt-4 space-y-3">
    <div className="flex items-center justify-between">
      <h3 className="font-bold text-brand-800 text-sm">
        الصناديق الخضراء (حتى 5)
      </h3>
      <button
        type="button"
        onClick={addBox}
        disabled={(inviteBoxes.length || 0) >= 5}
        className="text-xs px-3 py-1 rounded-lg bg-brand-500 text-white disabled:opacity-40"
      >
        + إضافة بوكس
      </button>
    </div>

    {inviteBoxes.map((box, index) => (
      <div
        key={box.id || index}
        className="border rounded-lg p-3 bg-slate-50 space-y-2"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-slate-600">
            بوكس رقم {index + 1}
          </span>
          <button
            type="button"
            onClick={() => removeBox(index)}
            className="text-[11px] text-red-500"
          >
            حذف
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            className="border rounded-lg px-2 py-1 text-xs"
            placeholder="عنوان البوكس (مثال: التاريخ)"
            value={box.label || ""}
            onChange={(e) => updateBox(index, "label", e.target.value)}
          />
          <input
            type="text"
            className="border rounded-lg px-2 py-1 text-xs"
            placeholder="أيقونة (مثال: 📅)"
            value={box.icon || ""}
            onChange={(e) => updateBox(index, "icon", e.target.value)}
          />
        </div>

        <textarea
          rows={3}
          className="w-full border rounded-lg p-2 text-xs"
          placeholder="نص البوكس..."
          value={box.text || ""}
          onChange={(e) => updateBox(index, "text", e.target.value)}
        />
      </div>
    ))}
  </div>
)}

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
              <label className="block text-sm font-semibold">
                كلمات مفتاحية
              </label>
              <input
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="ابتكار، تمكين، تعلّم…"
              />
            </div>
          </div>
          <button
            onClick={enhanceText}
            disabled={busy}
            className="mt-2 bg-brand-500 text-white font-semibold px-4 py-2 rounded-lg hover:brightness-110 disabled:opacity-60"
          >
            تحسين المحتوى
          </button>
        </div>
      </aside>

<section className="md:h-[calc(100vh-6rem)] md:sticky md:top-20 flex flex-col">
  <div className="flex-1 flex items-center justify-center">
    <div className="origin-top scale-[0.75]">
      <div
        ref={previewRef}
        className="bg-white rounded-xl shadow-card overflow-hidden"
        style={{ width: 900, height: 1273 }} // حجم البوستر الفعلي
      >
        {renderPreview(template, previewData)}
      </div>
    </div>
  </div>

  <div className="pt-4 grid sm:grid-cols-2 gap-3">
    <button
      onClick={exportPNG}
      disabled={busy}
      className="bg-brand-500 text-white font-semibold py-3 rounded-xl hover:brightness-110 disabled:opacity-60"
    >
      تحميل كصورة (PNG)
    </button>
    <button
      onClick={exportPDF}
      disabled={busy}
      className="bg-brand-900 text-white font-semibold py-3 rounded-xl hover:brightness-110 disabled:opacity-60"
    >
      تحميل PDF
    </button>
  </div>
</section>

    </div>
  );
}