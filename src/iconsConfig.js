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
} from "react-icons/fi";

import {
  AiOutlineSafety,
  AiOutlineEye,
  AiOutlineWarning,
  AiOutlineCustomerService,
} from "react-icons/ai";

/**
 * 🧩 قائمة الأيقونات المتاحة للاختيار في الفورم
 * - key: الاسم اللي نخزّنه في البيانات (iconKey)
 * - label: يظهر في القائمة للمستخدم
 * - preview: إيموجي بسيط كمؤشر بصري في الـ <select>
 * - category: تصنيف اختياري (أمن، تواصل، بيانات، طوارئ...)
 */
export const ICON_OPTIONS = [
  // 🔥 تنبيهات / طوارئ
  { key: "alert",     label: "تنبيه عام",              preview: "⚠️", category: "طوارئ" },
  { key: "warning",   label: "تحذير",                  preview: "🚧", category: "طوارئ" },
  { key: "fire",      label: "خطر / حريق",            preview: "🔥", category: "طوارئ" },
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
  { key: "support",   label: "دعم فني / مساندة",      preview: "🎧", category: "تواصل" },

  // 👤 مستخدمين
  { key: "user",      label: "مستخدم / شخص",          preview: "👤", category: "مستخدم" },
  { key: "users",     label: "مجموعة مستخدمين",       preview: "👥", category: "مستخدم" },

  // 🛡 أمن وخصوصية
  { key: "shield",    label: "حماية / أمن",           preview: "🛡️", category: "أمن" },
  { key: "lock",      label: "قفل / سرية",            preview: "🔒", category: "أمن" },
  { key: "unlock",    label: "فتح قفل",               preview: "🔓", category: "أمن" },
  { key: "eye",       label: "مراقبة / رؤية",         preview: "👁️", category: "أمن" },
  { key: "key",       label: "مفتاح / صلاحيات",       preview: "🗝️", category: "أمن" },

  // ℹ معلومات / نجاح / خطأ
  { key: "info",      label: "معلومة",                preview: "ℹ️", category: "معلومات" },
  { key: "success",   label: "نجاح / تم",              preview: "✅", category: "حالة" },
  { key: "error",     label: "خطأ / لم يتم",          preview: "❌", category: "حالة" },

  // ⏰ وقت / تواريخ
  { key: "time",      label: "وقت",                    preview: "⏰", category: "وقت" },
  { key: "calendar",  label: "تاريخ / موعد",          preview: "📅", category: "وقت" },

  // 🌐 إنترنت / شبكة / بيانات
  { key: "internet",  label: "إنترنت / موقع",         preview: "🌐", category: "بيانات" },
  { key: "wifi",      label: "واي فاي / شبكة",        preview: "📶", category: "بيانات" },
  { key: "database",  label: "بيانات / قاعدة بيانات", preview: "💾", category: "بيانات" },
  { key: "server",    label: "خادم / نظام",           preview: "🖥️", category: "بيانات" },

  // 📍 مكان / لوجستيات
  { key: "location",  label: "موقع / مكان",           preview: "📍", category: "موقع" },
  { key: "delivery",  label: "شحن / توصيل",           preview: "🚚", category: "لوجستي" },

  // 📄 ملفات / محتوى
  { key: "file",      label: "ملف / مستند",           preview: "📄", category: "محتوى" },
  { key: "download",  label: "تحميل",                 preview: "📥", category: "محتوى" },
  { key: "upload",    label: "رفع",                   preview: "📤", category: "محتوى" },

  // 🎥 كـاميرا / نشاط / سحابة
  { key: "camera",    label: "كاميرا / صورة",        preview: "📷", category: "وسائط" },
  { key: "activity",  label: "نشاط / أداء",           preview: "📊", category: "تحليلات" },
  { key: "cloud",     label: "سحابة / تخزين سحابي",  preview: "☁️", category: "سحابة" },

  // 💻 أجهزة / عتاد
  { key: "monitor",   label: "شاشة / جهاز",           preview: "🖥️", category: "أجهزة" },
  { key: "cpu",       label: "معالج / نظام",          preview: "🧠", category: "أجهزة" },
];

/**
 * 🧱 خريطة key -> React Icon Component
 * تُستخدم داخل البوستر نفسه (SafetyPoster وغيرها)
 */
export const ICONS_BY_KEY = {
  alert: FiAlertTriangle,
  warning: AiOutlineWarning,
  fire: FiAlertTriangle,
  safety: AiOutlineSafety,

  electric: FiZap,
  power: FiPower,

  block: FiSlash,
  stop: FiSlash,

  email: FiMail,
  bell: FiBell,
  phone: FiPhone,
  support: AiOutlineCustomerService,

  user: FiUser,
  users: FiUser,

  shield: FiShield,
  lock: FiLock,
  unlock: FiUnlock,
  eye: AiOutlineEye,
  key: FiKey,

  info: FiInfo,
  success: FiCheckCircle,
  error: FiXCircle,

  time: FiClock,
  calendar: FiCalendar,

  internet: FiGlobe,
  wifi: FiWifi,
  database: FiDatabase,
  server: FiServer,

  location: FiMapPin,
  delivery: FiTruck,

  file: FiFileText,
  download: FiDownload,
  upload: FiUpload,

  camera: FiCamera,
  activity: FiActivity,
  cloud: FiCloud,

  monitor: FiMonitor,
  cpu: FiCpu,
};