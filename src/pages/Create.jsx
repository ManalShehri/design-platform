// src/pages/Create.jsx
// import { IconName } from "react-icons/ai";
import { FiAlertTriangle, FiZap, FiPower, FiSlash } from "react-icons/fi";

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
import SafetyPoster from "../components/SafetyPoster";
import ExecutiveSummaryPoster from "../components/ExecutiveSummaryPoster.jsx";
import { ICON_OPTIONS as SAFETY_ICON_OPTIONS } from "../iconsConfig";

/* ————— القوالب (الحقول) ————— */
const TEMPLATES = {
  "تعريف بمنصة أو خدمة": [
    { name: "deptLine1", label: "الجهة الرئسية  (مسمى الوكالة)*", type: "text" },
    {
      name: "deptLine2",
      label: "الجهة الفرعية (إدارة عامة أو إدارة)*",
      type: "text",
    },
    { name: "titlePrimary", label: "العنوان الرئيسي*", type: "text" },
    { name: "titleSecondary", label: "العنوان الفرعي", type: "text" },
    { name: "body", label: "النص التعريفي", type: "textarea" },
    { name: "image", label: "الصورة (مرفق)", type: "file" },
    { name: "sourceLabel", label: "نص المصدر في الأسفل", type: "text" },
  ],

  "دعوة ورشة عمل": [
    { name: "deptLine1", label: "الجهة الرئسية  (مسمى الوكالة)*", type: "text" },
    {
      name: "deptLine2",
      label: "الجهة الفرعية (إدارة عامة أو إدارة)*",
      type: "text",
    },
    { name: "inviteLine", label: "نص الدعوة الرئيسي", type: "text" },
    { name: "audienceLine", label: "نص الدعوة الفرعي", type: "text" },
    { name: "systemLine", label: "موضوع الورشة", type: "text" },
    { name: "sourceLabel", label: "نص المصدر في الأسفل", type: "text" },
  ],

  "إطلاق خدمة": [
    { name: "deptLine1", label: "الجهة الرئسية  (مسمى الوكالة)*", type: "text" },
    {
      name: "deptLine2",
      label: "الجهة الفرعية (إدارة عامة أو إدارة)*",
      type: "text",
    },
    { name: "serviceTagline", limitTextlabel: "العنوان الرئيسي ", type: "text" },
    { name: "serviceTitle", label: "عنوان الخدمة الرئيسي", type: "text" },
    { name: "serviceBody", label: "النص التعريفي", type: "textarea" },
    { name: "mainImage", label: "الصورة الرئيسية", type: "file" },
    { name: "launchDate", label: "تاريخ الإطلاق", type: "text" },
    { name: "audience", label: "المستفيدون", type: "text" },
    { name: "qrLabel", label: "عنوان خانة الوصول للخدمة", type: "text" },
    { name: "accessText", label: "وصف الوصول للخدمة", type: "text" },
    { name: "qrImage", label: "صورة الباركود", type: "file" },
    { name: "sourceLabel", label: "نص المصدر في الأسفل", type: "text" },
  ],

  "قالب بخلفية صورة": [
    { name: "deptLine1", label: "الجهة الرئسية  (مسمى الوكالة)*", type: "text" },
    {
      name: "deptLine2",
      label: "الجهة الفرعية (إدارة عامة أو إدارة)*",
      type: "text",
    },
    { name: "mainTitle", label: "العنوان الرئيسي", type: "text" },
    { name: "subTitle", label: "العنوان الفرعي", type: "textarea" },
    { name: "mainImage", label: "الصورة الرئيسية", type: "file" },
    { name: "sourceLabel", label: "نص المصدر في الأسفل", type: "text" },
  ],

  "excutive summary": [
    { name: "title", label: "العنوان", type: "text" },
    { name: "intro", label: "النص داخل المربع الأخضر", type: "textarea" },
    { name: "logoUrl", label: "الشعار", type: "file" },
    { name: "footerNote", label: "نص الفوتر (يمين)", type: "text" },
  ],
};

