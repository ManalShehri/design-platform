// src/pages/Create.jsx
import { FiAlertTriangle, FiZap, FiPower, FiSlash } from "react-icons/fi";
import { useEffect, useMemo, useRef, useState } from "react";
import GeneralInfoPoster from "../Posters/GeneralInfoPoster.jsx";
import WorkshopInvitePoster from "../Posters/WorkshopInvitePoster.jsx";
import ServiceLaunchPoster from "../Posters/ServiceLaunchPoster.jsx";
import SafetyPoster from "../Posters/SafetyPoster";
import ExecutiveSummaryPoster from "../Posters/ExecutiveSummaryPoster.jsx";
import { ICON_OPTIONS as SAFETY_ICON_OPTIONS } from "../iconsConfig";
import {
  ENHANCE_FIELDS_BY_TEMPLATE,
  TEMPLATES,
  DEFAULT_INVITE_BOXES,
  DEFAULT_AGENDA_ITEMS,
  DEFAULT_SERVICE_OBJECTIVES,
} from "./create.constants";
import { getInitialData } from "./create.initialData";

import { exportNodeAsPNG, exportNodeAsPDF } from "./create.exporters";
// import { renderPreview } from "./create.preview";
/* خريطة القوالب → مكوّن المعاينة */
const previewByTemplate = {
  "تعريف بمنصة أو خدمة": (data) => <GeneralInfoPoster data={data} />,
  "دعوة ورشة عمل": (data) => <WorkshopInvitePoster data={data} />,
  "إطلاق خدمة": (data) => <ServiceLaunchPoster data={data} />,
  "قالب بخلفية صورة": (data) => <SafetyPoster data={data} />,
  "ملخص تنفيذي": (data) => <ExecutiveSummaryPoster data={data} />,
};

function renderPreview(template, data) {
  const renderer = previewByTemplate[template];
  if (renderer) return renderer(data);
  return <GeneralInfoPoster data={data} />;
}

// ====== Text limit helper ======
const MAX_CHARS = 400;
const MAX_WORDS = 100;

