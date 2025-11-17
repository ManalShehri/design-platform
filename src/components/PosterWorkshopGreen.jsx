// src/components/PosterWorkshopGreen.jsx
export default function PosterWorkshopGreen({ data }) {
  const {
    mainTitle,
    subTitle,
    description,
    date,
    day,
    timeFrom,
    timeTo,
    location,
    audience,
    workshopTitle,
    qrLabel,
    email,
    bottomNote,
    imageUrl,      // صورة أسفل (مثل الدرع أو اللابتوب)
  } = data;

  return (
    <div className="w-full h-full bg-[#F3FAF4] relative overflow-hidden">
      {/* شريط علوي الهويات */}
      <header className="px-40 pt-24 flex items-start justify-between text-[#00406B] text-[11px] leading-snug font-lina">
        <div className="flex flex-col gap-1">
          <div>الإدارة العامة للأمن السيبراني</div>
          <div>C-SOC مركز العمليات الموحّد</div>
        </div>
        <div className="flex items-center gap-6">
          <div className="w-28 h-12 bg-slate-200 rounded-md grid place-items-center text-[10px]">
            شعار المبادرة
          </div>
          <div className="flex flex-col items-end gap-1">
            <div>وزارة البيئة والمياه والزراعة</div>
            <div className="text-[10px]">Ministry of Environment Water & Agriculture</div>
          </div>
          <div className="w-12 h-12 bg-emerald-200 rounded-full grid place-items-center text-[10px]">
            شعار
          </div>
        </div>
      </header>

      {/* العنوان + الوصف */}
      <main className="px-40 pt-24 pb-16 font-lina text-[#004A34]">
        <h1 className="text-[40px] font-bold mb-2">
          {mainTitle || "ورشة نقل معرفة"}
        </h1>
        <h2 className="text-[24px] font-bold text-[#00A36C] mb-4">
          {subTitle || "عن خطة الاستجابة للحوادث السيبرانية"}
        </h2>
        <p className="text-[15px] leading-relaxed text-[#174434] max-w-2xl">
          {description ||
            "بهدف تعزيز عملية التواصل للاستجابة للحوادث السيبرانية بين الإدارات المختلفة، وتوحيد الجهود لحماية المنظومة الرقمية."}
        </p>

        {/* سطر الفئة المستهدفة */}
        <div className="mt-6 bg-[#005D45] text-white rounded-full inline-flex items-center gap-2 px-5 py-2 text-[13px]">
          <span className="font-semibold">الفئة المستهدفة:</span>
          <span>{audience || "منسوبو وكالة الوزارة لتقنية المعلومات والتحول الرقمي"}</span>
        </div>

        {/* صف الأيقونات (المكان، الوقت، التاريخ) */}
        <div className="mt-10 grid grid-cols-3 gap-6 text-[14px] text-[#004A34]">
          <InfoIconBlock
            icon="📍"
            label="المكان"
            value={location || "مسرح ديوان الوزارة"}
          />
          <InfoIconBlock
            icon="⏰"
            label="الوقت"
            value={
              timeFrom || timeTo
                ? `${timeFrom || "10:00 ص"} - ${timeTo || "12:00 م"}`
                : "من 10:00 ص حتى 12:00 م"
            }
          />
          <InfoIconBlock
            icon="📅"
            label="التاريخ"
            value={date || "الخميس 13 نوفمبر 2025"}
          />
        </div>
      </main>

      {/* منطقة الصورة السفلية */}
      <section className="absolute inset-x-0 bottom-0 h-[45%]">
        {/* خلفية داكنة + موجات */}
        <div className="absolute inset-0 bg-[#004236]" />
        <Waves />

        {/* صورة رئيسية */}
        {imageUrl && (
          <div className="absolute inset-x-0 bottom-12 flex justify-center">
            <img
              src={imageUrl}
              alt=""
              className="h-64 object-contain drop-shadow-2xl"
            />
          </div>
        )}

        {/* شريط المعلومات السفلي */}
        <div className="absolute left-40 right-40 bottom-4 flex items-center justify-between text-[11px] text-white font-lina">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 bg-[#1A7F5A] px-4 py-2 rounded-full">
              <span>📞</span>
              <span>4555</span>
            </span>
            <span className="inline-flex items-center gap-1 bg-[#1A7F5A] px-4 py-2 rounded-full">
              <span>✉️</span>
              <span className="ltr">Secawareness@mewa.gov.sa</span>
            </span>
          </div>
          <div className="text-right">
            <div>{bottomNote || "رأيك يهمنا.."}</div>
            <div className="text-[10px] opacity-80">
              البريد الإلكتروني لإدارة التواصل الداخلي
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoIconBlock({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-[#E9F6EC] rounded-xl px-4 py-3">
      <div className="w-10 h-10 rounded-full bg-white text-[18px] grid place-items-center text-[#00A36C]">
        {icon}
      </div>
      <div>
        <div className="text-[11px] text-[#4B7A5F]">{label}</div>
        <div className="text-[14px] font-semibold text-[#004A34]">
          {value}
        </div>
      </div>
    </div>
  );
}

function Waves() {
  return (
    <svg
      className="absolute inset-x-0 -top-10 w-full"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
    >
      <path
        d="M0,80 C200,120 400,40 720,80 C1040,120 1240,60 1440,80 L1440,120 L0,120 Z"
        fill="#006A4B"
        opacity="0.9"
      />
      <path
        d="M0,60 C240,100 360,20 720,60 C1080,100 1200,40 1440,60 L1440,120 L0,120 Z"
        fill="#007F5D"
        opacity="0.7"
      />
    </svg>
  );
}