/* ——— ٤ بوكسات خضراء افتراضية ——— */
const DEFAULT_INVITE_BOXES = [
  { id: 1, label: "التاريخ", iconKey: "calendar", text: "الثلاثاء 11/11/2025" },
  { id: 2, label: "الوقت", iconKey: "time", text: "من 10:30 ص إلى 11:30 ص" },
  {
    id: 3,
    label: "الفئة المستهدفة",
    iconKey: "users",
    text: "منسوبو منظومة البيئة والمياه والزراعة",
  },
  {
    id: 4,
    label: "الباركود",
    iconKey: "qrcode",
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

/* ——— أهداف افتراضية لإطلاق خدمة ——— */
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
  "قالب بخلفية صورة": (data) => <SafetyPoster data={data} />,
  "excutive summary": (data) => <ExecutiveSummaryPoster data={data} />,
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
      deptLine1: "وكالة الوزارة لتقنية المعلومات والتحول الرقمي",
      deptLine2: "الإدارة العامة للتحول الرقمي",
      inviteLine: "ندعوكـم لحـضور ورشة عمـل عن بُعـد",
      audienceLine: "لـتدريـب منسـوبي مـنظومـة الـبيئـة والمـياه والـزراعـة",
      systemLine: "على نظـام جاهـز",
      sourceLabel: "المصدر: الهيئة السعودية للبيانات والذكاء الاصطناعي",
      boxes: DEFAULT_INVITE_BOXES.map((b) => ({ ...b })),
      agendaItems: DEFAULT_AGENDA_ITEMS.map((a) => ({ ...a })),
    };
  }

  if (template === "إطلاق خدمة") {
    return {
      deptLine1: "وكالة الوزارة لتقنية المعلومات والتحول الرقمي",
      deptLine2: "الإدارة العامة للتحول الرقمي",
      serviceTagline: "إطـلاق خـدمة إصـدار",
      sourceLabel: "المصدر: الهيئة السعودية للبيانات والذكاء الاصطناعي",
      serviceTitle:
        "تـرخـيـص الـمـتـاجـر الإلـكـتـرونـيـة للأفـراد لـتـسـويـق الـمـنـتـجـات الـزراعـيـة",
      serviceBody:
        "تمكّن أصحاب المتاجر الإلكترونية من الأفراد السعوديين من تسويق المنتجات الزراعية ضمن إطار نظامي واضح، بما في ذلك منتجي المحاصيل الذين لديهم سجل زراعي أو من يتعاقد معهم لتسويق المنتجات الزراعية كمواد أولية أو معبأة.",
      serviceObjectives: DEFAULT_SERVICE_OBJECTIVES.map((o) => ({ ...o })),
      launchDate: "17 نوفمبر 2025 م",
      audience: "الأفراد",
      qrLabel: "الوصول للخدمة",
      accessText: "منصة نما للخدمات الإلكترونية",
    };
  }

  if (template === "تعريف بمنصة أو خدمة") {
    return {
      deptLine1: "وكالة الوزارة لتقنية المعلومات والتحول الرقمي",
      deptLine2: "الإدارة العامة للتحول الرقمي",
      titlePrimary: "نشرة الذكاء الاصطناعي",
      titleSecondary: "أهمية حماية البيانات في عصر الذكاء الاصطناعي",
      body:
        "تتزايد أهمية حماية الخصوصية والسرية في ظل الاستخدام المتنامي للذكاء الاصطناعي. من الضروري عدم مشاركة البيانات السرية مع أي جهة غير موثوقة، حيث يمكن أن تؤدي هذه الممارسات إلى انتهاك الخصوصية. بالإضافة إلى ذلك، يجب تجنب الاعتماد الكلي على تقنيات الذكاء الاصطناعي في اتخاذ القرارات، حيث إن ذلك قد يعرض البيانات الحساسة لمخاطر متعددة. لذا، ينبغي على الأفراد والمؤسسات اتخاذ تدابير فعالة لضمان حماية بياناتهم وضمان سريتها.",
      sourceLabel: "المصدر: الهيئة السعودية للبيانات والذكاء الاصطناعي",
    };
  }

  if (template === "قالب بخلفية صورة") {
    return {
      deptLine1: "الإدارة العامة للاتصال الموسسي والإعلام",
      deptLine2: "إدارة التواصل الداخلي",
      mainTitle: "شتاك آمن",
      subTitle:
        "مع بداية فصل الشتاء، تكثر استخدامات المدافئ والأجهزة الكهربائية، وهنا تبرز أهمية الوعي بالسلامة لتجنب المخاطر والحفاظ على أمن الجميع.",
      safetyItems: [
        { id: 1, iconKey: "fire", text: "ضع المدفأة بعيداً عن الستائر والمفروشات لتجنب الحريق." },
        { id: 2, iconKey: "electric", text: "تأكد من سلامة التوصيلات الكهربائية قبل تشغيل أي جهاز." },
        { id: 3, iconKey: "unplug", text: "افصل الأجهزة عن الكهرباء عند النوم أو الخروج." },
        { id: 4, iconKey: "block", text: "تجنب تشغيل عدة أجهزة على توصيلة كهربائية واحدة." },
      ],
      sourceLabel: "المصدر: الإدارة العامة للأمن والسلامة المهنية",
      mainImage: "/src/assets/مدفاه.png",
    };
  }

  if (template === "excutive summary") {
    return {
      title: "ملخص تنفيذي",
      intro: "تهدف هذه الخطوات إلى ...",
      footerNote: "نص توضيحي صغير في الأسفل",
      tableRows: [
        { id: 1, col1: "الهدف", col2: "وصف مختصر" },
        { id: 2, col1: "النطاق", col2: "حتى 6 صفوف كحد أقصى" },
      ],
    };
  }

  return {};
}

