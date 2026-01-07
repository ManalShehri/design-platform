// src/pages/Create.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import GeneralInfoPoster from "../Posters/GeneralInfoPoster.jsx";
import WorkshopInvitePoster from "../Posters/WorkshopInvitePoster.jsx";
import ServiceLaunchPoster from "../Posters/ServiceLaunchPoster.jsx";
import SafetyPoster from "../Posters/SafetyPoster";
import ExecutiveSummaryPoster from "../Posters/ExecutiveSummaryPoster.jsx";

// Panels of the create page
import TemplateFieldsSection from "./createPanels/TemplateFieldsPanel.jsx";
import WorkshopSection from "./createPanels/WorkshopPanel.jsx";
import ServiceObjectivesSection from "./createPanels/ServiceObjectivesPanel.jsx";
import SafetySection from "./createPanels/SafetyPanel.jsx";
import ExecutiveSummarySection from "./createPanels/ExecutiveSummaryPanel.jsx";
import AiEnhanceSection from "./createPanels/AiEnhancePanel.jsx";
import AiConfirmModal from "./createPanels/AiConfirmModal.jsx";
import PreviewSection from "./createPanels/PreviewSection.jsx";

import { ICON_OPTIONS as SAFETY_ICON_OPTIONS } from "../iconsConfig";
import {
  ENHANCE_FIELDS_BY_TEMPLATE,
  TEMPLATES,
  DEFAULT_INVITE_BOXES,
  DEFAULT_AGENDA_ITEMS,
  DEFAULT_SERVICE_OBJECTIVES,
} from "./create.constants";
import { getInitialData } from "./create.initialData";
import { limitText } from "./create.textLimits";
// import { renderPreview } from "./preview";

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
  const [aiModalOpen, setAiModalOpen] = useState(false);
  // const [aiStage, setAiStage] = useState("idle"); // idle | confirm | loading | done
  const [showAiConfirm, setShowAiConfirm] = useState(false);
  const [aiStage, setAiStage] = useState("idle"); 
// idle | confirm | loading | done
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

const enhanceText = async () => {
  setAiStage("confirm");
  setShowAiConfirm(true);
  setAiMessage("");
};

const handleAiConfirm = async () => {
  await runEnhance();
};

// الدالة الفعلية اللي تشغل التحسين بعد "متابعة"
const runEnhance = async () => {
  try {
    setAiStage("loading");
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
      setAiStage("done");
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
      setAiStage("done");
      return;
    }

    const json = await res.json();
    console.log("Enhance response:", json);

    if (json.enhanced) {
      setFormData((d) => ({
        ...d,
        ...json.enhanced,
      }));
      setAiMessage("تم تحسين المحتوى بنجاح");
    } else {
      setAiMessage("لم يتم استلام محتوى محسّن من الخادم.");
    }

    setAiStage("done");
  } catch (e) {
    console.error("Enhance exception:", e);
    setAiMessage("تعذر تحسين النص الآن (مشكلة اتصال).");
    setAiStage("done");
  } finally {
    setAiLoading(false);
    setShowAiConfirm(true);
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
        <TemplateFieldsSection
                  fields={fields}
                  formData={formData}
                  handleChange={handleChange}
                  handleFileChange={handleFileChange}
                />
        {template === "دعوة ورشة عمل" && (
          <WorkshopSection
            inviteAgendaItems={inviteAgendaItems}
            addAgendaItem={addAgendaItem}
            removeAgendaItem={removeAgendaItem}
            updateAgendaItem={updateAgendaItem}
            inviteBoxes={inviteBoxes}
            addBox={addBox}
            removeBox={removeBox}
            updateBox={updateBox}
            workshopIconSearch={workshopIconSearch}
            setWorkshopIconSearch={setWorkshopIconSearch}
            filterIconOptions={filterIconOptions}
          />
        )}

        {template === "إطلاق خدمة" && (
                  <ServiceObjectivesSection
                    serviceObjectives={serviceObjectives}
                    addServiceObjective={addServiceObjective}
                    removeServiceObjective={removeServiceObjective}
                    updateServiceObjective={updateServiceObjective}
                  />
                )}
                {/* قالب بخلفية صورة: عناصر السلامة مع اختيار أيقونات */}
       {template === "قالب بخلفية صورة" && (
                <SafetySection
                  safetyItems={safetyItems}
                  addSafetyItem={addSafetyItem}
                  removeSafetyItem={removeSafetyItem}
                  updateSafetyItem={updateSafetyItem}
                  safetyIconSearch={safetyIconSearch}
                  setSafetyIconSearch={setSafetyIconSearch}
                  filterIconOptions={filterIconOptions}
                />
              )}
{template === "ملخص تنفيذي" && (
          <ExecutiveSummarySection
            execRows={execRows}
            addExecRow={addExecRow}
            removeExecRow={removeExecRow}
            updateExecRow={updateExecRow}
          />
        )}

         <AiEnhanceSection
                  styleTone={styleTone}
                  setStyleTone={setStyleTone}
                  keywords={keywords}
                  setKeywords={setKeywords}
                  busy={busy}
                  aiLoading={aiLoading}
                  setAiStage={setAiStage}
                  setShowAiConfirm={setShowAiConfirm}
                />

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
       <PreviewSection
              previewRef={previewRef}
              isLandscape={isLandscape}
              renderPreview={renderPreview}
              template={template}
              previewData={previewData}
            />

 <AiConfirmModal
        showAiConfirm={showAiConfirm}
        aiStage={aiStage}
        setShowAiConfirm={setShowAiConfirm}
        setAiStage={setAiStage}
        handleAiConfirm={handleAiConfirm}
      />

    </div>
  );
}