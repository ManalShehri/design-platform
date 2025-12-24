// src/iconsConfig.js
import {
  FiAlertTriangle,
  FiZap,
  FiPower,
  FiSlash,
  FiMail,
  FiBell,
  FiUser,
  FiShield,
  FiInfo,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiCalendar,
  FiPhone,
  FiGlobe,
  FiWifi,
  FiDatabase,
  FiLock,
  FiUnlock,
  FiCamera,
  FiFileText,
  FiMapPin,
  FiTruck,
  FiServer,
  FiActivity,
  FiCloud,
  FiDownload,
  FiUpload,
  FiMonitor,
  FiCpu,
  FiKey,
  FiMic,
  FiAward,
  FiLink,
} from "react-icons/fi";

import {
  AiOutlineSafety,
  AiOutlineEye,
  AiOutlineWarning,
  AiOutlineCustomerService,
  AiFillAudio,
  AiOutlineClockCircle,
  AiTwotoneAudio,
  AiTwotoneWarning,
  AiTwotoneSetting,
  AiTwotonePhone,
  AiFillCloud,
  AiFillLock,
  AiFillFire,
  AiFillPicture,
  AiFillUnlock,
  AiTwotoneBulb,
} from "react-icons/ai";

// 🌿 أيقونات بيئة / زراعة / مياه
import {
  GiPlantSeed,
  GiTree,
  GiWateringCan,
  GiFarmTractor,
  GiWaterDrop,
  GiSprout,
} from "react-icons/gi";

import {
  WiRaindrop,
  WiDaySunny,
  WiStrongWind,
} from "react-icons/wi";

/**
 * 🧩 قائمة الأيقونات المتاحة للاختيار في الفورم
 */
export const ICON_OPTIONS = [
  // 🔥 تنبيهات / طوارئ
  { key: "alert",     label: "تنبيه عام",              preview: "⚠️", category: "طوارئ" },
  { key: "warning",   label: "تحذير",                  preview: "🚧", category: "طوارئ" },
  { key: "fire",      label: "خطر / حريق",            preview: "🔥", category: "طوارئ" },
  { key: "fire2",     label: "خطر / حريق (ممتلئة)",   preview: "🔥", category: "طوارئ" },
  { key: "safety",    label: "سلامة / وقاية",         preview: "🦺", category: "أمن" },

  // ⚡ كهرباء / طاقة
  { key: "electric",  label: "كهرباء / تيار",         preview: "⚡", category: "طاقة" },
  { key: "power",     label: "تشغيل / إيقاف",         preview: "⏻", category: "طاقة" },

  // 🚫 منع / حظر
  { key: "block",     label: "منع / حظر",             preview: "🚫", category: "طوارئ" },
  { key: "stop",      label: "إيقاف / منع",           preview: "⛔", category: "طوارئ" },

  // 📩 تواصل
  { key: "email",     label: "بريد إلكتروني",         preview: "✉️", category: "تواصل" },
  { key: "bell",      label: "تنبيهات / إشعارات",     preview: "🔔", category: "تواصل" },
  { key: "phone",     label: "اتصال هاتفي",           preview: "📞", category: "تواصل" },
  { key: "phone2",    label: "اتصال هاتفي (بديل)",    preview: "📞", category: "تواصل" },
  { key: "support",   label: "دعم فني / مساندة",      preview: "🎧", category: "تواصل" },
  { key: "setting",   label: "إعدادات / مركز خدمة",   preview: "🎧", category: "تواصل" },

  // 👤 مستخدمين
  { key: "user",      label: "مستخدم / شخص",          preview: "👤", category: "مستخدم" },
  { key: "user2",     label: "مستخدم / شخص (بديل)",   preview: "👤", category: "مستخدم" },
  { key: "users",     label: "مجموعة مستخدمين",       preview: "👥", category: "مستخدم" },

  // 🛡 أمن وخصوصية
  { key: "shield",    label: "حماية / أمن",           preview: "🛡️", category: "أمن" },
  { key: "lock",      label: "قفل / سرية",            preview: "🔒", category: "أمن" },
  { key: "lock2",     label: "قفل / سرية (ممتلئة)",   preview: "🔒", category: "أمن" },
  { key: "unlock",    label: "فتح قفل",               preview: "🔓", category: "أمن" },
  { key: "unlock2",   label: "فتح قفل (ممتلئة)",      preview: "🔓", category: "أمن" },
  { key: "eye",       label: "مراقبة / رؤية",         preview: "👁️", category: "أمن" },
  { key: "key",       label: "مفتاح / صلاحيات",       preview: "🗝️", category: "أمن" },

  // ℹ معلومات / نجاح / خطأ
  { key: "info",      label: "معلومة",                preview: "ℹ️", category: "معلومات" },
  { key: "bulb",      label: "فكرة / توعية",          preview: "💡", category: "معلومات" },
  { key: "success",   label: "نجاح / تم",             preview: "✅", category: "حالة" },
  { key: "error",     label: "خطأ / لم يتم",          preview: "❌", category: "حالة" },
  { key: "warning2",  label: "تحذير (بديل)",          preview: "🚧", category: "طوارئ" },

  // ⏰ وقت / تواريخ
  { key: "time",      label: "وقت",                    preview: "⏰", category: "وقت" },
  { key: "clock",     label: "ساعة",                   preview: "⏰", category: "وقت" },
  { key: "clockcircle", label: "وقت (دائري)",         preview: "⏰", category: "وقت" },
  { key: "calendar",  label: "تاريخ / موعد",          preview: "📅", category: "وقت" },

  // 🌐 إنترنت / شبكة / بيانات
  { key: "internet",  label: "إنترنت / موقع",         preview: "🌐", category: "بيانات" },
  { key: "wifi",      label: "واي فاي / شبكة",        preview: "📶", category: "بيانات" },
  { key: "database",  label: "بيانات / قاعدة بيانات", preview: "💾", category: "بيانات" },
  { key: "server",    label: "خادم / نظام",           preview: "🖥️", category: "بيانات" },
  { key: "cloud",     label: "سحابة / تخزين سحابي",  preview: "☁️", category: "سحابة" },
  { key: "cloud2",    label: "سحابة (ممتلئة)",       preview: "☁️", category: "سحابة" },

  // 📍 مكان / لوجستيات
  { key: "location",  label: "موقع / مكان",           preview: "📍", category: "موقع" },
  { key: "delivery",  label: "شحن / توصيل",           preview: "🚚", category: "لوجستي" },

  // 📄 ملفات / محتوى
  { key: "file",      label: "ملف / مستند",           preview: "📄", category: "محتوى" },
  { key: "picture",   label: "صورة / ملصق",           preview: "🖼️", category: "محتوى" },
  { key: "download",  label: "تحميل",                 preview: "📥", category: "محتوى" },
  { key: "upload",    label: "رفع",                   preview: "📤", category: "محتوى" },
  { key: "link",      label: "رابط / ارتباط",         preview: "🔗", category: "محتوى" },

  // 🎥 / صوت
  { key: "camera",    label: "كاميرا / صورة",        preview: "📷", category: "وسائط" },
  { key: "audio",     label: "صوت / مكبر",           preview: "🔊", category: "وسائط" },
  { key: "audio2",    label: "صوت / مكبر (بديل)",    preview: "🔊", category: "وسائط" },
  { key: "mic",       label: "مايكروفون",            preview: "🎙️", category: "وسائط" },

  // 📊 نشاط / جائزة
  { key: "activity",  label: "نشاط / أداء",           preview: "📊", category: "تحليلات" },
  { key: "award",     label: "جائزة / إنجاز",         preview: "🏆", category: "إنجاز" },

  // 💻 أجهزة / عتاد
  { key: "monitor",   label: "شاشة / جهاز",           preview: "🖥️", category: "أجهزة" },
  { key: "cpu",       label: "معالج / نظام",          preview: "🧠", category: "أجهزة" },

  // 🌿 بيئة / زراعة / مياه
  { key: "leaf",      label: "بيئة / ورقة شجر",       preview: "🍃", category: "بيئة" },
  { key: "tree",      label: "شجرة / تشجير",          preview: "🌳", category: "بيئة" },
  { key: "sprout",    label: "نبتة / غرس",            preview: "🌱", category: "زراعة" },
  { key: "seed",      label: "بذور / زراعة",          preview: "🌾", category: "زراعة" },
  { key: "farm",      label: "مزرعة / جرار",          preview: "🚜", category: "زراعة" },
  { key: "irrigation",label: "ري / سقاية",           preview: "💧", category: "مياه" },
  { key: "waterdrop", label: "قطرة ماء",              preview: "💧", category: "مياه" },
  { key: "rain",      label: "أمطار",                 preview: "🌧️", category: "مياه" },
  { key: "sun",       label: "شمس / طقس",             preview: "☀️", category: "بيئة" },
  { key: "wind",      label: "رياح / غبار",           preview: "🌬️", category: "بيئة" },
];