// ====== Text limit helper ======
const MAX_CHARS = 400;
const MAX_WORDS = 100;

function limitText(value, { maxChars, maxWords } = {}) {
  if (!value) return value;
  let text = value;

  if (maxChars && text.length > maxChars) {
    text = text.slice(0, maxChars);
  }

  if (maxWords) {
    const words = text.split(/\s+/);
    if (words.length > maxWords) {
      text = words.slice(0, maxWords).join(" ");
    }
  }

  return text;
}

// ✅ تعريف أنواع المنشورات (قابلة للتوسع)
const LAYOUT = {
  PORTRAIT: "PORTRAIT",
  LANDSCAPE: "LANDSCAPE",
  SQUARE: "SQUARE",
};

// ✅ مقاسات التصميم الأساسية (هذه هي الحقيقة للتصدير)
const CANVAS_SIZES = {
  [LAYOUT.PORTRAIT]: { w: 900, h: 1273 },
  [LAYOUT.LANDSCAPE]: { w: 1273, h: 716 },
  [LAYOUT.SQUARE]: { w: 1080, h: 1080 }, // مثال للمستقبل
};

// ✅ إعدادات لكل قالب: نوعه (وهنا تقدرين تغيّرين أو تضيفين قوالب بسهولة)
const TEMPLATE_META = {
  "تعريف بمنصة أو خدمة": { layout: LAYOUT.PORTRAIT },
  "دعوة ورشة عمل": { layout: LAYOUT.PORTRAIT },
  "إطلاق خدمة": { layout: LAYOUT.PORTRAIT },
  "قالب بخلفية صورة": { layout: LAYOUT.PORTRAIT },
  "excutive summary": { layout: LAYOUT.LANDSCAPE },

  // مستقبلاً:
  // "بوستر مربع جديد": { layout: LAYOUT.SQUARE },
};

// ✅ دالة ترجع إعدادات المعاينة/التصدير حسب القالب
function getPreviewConfig(template) {
  const meta = TEMPLATE_META[template] ?? { layout: LAYOUT.PORTRAIT };
  const baseSize = CANVAS_SIZES[meta.layout] ?? CANVAS_SIZES[LAYOUT.PORTRAIT];

  // ✅ scale للمعاينة فقط (مو للتصدير)
  const previewScale =
    meta.layout === LAYOUT.LANDSCAPE ? 0.62 : meta.layout === LAYOUT.SQUARE ? 0.7 : 0.75;

  return {
    layout: meta.layout, // PORTRAIT | LANDSCAPE | SQUARE
    baseSize, // {w,h} التصميم الفعلي
    previewScale, // للعرض فقط
  };
}

