// src/pages/Create.jsx
const ENHANCE_FIELDS_BY_TEMPLATE = {
  "تعريف بمنصة أو خدمة": ["titlePrimary", "titleSecondary", "body"],
  "دعوة ورشة عمل": ["inviteLine", "audienceLine", "systemLine"],
  "إطلاق خدمة": ["serviceTagline", "serviceTitle", "serviceBody"],
};
import { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import GeneralInfoPoster from "../components/GeneralInfoPoster.jsx";
import WorkshopInvitePoster from "../components/WorkshopInvitePoster.jsx";
import ServiceLaunchPoster from "../components/ServiceLaunchPoster.jsx";

/* ————— القوالب (الحقول) ————— */
const TEMPLATES = {
  "تعريف بمنصة أو خدمة": [
    { name: "deptLine1", label: "الجهة الرئسية  (مسمى الوكالة)", type: "text" },
    { name: "deptLine2", label: "الجهة الفرعية (إدارة عامة أو إدارة)", type: "text" },
    { name: "titlePrimary", label: "العنوان الرئيسي", type: "text" },
    { name: "titleSecondary", label: "العنوان الفرعي", type: "text" },
    { name: "body", label: "النص التعريفي", type: "textarea" },
    { name: "image", label: "الصورة (مرفق)", type: "file" },
    { name: "email", label: "البريد الإلكتروني", type: "text" },
    { name: "sourceLabel", label: "نص المصدر في الأسفل", type: "text" },
  ],

  "دعوة ورشة عمل": [
    { name: "deptLine1", label: "الجهة الرئسية  (مسمى الوكالة)", type: "text" },
    { name: "deptLine2", label: "الجهة الفرعية (إدارة عامة أو إدارة)", type: "text" },

    { name: "inviteLine", label: "نص الدعوة الرئيسي", type: "text" },
    { name: "audienceLine", label: "نص الدعوة الفرعي", type: "text" },
    { name: "systemLine", label: "موضوع الورشة", type: "text" },
    { name: "sourceLabel", label: "نص المصدر في الأسفل", type: "text" },

  ],

  "إطلاق خدمة": [
    { name: "deptLine1", label: "الجهة الرئسية  (مسمى الوكالة)", type: "text" },
    { name: "deptLine2", label: "الجهة الفرعية (إدارة عامة أو إدارة)", type: "text" },

    { name: "serviceTagline", label: "العنوان الرئيسي ", type: "text" },
    { name: "serviceTitle", label: "عنوان الخدمة الرئيسي", type: "text" },
    { name: "serviceBody", label: "النص التعريفي", type: "textarea" },

    // الأهداف صارت بوكسات ديناميكية منفصلة (ما نستخدم objective1/2 هنا)

    { name: "mainImage", label: "الصورة الرئيسية", type: "file" },

    { name: "launchDate", label: "تاريخ الإطلاق", type: "text" },
    { name: "audience", label: "المستفيدون", type: "text" },
    { name: "qrLabel", label: "عنوان خانة الوصول للخدمة", type: "text" },
    { name: "accessText", label: "وصف الوصول للخدمة", type: "text" },

    { name: "qrImage", label: "صورة الباركود", type: "file" },
    { name: "email", label: "البريد الإلكتروني", type: "text" },
    { name: "sourceLabel", label: "نص المصدر في الأسفل", type: "text" },
  ],
};

/* ——— ٤ بوكسات خضراء افتراضية ——— */
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
    icon: "📎",
    text: "للانضمام للورشة يمكن مسح الباركود",
  },
];

/* ——— ٤ محاور افتراضية ——— */
const DEFAULT_AGENDA_ITEMS = [
  {
    id: 1,
    title: "خدمات الموارد المؤسسية",
    body: "التعرّف على أبرز خدمات الموارد المؤسسية وكيفية الاستفادة منها.",
  },
  {
    id: 2,
    title: "خدمات الشبكات والهواتف",
    body: "عرض موجز للخدمات الفنية المقدّمة للشبكات وأنظمة الاتصال.",
  },
  {
    id: 3,
    title: "خدمات الأمن والسلامة",
    body: "توضيح دور نظام جاهز في طلبات وخدمات الأمن والسلامة.",
  },
  {
    id: 4,
    title: "خدمات الدعم والتطبيقات",
    body: "شرح آلية رفع الطلبات للتطبيقات والدعم الفني والمتابعة.",
  },
];