/**
 * 🧱 خريطة key -> React Icon Component
 */
export const ICONS_BY_KEY = {
  alert: FiAlertTriangle,
  warning: AiOutlineWarning,
  warning2: AiTwotoneWarning,
  fire: FiAlertTriangle,
  fire2: AiFillFire,
  safety: AiOutlineSafety,

  electric: FiZap,
  power: FiPower,

  block: FiSlash,
  stop: FiSlash,

  email: FiMail,
  bell: FiBell,
  phone: FiPhone,
  phone2: AiTwotonePhone,
  support: AiOutlineCustomerService,
  setting: AiTwotoneSetting,

  user: FiUser,
//   user2: FiUser,
  users: FiUser,

  shield: FiShield,
  lock: FiLock,
  lock2: AiFillLock,
  unlock: FiUnlock,
  unlock2: AiFillUnlock,
  eye: AiOutlineEye,
  key: FiKey,

  info: FiInfo,
  success: FiCheckCircle,
  error: FiXCircle,
  bulb: AiTwotoneBulb,

  time: FiClock,
  clock: FiClock,
  clockcircle: AiOutlineClockCircle,
  calendar: FiCalendar,

  internet: FiGlobe,
  wifi: FiWifi,
  database: FiDatabase,
  server: FiServer,

  location: FiMapPin,
  delivery: FiTruck,

  file: FiFileText,
  picture: AiFillPicture,
  download: FiDownload,
  upload: FiUpload,
  link: FiLink,

  camera: FiCamera,
  audio: AiFillAudio,
  audio2: AiTwotoneAudio,
  mic: FiMic,

  activity: FiActivity,
  award: FiAward,

  cloud: FiCloud,
  cloud2: AiFillCloud,

  monitor: FiMonitor,
  cpu: FiCpu,

  // 🌿 بيئة / زراعة / مياه
  leaf: GiTree,          // تقدرين تبدلينها GiSprout لو حبيتي
  tree: GiTree,
  sprout: GiSprout,
  seed: GiPlantSeed,
  farm: GiFarmTractor,
  irrigation: GiWateringCan,
  waterdrop: GiWaterDrop,
  rain: WiRaindrop,
  sun: WiDaySunny,
  wind: WiStrongWind,
};