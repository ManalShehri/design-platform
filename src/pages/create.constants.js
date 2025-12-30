// Constants used by Create page (templates, defaults, AI enhance fields)

const ENHANCE_FIELDS_BY_TEMPLATE = {
  "تعريف بمنصة أو خدمة": ["titlePrimary", "titleSecondary", "body"],
  "دعوة ورشة عمل": ["inviteLine", "audienceLine", "systemLine"],
  "إطلاق خدمة": ["serviceTagline", "serviceTitle", "serviceBody"],
};

/* ————— القوالب (الحقول) ————— */
const TEMPLATES = {
  "تعريف بمنصة أو خدمة": [
    { name: "deptLine1", label: "الجهة الرئسية  (مسمى الوكالة)*", type: "text" },
    { name: "deptLine2", label: "الجهة الفرعية (إدارة عامة أو إدارة)*", type: "text" },
    { name: "titlePrimary", label: "العنوان الرئيسي*", type: "text" },
    { name: "titleSecondary", label: "العنوان الفرعي", type: "text" },
    { name: "body", label: "النص التعريفي", type: "textarea" },
    { name: "image", label: "الصورة (مرفق)", type: "file" },
    { name: "sourceLabel", label: "نص المصدر في الأسفل", type: "text" },
  ],

  "دعوة ورشة عمل": [
    { name: "deptLine1", label: "الجهة الرئسية  (مسمى الوكالة)*", type: "text" },
    { name: "deptLine2", label: "الجهة الفرعية (إدارة عامة أو إدارة)*", type: "text" },
    { name: "inviteLine", label: "نص الدعوة الرئيسي", type: "text" },
    { name: "audienceLine", label: "نص الدعوة الفرعي", type: "text" },
    { name: "systemLine", label: "موضوع الورشة", type: "text" },
    { name: "sourceLabel", label: "نص المصدر في الأسفل", type: "text" },
  ],

  "إطلاق خدمة": [
    { name: "deptLine1", label: "الجهة الرئسية  (مسمى الوكالة)*", type: "text" },
    { name: "deptLine2", label: "الجهة الفرعية (إدارة عامة أو إدارة)*", type: "text" },
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
    { name: "deptLine2", label: "الجهة الفرعية (إدارة عامة أو إدارة)*", type: "text" },
    { name: "mainTitle", label: "العنوان الرئيسي", type: "text" },
    { name: "subTitle", label: "العنوان الفرعي", type: "textarea" },
    { name: "mainImage", label: "الصورة الرئيسية", type: "file" },
    { name: "sourceLabel", label: "نص المصدر في الأسفل", type: "text" },
  ],

  "ملخص تنفيذي": [
    { name: "title", label: "العنوان", type: "text" },
    { name: "intro", label: "النص داخل المربع الأخضر", type: "textarea" },
    { name: "logoUrl", label: "الشعار", type: "file" },
    { name: "footerNote", label: "نص الفوتر (يمين)", type: "text" },
  ],
};

/* ——— ٤ بوكسات خضراء افتراضية ——— */
const DEFAULT_INVITE_BOXES = [
  {
    id: 1,
    label: "التاريخ",
    iconKey: "calendar", // لازم يكون موجود في iconsConfig
    text: "الثلاثاء 11/11/2025",
  },
  {
    id: 2,
    label: "الوقت",
    iconKey: "time",
    text: "من 10:30 ص إلى 11:30 ص",
  },
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

export {
  ENHANCE_FIELDS_BY_TEMPLATE,
  TEMPLATES,
  DEFAULT_INVITE_BOXES,
  DEFAULT_AGENDA_ITEMS,
  DEFAULT_SERVICE_OBJECTIVES,
};