/* ——— أهداف افتراضية لإطلاق خدمة (نفس نصوص البوستر) ——— */
const DEFAULT_SERVICE_OBJECTIVES = [
  {
    id: 1,
    text: "تنظيم نشاط التسويق الإلكتروني للمنتجات الزراعية للأفراد ضمن إطار نظامي واضح.",
  },
  {
    id: 2,
    text: "تمكين الأفراد السعوديين من ملاك المزارع ومنتجي المحاصيل من إنشاء متاجر إلكترونية موثوقة لبيع المنتجات الزراعية (مواد أولية أو معبأة).",
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
  return <GeneralInfoPoster data={data} />;
}

/* ——— دالة ترجع بيانات افتراضية بناءً على القالب ——— */
function getInitialData(template) {
  if (template === "دعوة ورشة عمل") {
    return {
      deptLine1: "",
      deptLine2: "",
      inviteLine: "ندعوكم لحضور ورشة عمل عن بُعد",
      audienceLine: "لتدريب منسوبي منظومة البيئة والمياه والزراعة",
      systemLine: "على نظام جاهز",
      sourceLabel: "المصدر: الهيئة السعودية للبيانات والذكاء الاصطناعي",
      boxes: DEFAULT_INVITE_BOXES.map((b) => ({ ...b })),        // ٤ بوكسات
      agendaItems: DEFAULT_AGENDA_ITEMS.map((a) => ({ ...a })),  // ٤ محاور
    };
  }

  if (template === "إطلاق خدمة") {
    return {
      deptLine1: "",
      deptLine2: "",
      serviceTagline: "إطلاق خدمة إصدار",
      sourceLabel: "المصدر: الهيئة السعودية للبيانات والذكاء الاصطناعي",
      serviceTitle:
      "تـرخـيـص الـمـتـاجـر الإلـكـتـرونـيـة للأفـراد لـتـسـويـق الـمـنـتـجـات الـزراعـيـة",
      serviceBody:
        "تمكّن أصحاب المتاجر الإلكترونية من الأفراد السعوديين من تسويق المنتجات الزراعية ضمن إطار نظامي واضح، بما في ذلك منتجي المحاصيل الذين لديهم سجل زراعي أو من يتعاقد معهم لتسويق المنتجات الزراعية كمواد أولية أو معبأة.",
      serviceObjectives: DEFAULT_SERVICE_OBJECTIVES.map((o) => ({ ...o })), // أهداف افتراضية
    };
  }

  if (template === "تعريف بمنصة أو خدمة") {
    return {
      deptLine1: "",
      deptLine2: "",
      titlePrimary: "نشرة الذكاء الاصطناعي",
      titleSecondary: "أهمية حماية البيانات في عصر الذكاء الاصطناعي",
      body: "تتزايد أهمية حماية الخصوصية والسرية في ظل الاستخدام المتنامي للذكاء الاصطناعي. من الضروري عدم مشاركة البيانات السرية مع أي جهة غير موثوقة، حيث يمكن أن تؤدي هذه الممارسات إلى انتهاك الخصوصية. بالإضافة إلى ذلك، يجب تجنب الاعتماد الكلي على تقنيات الذكاء الاصطناعي في اتخاذ القرارات، حيث إن ذلك قد يعرض البيانات الحساسة لمخاطر متعددة. لذا، ينبغي على الأفراد والمؤسسات اتخاذ تدابير فعالة لضمان حماية بياناتهم وضمان سريتها.",
      sourceLabel: "المصدر: الهيئة السعودية للبيانات والذكاء الاصطناعي",
    };
  }

  // باقي القوالب
  return {};
}

/* ————— Component الرئيسي ————— */

export default function Create({ onBack }) {
  const [template, setTemplate] = useState("تعريف بمنصة أو خدمة");
  const [styleTone, setStyleTone] = useState("رسمي");
  const [keywords, setKeywords] = useState("");
  const [formData, setFormData] = useState(() =>
    getInitialData("تعريف بمنصة أو خدمة")
  );
  const [busy, setBusy] = useState(false);

  const fields = useMemo(() => TEMPLATES[template] ?? [], [template]);

  // البوكسات لمحاذاة المعاينة (ورشة)
  const inviteBoxes =
    template === "دعوة ورشة عمل"
      ? Array.isArray(formData.boxes)
        ? formData.boxes
        : []
      : [];

  const inviteAgendaItems =
    template === "دعوة ورشة عمل"
      ? Array.isArray(formData.agendaItems)
        ? formData.agendaItems
        : []
      : [];

  // أهداف الخدمة (إطلاق خدمة)
  const serviceObjectives =
    template === "إطلاق خدمة"
      ? Array.isArray(formData.serviceObjectives)
        ? formData.serviceObjectives
        : []
      : [];

  const previewRef = useRef(null);

  // لما يتغير القالب → نضبط بيانات ابتدائية
  useEffect(() => {
    setFormData(getInitialData(template));
  }, [template]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target.result;
        setFormData((d) => ({ ...d, [name]: result }));
      };
      reader.readAsDataURL(file);
      return;
    }

    setFormData((d) => ({ ...d, [name]: value }));
  };

  const handleFileChange = (name, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result;
      setFormData((d) => ({ ...d, [name]: result }));
    };
    reader.readAsDataURL(file);
  };

  /* ————— التصدير كـ PNG ————— */
  const exportPNG = async () => {
    if (!previewRef.current) return;
    setBusy(true);

    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      const node = previewRef.current;
      const parent = node.parentElement;
      const oldTransform = parent.style.transform;
      parent.style.transform = "none";

      const width = node.offsetWidth;
      const height = node.offsetHeight;

      const canvas = await html2canvas(node, {
        scale: 2,
        width,
        height,
        backgroundColor: "#ffffff",
        useCORS: true,
      });

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

    // نحدد أي الحقول نرسلها للـ AI
    let selectedFields = [];
    if (template === "تعريف بمنصة أو خدمة") {
      selectedFields = ["titlePrimary", "titleSecondary", "body"];
    } else {
      // حالياً: لا نفعل شيء لباقي القوالب
      alert("التحسين مفعّل حالياً لقالب تعريف بمنصة أو خدمة فقط.");
      setBusy(false);
      return;
    }

    const res = await fetch("http://localhost:3001/api/enhance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template, styleTone, keywords, formData, selectedFields }),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      console.error("Enhance error HTTP:", errJson);
      alert("تعذر تحسين النص (مشكلة من الخادم).");
      return;
    }

    const json = await res.json();
    console.log("Enhance response:", json);

    if (json.enhanced) {
      setFormData((d) => ({
        ...d,
        ...json.enhanced, // يحدّث العنوان الرئيسي + الفرعي + النص
      }));
    }
  } catch (e) {
    console.error("Enhance exception:", e);
    alert("تعذر تحسين النص الآن (مشكلة اتصال).");
  } finally {
    setBusy(false);
  }
};

  /* ————— دوال البوكسات (دعوة ورشة فقط) ————— */
  const addBox = () => {
    if (template !== "دعوة ورشة عمل") return;
    setFormData((d) => {
      const boxes = Array.isArray(d.boxes) ? [...d.boxes] : [];
      if (boxes.length >= 5) return d;
      boxes.push({ id: Date.now(), label: "", text: "", icon: "" });
      return { ...d, boxes };
    });
  };

  const updateBox = (index, field, value) => {
    setFormData((d) => {
      const boxes = Array.isArray(d.boxes) ? [...d.boxes] : [];
      if (!boxes[index]) return d;
      boxes[index] = { ...boxes[index], [field]: value };
      return { ...d, boxes };
    });
  };

  const removeBox = (index) => {
    setFormData((d) => {
      const boxes = Array.isArray(d.boxes) ? [...d.boxes] : [];
      boxes.splice(index, 1);
      return { ...d, boxes };
    });
  };

  /* ————— دوال محاور الورشة ————— */
  const addAgendaItem = () => {
    if (template !== "دعوة ورشة عمل") return;
    setFormData((d) => {
      const items = Array.isArray(d.agendaItems) ? [...d.agendaItems] : [];
      if (items.length >= 6) return d;
      items.push({ id: Date.now(), title: "", body: "" });
      return { ...d, agendaItems: items };
    });
  };

  const updateAgendaItem = (index, field, value) => {
    setFormData((d) => {
      const items = Array.isArray(d.agendaItems) ? [...d.agendaItems] : [];
      if (!items[index]) return d;
      items[index] = { ...items[index], [field]: value };
      return { ...d, agendaItems: items };
    });
  };

  const removeAgendaItem = (index) => {
    setFormData((d) => {
      const items = Array.isArray(d.agendaItems) ? [...d.agendaItems] : [];
      items.splice(index, 1);
      return { ...d, agendaItems: items };
    });
  };

  /* ————— دوال أهداف الخدمة (إطلاق خدمة) ————— */
  const addServiceObjective = () => {
    if (template !== "إطلاق خدمة") return;
    setFormData((d) => {
      const items = Array.isArray(d.serviceObjectives)
        ? [...d.serviceObjectives]
        : [];
      if (items.length >= 6) return d;
      items.push({ id: Date.now(), text: "" });
      return { ...d, serviceObjectives: items };
    });
  };

  const updateServiceObjective = (index, value) => {
    setFormData((d) => {
      const items = Array.isArray(d.serviceObjectives)
        ? [...d.serviceObjectives]
        : [];
      if (!items[index]) return d;
      items[index] = { ...items[index], text: value };
      return { ...d, serviceObjectives: items };
    });
  };

  const removeServiceObjective = (index) => {
    setFormData((d) => {
      const items = Array.isArray(d.serviceObjectives)
        ? [...d.serviceObjectives]
        : [];
      items.splice(index, 1);
      return { ...d, serviceObjectives: items };
    });
  };

  // البيانات المرسلة للمعاينة
  let previewData = formData;
  if (template === "دعوة ورشة عمل") {
    previewData = {
      ...formData,
      boxes: inviteBoxes,
      agendaItems: inviteAgendaItems,
    };
  } else if (template === "إطلاق خدمة") {
    previewData = {
      ...formData,
      serviceObjectives,
    };
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 grid md:grid-cols-[420px_minmax(0,1fr)] gap-6">
      {/* يمين: لوحة الإدخال — Scrollable only */}
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
            }}
          >
            {Object.keys(TEMPLATES).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        {/* الحقول العامة */}
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
                  onChange={(e) =>
                    handleFileChange(f.name, e.target.files[0])
                  }
                />
              )}
            </div>
          ))}
        </div>

        {/* دعوة ورشة عمل: محاور + بوكسات */}
        {template === "دعوة ورشة عمل" && (
          <>
            {/* محاور الورشة */}
            <div className="mt-6 border-t pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-brand-800 text-sm">
                  محاور الورشة (حتى 6)
                </h3>
                <button
                  type="button"
                  onClick={addAgendaItem}
                  disabled={(inviteAgendaItems.length || 0) >= 6}
                  className="text-xs px-3 py-1 rounded-lg bg-brand-500 text-white disabled:opacity-40"
                >
                  + إضافة محور
                </button>
              </div>

              {inviteAgendaItems.map((item, index) => (
                <div
                  key={item.id || index}
                  className="border rounded-lg p-3 bg-slate-50 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-600">
                      محور رقم {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAgendaItem(index)}
                      className="text-[11px] text-red-500"
                    >
                      حذف
                    </button>
                  </div>

                  <input
                    type="text"
                    className="w-full border rounded-lg px-2 py-1 text-xs"
                    placeholder="عنوان المحور"
                    value={item.title || ""}
                    onChange={(e) =>
                      updateAgendaItem(index, "title", e.target.value)
                    }
                  />

                  <textarea
                    rows={3}
                    className="w-full border rounded-lg p-2 text-xs"
                    placeholder="وصف المحور..."
                    value={item.body || ""}
                    onChange={(e) =>
                      updateAgendaItem(index, "body", e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            {/* الصناديق الخضراء */}
            <div className="mt-6 border-t pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-brand-800 text-sm">
                  المربعات  الخضراء (حتى 5)
                </h3>
                <button
                  type="button"
                  onClick={addBox}
                  disabled={(inviteBoxes.length || 0) >= 5}
                  className="text-xs px-3 py-1 rounded-lg bg-brand-500 text-white disabled:opacity-40"
                >
                  + إضافة مربع
                </button>
              </div>

              {inviteBoxes.map((box, index) => (
                <div
                  key={box.id || index}
                  className="border rounded-lg p-3 bg-slate-50 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-600">
                      مربع رقم {index + 1}
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
                      placeholder=" العنوان (مثال: التاريخ)"
                      value={box.label || ""}
                      onChange={(e) =>
                        updateBox(index, "label", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className="border rounded-lg px-2 py-1 text-xs"
                      placeholder="عنوان فرعي أو أيقونة (مثال: 📅)"
                      value={box.icon || ""}
                      onChange={(e) =>
                        updateBox(index, "icon", e.target.value)
                      }
                    />
                  </div>

                  <textarea
                    rows={3}
                    className="w-full border rounded-lg p-2 text-xs"
                    placeholder="النص ..."
                    value={box.text || ""}
                    onChange={(e) =>
                      updateBox(index, "text", e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* إطلاق خدمة: أهداف الخدمة */}
        {template === "إطلاق خدمة" && (
          <div className="mt-6 border-t pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-brand-800 text-sm">
                أهداف الخدمة (حتى 6)
              </h3>
              <button
                type="button"
                onClick={addServiceObjective}
                disabled={(serviceObjectives.length || 0) >= 6}
                className="text-xs px-3 py-1 rounded-lg bg-brand-500 text-white disabled:opacity-40"
              >
                + إضافة هدف
              </button>
            </div>

            {serviceObjectives.map((obj, index) => (
              <div
                key={obj.id || index}
                className="border rounded-lg p-3 bg-slate-50 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-600">
                    هدف رقم {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeServiceObjective(index)}
                    className="text-[11px] text-red-500"
                  >
                    حذف
                  </button>
                </div>

                <textarea
                  rows={3}
                  className="w-full border rounded-lg p-2 text-xs"
                  placeholder="نص الهدف..."
                  value={obj.text || ""}
                  onChange={(e) =>
                    updateServiceObjective(index, e.target.value)
                  }
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

        {/* بوكس التصدير */}
        <div className="mt-4 border rounded-xl p-4 bg-white shadow-card space-y-3">
          <h3 className="font-bold text-brand-800 text-sm">تصدير المنشور</h3>
          <div className="flex flex-col gap-2 items-stretch md:items-end">
            <button
              onClick={exportPNG}
              disabled={busy}
              className="bg-brand-500 text-white font-semibold py-2.5 px-4 rounded-xl hover:brightness-110 disabled:opacity-60 text-sm md:w-auto w-full"
            >
              تحميل كصورة (PNG)
            </button>
            <button
              onClick={exportPDF}
              disabled={busy}
              className="bg-brand-900 text-white font-semibold py-2.5 px-4 rounded-xl hover:brightness-110 disabled:opacity-60 text-sm md:w-auto w-full"
            >
              تحميل PDF
            </button>
          </div>
        </div>
      </aside>

      {/* يسار: المعاينة — تعرض كل البوستر مع سكرول داخلي لو كان طويل */}
      <section className="md:h-[calc(100vh-6rem)] md:sticky md:top-20 flex flex-col">
        <div className="flex-1 overflow-auto flex items-start justify-center">
          <div className="origin-top scale-[0.75]">
            <div
              ref={previewRef}
              className="bg-white rounded-xl shadow-card"
              style={{ width: 900, minHeight: 1273 }}
            >
              {renderPreview(template, previewData)}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}