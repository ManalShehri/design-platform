// src/components/SafetyPoster.jsx
import PosterHeader from "./PosterHeader.jsx";
import PosterFooter from "./PosterFooter.jsx";
import { ICONS_BY_KEY } from "../iconsConfig";
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
} from "react-icons/fi";

// const ICONS_BY_KEY = {
//   fire: FiAlertTriangle,   // حريق
//   electric: FiZap,         // كهرباء
//   unplug: FiPower,         // فصل الكهرباء
//   block: FiSlash,          // منع / حظر
//   email: FiMail,           // بريد
//   bell: FiBell,            // إشعار
//   user: FiUser,            // مستخدم
//   shield: FiShield,        // حماية
//   info: FiInfo,            // معلومة
//   check: FiCheckCircle,    // تم / تحقق
// };


// ✅ بوكسات افتراضية لو ما جتنا safetyItems من Create
const defaultSafetyItems = [
  {
    id: 1,
    iconKey: "fire",
    text: "ضع المدفأة بعيداً عن الستائر والمفروشات لتجنب الحريق.",
  },
  {
    id: 2,
    iconKey: "electric",
    text: "تأكد من سلامة التوصيلات الكهربائية قبل تشغيل أي جهاز.",
  },
  {
    id: 3,
    iconKey: "unplug",
    text: "افصل الأجهزة عن الكهرباء عند النوم أو الخروج.",
  },
  {
    id: 4,
    iconKey: "block",
    text: "تجنب تشغيل عدة أجهزة على توصيلة كهربائية واحدة.",
  },
];


export default function SafetyPoster({ data }) {
  const {
    logoUrl,
    deptLine1,
    deptLine2,

    mainTitle,
    subTitle,

    // 4 صناديق السلامة
    safetyItems = [],

    // صورة الخلفية السفلية
    mainImage,

    email,
    sourceLabel,
  } = data;

  // نضمن 4 عناصر كحد أقصى
  const finalSafetyItems =
    Array.isArray(safetyItems) && safetyItems.length > 0
      ? safetyItems.slice(0, 4)
      : defaultSafetyItems;

  return (
    <div className="w-full min-h-[1273px] bg-[#F3FAF4] text-[#005D45] flex flex-col font-lina relative overflow-hidden">
      {/* ===== BACKGROUND IMAGE من أسفل البوستر ===== */}
      {mainImage && (
        <div className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none">
    <div className="relative w-full h-full">
      <img
        src={mainImage}
        alt=""
        className="w-full h-full object-cover"
      />

      {/* التدرج للأعلى */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F3FAF4] via-[#F3FAF4]/85 to-transparent" />
    </div>
  </div>
      )}

      {/* محتوى البوستر فوق الخلفية */}
      <div className="relative z-10 flex flex-col min-h-[1273px]">
        {/* HEADER */}
        <PosterHeader
          logoUrl={logoUrl}
          deptLine1={deptLine1}
          deptLine2={deptLine2}
          accentColor="#629FFC"
          variant="short-bar"
        />

        {/* CONTENT */}
        <main className="px-30 pt-20 p-40 flex-1 flex flex-col ">
          {/* العنوان الرئيسي */}
          <h1 className="text-[66px] font-extrabold text-[#005D45]  leading-tight">
            {mainTitle}
          </h1>

          {/* العنوان الفرعي */}
          <p className="mt-4 text-[24px] max-w-3xl text-center leading-relaxed text-[#005D45]/85">
            {subTitle}
          </p>

        <section className="mt-16 mb-12 max-w-4xl w-full">
          <div className="grid grid-cols-2 gap-x-10 gap-y-12">
            {finalSafetyItems.map((item, idx) => {
              const IconComponent = ICONS_BY_KEY[item.iconKey] || ICONS_BY_KEY.alert;

              return (
                <div
                  key={item.id || idx}
                  className="flex flex-col items-center text-center"
                >
                  <div className="mb-3">
                    <IconComponent className="w-10 h-10 text-[#46C752]" />
                  </div>
                  <p className="text-[18px] leading-relaxed text-[#005D45]">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
        </main>

        {/* FOOTER */}
        <PosterFooter
          email={email}
          sourceLabel={sourceLabel}
          rightLogos={[]}
        />
      </div>
    </div>
  );
}