// ====== Text limit helper (ديناميكي حسب القيم) ======
function limitText(value, { maxChars, maxWords } = {}) {
  if (!value) return value;
  let text = value;

  // حد أقصى للحروف
  if (maxChars && text.length > maxChars) {
    text = text.slice(0, maxChars);
  }

  // حد أقصى للكلمات
  if (maxWords) {
    const words = text.split(/\s+/);
    if (words.length > maxWords) {
      text = words.slice(0, maxWords).join(" ");
    }
  }

  return text;
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
  const [iconSearch, setIconSearch] = useState("");

  // ✅ حالة لِلودينق الذكاء الاصطناعي + رسالة حالة
  const [aiLoading, setAiLoading] = useState(false);     // لما الـ AI يشتغل
  const [aiMessage, setAiMessage] = useState("");        // لعرض "جاري التحسين" أو "تم بنجاح"
  const fields = useMemo(() => TEMPLATES[template] ?? [], [template]);
  // 🔍 بحث مخصص لكل عنصر سلامة (مفتاحه = item.id)
  const [safetyIconSearch, setSafetyIconSearch] = useState({});
  const [workshopIconSearch, setWorkshopIconSearch] = useState({});

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

  const safetyItems =
    template === "قالب بخلفية صورة" && Array.isArray(formData.safetyItems)
      ? formData.safetyItems
      : [];

  // ✅ الأيقونات بعد تطبيق البحث
  const filteredIconOptions = SAFETY_ICON_OPTIONS.filter((opt) => {
    const query = iconSearch.trim().toLowerCase();
    if (!query) return true; // لو مافي بحث، رجّع الكل
    return (
      opt.label.toLowerCase().includes(query) ||
      opt.key.toLowerCase().includes(query)
    );
  });

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

    // 🎯 هنا تحددين الليمت حسب نوع الحقل
    let limits = {};

    // نصوص رئيسية طويلة (فقرات)
    if (["body", "serviceBody", "subTitle"].includes(name)) {
      limits = { maxChars: 500, maxWords: 90 }; // غيّري الأرقام براحتك
    }
    // عناوين رئيسية / فرعية
    else if (
      ["titlePrimary", "titleSecondary", "serviceTagline", "serviceTitle", "mainTitle"].includes(name)
    ) {
      limits = { maxChars: 120, maxWords: 20 };
    }
    // نص المصدر أو حقول أخرى
    else {
      limits = { maxChars: 200, maxWords: 35 };
    }

    const limited = limitText(value, limits);

    setFormData((d) => ({ ...d, [name]: limited }));
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

  const exportPNG = async () => {
  if (!previewRef.current) return;
  setBusy(true);
  try { await exportNodeAsPNG(previewRef.current); }
  finally { setBusy(false); }
};

  const exportPDF = async () => {
  if (!previewRef.current) return;
  setBusy(true);
  try { await exportNodeAsPDF(previewRef.current); }
  finally { setBusy(false); }
};

  /* ————— تحسين بالنص الذكي ————— */
const enhanceText = async () => {
  try {
    // ✅ بداية التحسين: نفعّل اللودينق ونحط رسالة انتظار
    setAiLoading(true);
    setAiMessage("جاري تحسين المحتوى بالذكاء الاصطناعي...");

    let selectedFields = [];

    if (template === "تعريف بمنصة أو خدمة") {
      selectedFields = ["titlePrimary", "titleSecondary", "body"];
    } else if (template === "دعوة ورشة عمل") {
      selectedFields = [];
    } else if (template === "إطلاق خدمة") {
      selectedFields = [];
    } else {
      setAiMessage(
        "التحسين مفعّل حالياً للقوالب: تعريف بمنصة أو خدمة، دعوة ورشة عمل، وإطلاق خدمة."
      );
      return;
    }

    const res = await fetch("http://localhost:3001/api/enhance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        template,
        styleTone,
        keywords,
        formData,
        selectedFields,
      }),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      console.error("Enhance error HTTP:", errJson);
      setAiMessage("تعذر تحسين النص (مشكلة من الخادم).");
      return;
    }

    const json = await res.json();
    console.log("Enhance response:", json);

    if (json.enhanced) {
      setFormData((d) => ({
        ...d,
        ...json.enhanced,
      }));

      // ✅ هنا نعرض رسالة نجاح
      setAiMessage("تم تحسين المحتوى بنجاح");
    } else {
      setAiMessage("لم يتم استلام محتوى محسّن من الخادم.");
    }
  } catch (e) {
    console.error("Enhance exception:", e);
    setAiMessage("تعذر تحسين النص الآن (مشكلة اتصال).");
  } finally {
    // ✅ انتهاء التحسين: نوقف اللودينق
    setAiLoading(false);
  }
};

  /* ————— دوال البوكسات (دعوة ورشة فقط) ————— */
  const addBox = () => {
    if (template !== "دعوة ورشة عمل") return;
    setFormData((d) => {
      const boxes = Array.isArray(d.boxes) ? [...d.boxes] : [];
      if (boxes.length >= 5) return d;
      boxes.push({ id: Date.now(), label: "", text: "", iconKey: "" });
      return { ...d, boxes };
    });
  };

  const updateBox = (index, field, value) => {
    setFormData((d) => {
      const boxes = Array.isArray(d.boxes) ? [...d.boxes] : [];
      if (!boxes[index]) return d;

      let v = value;

      if (field === "label") {
        v = limitText(value, { maxChars: 80, maxWords: 10 });
      } else if (field === "text") {
        v = limitText(value, { maxChars: 220, maxWords: 40 });
      }

      boxes[index] = { ...boxes[index], [field]: v };
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
      items[index] = { ...items[index], [field]: limitText(value) }; // ✅
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
      items[index] = { ...items[index], text: limitText(value) }; // ✅
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

    /* ————— دوال عناصر السلامة (قالب بخلفية صورة) ————— */
  const addSafetyItem = () => {
    if (template !== "قالب بخلفية صورة") return;

    setFormData((d) => {
      const items = Array.isArray(d.safetyItems) ? [...d.safetyItems] : [];
      if (items.length >= 4) return d; // حد أعلى ٤ بوكسات
      items.push({ id: Date.now(), iconKey: "", text: "" });
      return { ...d, safetyItems: items };
    });
  };

  const updateSafetyItem = (index, field, value) => {
    setFormData((d) => {
      const items = Array.isArray(d.safetyItems) ? [...d.safetyItems] : [];
      if (!items[index]) return d;

      // iconKey ما يحتاج حد نص طويل، لكن نطبق على النص
      if (field === "text") {
        items[index] = { ...items[index], [field]: limitText(value) };
      } else {
        items[index] = { ...items[index], [field]: value };
      }

      return { ...d, safetyItems: items };
    });
  };

  const removeSafetyItem = (index) => {
    setFormData((d) => {
      const items = Array.isArray(d.safetyItems) ? [...d.safetyItems] : [];
      items.splice(index, 1);
      return { ...d, safetyItems: items };
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

    // 🧠 دالة صغيرة لتصفية الأيقونات حسب البحث
  const filterIconOptions = (searchTerm) => {
    if (!searchTerm) return SAFETY_ICON_OPTIONS;

    const s = searchTerm.trim().toLowerCase();
    return SAFETY_ICON_OPTIONS.filter((opt) => {
      return (
        opt.label.toLowerCase().includes(s) ||
        opt.key.toLowerCase().includes(s) ||
        (opt.category && opt.category.toLowerCase().includes(s))
      );
    });
  };

  const execRows =
    template === "ملخص تنفيذي" && Array.isArray(formData.tableRows)
      ? formData.tableRows
      : [];

  const addExecRow = () => {
    if (template !== "ملخص تنفيذي") return;
    setFormData((d) => {
      const rows = Array.isArray(d.tableRows) ? [...d.tableRows] : [];
      if (rows.length >= 6) return d;
      rows.push({ id: Date.now(), col1: "", col2: "" });
      return { ...d, tableRows: rows };
    });
  };

  const updateExecRow = (index, field, value) => {
    if (template !== "ملخص تنفيذي") return;
    setFormData((d) => {
      const rows = Array.isArray(d.tableRows) ? [...d.tableRows] : [];
      if (!rows[index]) return d;
      rows[index] = { ...rows[index], [field]: value };
      return { ...d, tableRows: rows };
    });
  };

  const removeExecRow = (index) => {
    if (template !== "ملخص تنفيذي") return;
    setFormData((d) => {
      const rows = Array.isArray(d.tableRows) ? [...d.tableRows] : [];
      rows.splice(index, 1);
      return { ...d, tableRows: rows };
    });
  };  

const isLandscape = template === "ملخص تنفيذي";


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
            الرئيسية
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
                  الأيقونات   (حتى 5)
                </h3>
                <button
                  type="button"
                  onClick={addBox}
                  disabled={(inviteBoxes.length || 0) >= 5}
                  className="text-xs px-3 py-1 rounded-lg bg-brand-500 text-white disabled:opacity-40"
                >
                  + إضافة أيقونة
                </button>
              </div>

            {inviteBoxes.map((box, index) => {
              const searchTerm = workshopIconSearch[box.id] || "";
              const filteredOptions = filterIconOptions(searchTerm);

              return (
                <div
                  key={box.id || index}
                  className="border rounded-lg p-3 bg-slate-50 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-600">
                      أيقونة رقم {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeBox(index)}
                      className="text-[11px] text-red-500"
                    >
                      حذف
                    </button>
                  </div>

                  {/* العنوان */}
                  <input
                    type="text"
                    className="border rounded-lg px-2 py-1 text-xs w-full"
                    placeholder="العنوان (مثال: التاريخ)"
                    value={box.label || ""}
                    onChange={(e) => updateBox(index, "label", e.target.value)}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.5fr)_minmax(0,2fr)] gap-2">
                    {/* 🔍 بحث + قائمة الأيقونات */}
                    <div className="space-y-1">
                      <input
                        className="w-full border rounded-lg px-2 py-1 text-xs"
                        placeholder="ابحث عن الأيقونة (وقت، تاريخ، بريد، أمن...)"
                        value={searchTerm}
                        onChange={(e) =>
                          setWorkshopIconSearch((prev) => ({
                            ...prev,
                            [box.id]: e.target.value,
                          }))
                        }
                      />

                      <select
                        className="w-full border rounded-lg px-2 py-2 text-xs"
                        value={box.iconKey || ""}
                        onChange={(e) =>
                          updateBox(index, "iconKey", e.target.value)
                        }
                      >
                        <option value="">اختر الأيقونة...</option>
                        {filteredOptions.map((opt) => (
                          <option key={opt.key} value={opt.key}>
                            {opt.preview} {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* نص البوكس */}
                    <textarea
                      rows={2}
                      className="w-full border rounded-lg p-2 text-xs"
                      placeholder="النص ..."
                      value={box.text || ""}
                      onChange={(e) =>
                        updateBox(index, "text", e.target.value)
                      }
                    />
                  </div>
                </div>
              );
            })}
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
                {/* قالب بخلفية صورة: عناصر السلامة مع اختيار أيقونات */}
        {template === "قالب بخلفية صورة" && (
          <div className="mt-6 border-t pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-brand-800 text-sm">
                عناصر البوستر (حتى 4)
              </h3>
              <button
                type="button"
                onClick={addSafetyItem}
                disabled={(safetyItems.length || 0) >= 4}
                className="text-xs px-3 py-1 rounded-lg bg-brand-500 text-white disabled:opacity-40"
              >
                + إضافة عنصر
              </button>
            </div>

            {safetyItems.map((item, index) => {
              const searchTerm = safetyIconSearch[item.id] || "";
              const filteredOptions = filterIconOptions(searchTerm);

              return (
                <div
                  key={item.id || index}
                  className="border rounded-lg p-3 bg-slate-50 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-600">
                      عنصر رقم {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSafetyItem(index)}
                      className="text-[11px] text-red-500"
                    >
                      حذف
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.5fr)_minmax(0,2fr)] gap-2">
                    {/* 🔍 حقل بحث عن الأيقونة */}
                    <div className="space-y-1">
                      <input
                        className="w-full border rounded-lg px-2 py-1 text-xs"
                        placeholder="ابحث عن الأيقونة (مثال: سلامة، بريد، أمن...)"
                        value={searchTerm}
                        onChange={(e) =>
                          setSafetyIconSearch((prev) => ({
                            ...prev,
                            [item.id]: e.target.value,
                          }))
                        }
                      />

                      {/* اختيار الأيقونة من القائمة المفلترة */}
                      <select
                        className="w-full border rounded-lg px-2 py-2 text-xs"
                        value={item.iconKey || ""}
                        onChange={(e) =>
                          updateSafetyItem(index, "iconKey", e.target.value)
                        }
                      >
                        <option value="">اختر الأيقونة...</option>
                        {filteredOptions.map((opt) => (
                          <option key={opt.key} value={opt.key}>
                            {opt.preview} {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* نص العنصر */}
                    <textarea
                      rows={2}
                      className="w-full border rounded-lg p-2 text-xs"
                      placeholder="نص الإرشاد أو المعلومة..."
                      value={item.text || ""}
                      onChange={(e) =>
                        updateSafetyItem(index, "text", e.target.value)
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {template === "ملخص تنفيذي" && (
          <div className="mt-6 border-t pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-brand-800 text-sm">صفوف الجدول (حتى 6)</h3>
              <button
                type="button"
                onClick={addExecRow}
                disabled={execRows.length >= 6}
                className="text-xs px-3 py-1 rounded-lg bg-brand-500 text-white disabled:opacity-40"
              >
                + إضافة صف
              </button>
            </div>

            {execRows.map((row, idx) => (
              <div key={row.id || idx} className="border rounded-lg p-3 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">صف رقم {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeExecRow(idx)}
                    className="text-[11px] text-red-500"
                  >
                    حذف
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="w-full border rounded-lg px-2 py-2 text-xs"
                    placeholder="العمود الأول"
                    value={row.col1 || ""}
                    onChange={(e) => updateExecRow(idx, "col1", e.target.value)}
                  />
                  <input
                    className="w-full border rounded-lg px-2 py-2 text-xs"
                    placeholder="العمود الثاني"
                    value={row.col2 || ""}
                    onChange={(e) => updateExecRow(idx, "col2", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI تحسين */}
        <div className="mt-6 border rounded-xl p-4 bg-slate-50 space-y-3">
          <h3 className="font-bold text-brand-800">التحسين بالذكاء الاصطناعي</h3>
          <p className="text-accent-brown"> الرجاء التأكد من عدم مشاركة بيانات سرية في حال رغبتك في تفعيل التحسين بالذكاء الاصطناعي</p>
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
            disabled={busy || aiLoading}   // ❗ يتعطّل لو التصدير شغال أو الـ AI شغال
            className="w-full mt-2 bg-brand-500 text-white font-semibold px-4 py-2 rounded-lg hover:brightness-110 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {aiLoading ? "جاري التحسين..." : "تحسين المحتوى"}
          </button>
          {/* رسالة حالة الذكاء الاصطناعي */}
          {aiMessage && (
            <p className="mt-2 text-xs text-slate-600">
              {aiMessage}
            </p>
          )}
        </div>

        {/* بوكس التصدير */}
        <div className="mt-4 border rounded-xl p-4 bg-white shadow-card space-y-3">
          <h3 className="font-bold text-brand-800 text-sm">تصدير المنشور</h3>
          <div className="flex flex-col gap-2">
            <button
              onClick={exportPNG}
              disabled={busy}
              className="w-full bg-brand-500 text-white font-semibold py-3 px-4 rounded-xl hover:brightness-110 disabled:opacity-60 text-sm"
            >
              تحميل كصورة (PNG)
            </button>
            <button
              onClick={exportPDF}
              disabled={busy}
              className="w-full bg-brand-900 text-white font-semibold py-3 px-4 rounded-xl hover:brightness-110 disabled:opacity-60 text-sm"
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
              // style={{ width: 900, minHeight: 1273 }}
              style={
                  isLandscape
                    ? { width: 1273, height: 716 }   // 16:9
                    : { width: 900, minHeight: 1273 } // باقي القوالب
                }
            >
              {renderPreview(template, previewData)}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}