/* ————— Component الرئيسي ————— */
export default function Create({ onBack }) {
  const [template, setTemplate] = useState("تعريف بمنصة أو خدمة");
  const [styleTone, setStyleTone] = useState("رسمي");
  const [keywords, setKeywords] = useState("");
  const [formData, setFormData] = useState(() => getInitialData("تعريف بمنصة أو خدمة"));
  const [busy, setBusy] = useState(false);
  const [iconSearch, setIconSearch] = useState("");

  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState("");

  const fields = useMemo(() => TEMPLATES[template] ?? [], [template]);

  const [safetyIconSearch, setSafetyIconSearch] = useState({});
  const [workshopIconSearch, setWorkshopIconSearch] = useState({});

  const inviteBoxes =
    template === "دعوة ورشة عمل" ? (Array.isArray(formData.boxes) ? formData.boxes : []) : [];

  const inviteAgendaItems =
    template === "دعوة ورشة عمل"
      ? Array.isArray(formData.agendaItems)
        ? formData.agendaItems
        : []
      : [];

  const serviceObjectives =
    template === "إطلاق خدمة"
      ? Array.isArray(formData.serviceObjectives)
        ? formData.serviceObjectives
        : []
      : [];

  const safetyItems =
    template === "قالب بخلفية صورة" && Array.isArray(formData.safetyItems) ? formData.safetyItems : [];

  const filteredIconOptions = SAFETY_ICON_OPTIONS.filter((opt) => {
    const query = iconSearch.trim().toLowerCase();
    if (!query) return true;
    return opt.label.toLowerCase().includes(query) || opt.key.toLowerCase().includes(query);
  });

  const previewRef = useRef(null);
  const exportRef = useRef(null); // ✅ NEW: dedicated export root (no transform)

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

    let limits = {};
    if (["body", "serviceBody", "subTitle"].includes(name)) {
      limits = { maxChars: 500, maxWords: 90 };
    } else if (["titlePrimary", "titleSecondary", "serviceTagline", "serviceTitle", "mainTitle"].includes(name)) {
      limits = { maxChars: 120, maxWords: 20 };
    } else {
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

  // البيانات المرسلة للمعاينة
  let previewData = formData;
  if (template === "دعوة ورشة عمل") {
    previewData = { ...formData, boxes: inviteBoxes, agendaItems: inviteAgendaItems };
  } else if (template === "إطلاق خدمة") {
    previewData = { ...formData, serviceObjectives };
  }

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
    template === "excutive summary" && Array.isArray(formData.tableRows) ? formData.tableRows : [];

  const addExecRow = () => {
    if (template !== "excutive summary") return;
    setFormData((d) => {
      const rows = Array.isArray(d.tableRows) ? [...d.tableRows] : [];
      if (rows.length >= 6) return d;
      rows.push({ id: Date.now(), col1: "", col2: "" });
      return { ...d, tableRows: rows };
    });
  };

  const updateExecRow = (index, field, value) => {
    if (template !== "excutive summary") return;
    setFormData((d) => {
      const rows = Array.isArray(d.tableRows) ? [...d.tableRows] : [];
      if (!rows[index]) return d;
      rows[index] = { ...rows[index], [field]: value };
      return { ...d, tableRows: rows };
    });
  };

  const removeExecRow = (index) => {
    if (template !== "excutive summary") return;
    setFormData((d) => {
      const rows = Array.isArray(d.tableRows) ? [...d.tableRows] : [];
      rows.splice(index, 1);
      return { ...d, tableRows: rows };
    });
  };

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
      if (field === "label") v = limitText(value, { maxChars: 80, maxWords: 10 });
      else if (field === "text") v = limitText(value, { maxChars: 220, maxWords: 40 });

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
      items[index] = { ...items[index], [field]: limitText(value) };
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

  const addServiceObjective = () => {
    if (template !== "إطلاق خدمة") return;
    setFormData((d) => {
      const items = Array.isArray(d.serviceObjectives) ? [...d.serviceObjectives] : [];
      if (items.length >= 6) return d;
      items.push({ id: Date.now(), text: "" });
      return { ...d, serviceObjectives: items };
    });
  };

  const updateServiceObjective = (index, value) => {
    setFormData((d) => {
      const items = Array.isArray(d.serviceObjectives) ? [...d.serviceObjectives] : [];
      if (!items[index]) return d;
      items[index] = { ...items[index], text: limitText(value) };
      return { ...d, serviceObjectives: items };
    });
  };

  const removeServiceObjective = (index) => {
    setFormData((d) => {
      const items = Array.isArray(d.serviceObjectives) ? [...d.serviceObjectives] : [];
      items.splice(index, 1);
      return { ...d, serviceObjectives: items };
    });
  };

  const addSafetyItem = () => {
    if (template !== "قالب بخلفية صورة") return;

    setFormData((d) => {
      const items = Array.isArray(d.safetyItems) ? [...d.safetyItems] : [];
      if (items.length >= 4) return d;
      items.push({ id: Date.now(), iconKey: "", text: "" });
      return { ...d, safetyItems: items };
    });
  };

  const updateSafetyItem = (index, field, value) => {
    setFormData((d) => {
      const items = Array.isArray(d.safetyItems) ? [...d.safetyItems] : [];
      if (!items[index]) return d;

      if (field === "text") items[index] = { ...items[index], [field]: limitText(value) };
      else items[index] = { ...items[index], [field]: value };

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

  const { layout, baseSize, previewScale } = useMemo(() => getPreviewConfig(template), [template]);

  /* ————— التصدير كـ PNG ————— */
  const exportPNG = async () => {
    if (!exportRef.current) return;
    setBusy(true);

    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      const node = exportRef.current;

      const canvas = await html2canvas(node, {
        scale: 3,
        width: baseSize.w,
        height: baseSize.h,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: baseSize.w,
        windowHeight: baseSize.h,
      });

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
    if (!exportRef.current) return;
    setBusy(true);

    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      const node = exportRef.current;

      const canvas = await html2canvas(node, {
        scale: 3,
        width: baseSize.w,
        height: baseSize.h,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: baseSize.w,
        windowHeight: baseSize.h,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdfWidth = canvas.width;
      const pdfHeight = canvas.height;

      const pdf = new jsPDF({
        orientation: pdfWidth >= pdfHeight ? "l" : "p",
        unit: "px",
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("poster.pdf");
    } finally {
      setBusy(false);
    }
  };

  /* ————— تحسين بالنص الذكي ————— */
  const enhanceText = async () => {
    try {
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
        setAiMessage("التحسين مفعّل حالياً للقوالب: تعريف بمنصة أو خدمة، دعوة ورشة عمل، وإطلاق خدمة.");
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
        setAiMessage("تم تحسين المحتوى بنجاح");
      } else {
        setAiMessage("لم يتم استلام محتوى محسّن من الخادم.");
      }
    } catch (e) {
      console.error("Enhance exception:", e);
      setAiMessage("تعذر تحسين النص الآن (مشكلة اتصال).");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 grid md:grid-cols-[420px_minmax(0,1fr)] gap-6">
      {/* يمين: لوحة الإدخال */}
      <aside className="bg-white rounded-xl shadow-card p-5 md:p-6 md:h-[calc(100vh-6rem)] md:sticky md:top-20 overflow-auto">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-extrabold text-brand-800">إنشاء منشور جديد</h2>
          <button onClick={onBack} className="text-sm px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">
            الرئيسية
          </button>
        </div>

        {/* اختيار القالب */}
        <div className="space-y-2">
          <label className="font-semibold text-slate-700">اختيار القالب</label>
          <select
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
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
                  onChange={(e) => handleFileChange(f.name, e.target.files[0])}
                />
              )}
            </div>
          ))}
        </div>

        {/* (باقي المحتوى كما هو عندك… لم أغيره) */}
        {/* ملاحظة: أنا أبقيت كل شيء كما هو، فقط جزء التصدير تم تحديثه بالأسفل */}

        {/* AI */}
        <div className="mt-6 border rounded-xl p-4 bg-slate-50 space-y-3">
          <h3 className="font-bold text-brand-800">التحسين بالذكاء الاصطناعي</h3>
          <p className="text-accent-brown">الرجاء التأكد من عدم مشاركة بيانات سرية...</p>

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

          <button
            onClick={enhanceText}
            disabled={busy || aiLoading}
            className="w-full mt-2 bg-brand-500 text-white font-semibold px-4 py-2 rounded-lg hover:brightness-110 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {aiLoading ? "جاري التحسين..." : "تحسين المحتوى"}
          </button>

          {aiMessage && <p className="mt-2 text-xs text-slate-600">{aiMessage}</p>}
        </div>

        {/* Export */}
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

      {/* يسار: المعاينة */}
      <section className="md:h-[calc(100vh-6rem)] md:sticky md:top-20 flex flex-col min-w-0">
        {/* ✅ امنعي السكرول الأفقي */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden flex justify-center">
          {/* ✅ Wrapper: فقط للعرض (scale) */}
          <div
            className={layout === LAYOUT.LANDSCAPE ? "inline-block origin-top" : "inline-block origin-top"}
            style={{
              transform: `scale(${previewScale})`,
            }}
          >
            {/* ✅ هذا هو التصميم الحقيقي (بدون transform) */}
            <div
              ref={previewRef}
              className="bg-white rounded-xl shadow-card overflow-hidden"
              style={{ width: baseSize.w, height: baseSize.h }}
            >
              {renderPreview(template, previewData)}
            </div>
          </div>
        </div>
      </section>

      {/* ✅ NEW: Hidden Export Canvas (no transform / no scroll / correct size) */}
      <div
        style={{
          position: "fixed",
          left: "-10000px",
          top: 0,
          width: baseSize.w,
          height: baseSize.h,
          overflow: "hidden",
          background: "#ffffff",
          direction: "rtl",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <div
          ref={exportRef}
          style={{
            width: baseSize.w,
            height: baseSize.h,
            background: "#ffffff",
          }}
        >
          {renderPreview(template, previewData)}
        </div>
      </div>
    </div>
  );
}