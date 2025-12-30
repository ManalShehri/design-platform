// src/components/ServiceLaunchPoster.jsx
import PosterHeader from "./Utl/PosterHeader.jsx";
import PosterFooter from "./Utl/PosterFooter.jsx";

export default function ServiceLaunchPoster({ data }) {
  const {
    logoUrl,
    deptLine1,
    deptLine2,

    // العناوين
    serviceTagline,   // إطلاق خدمة إصدار ...
    serviceTitle,     // ترخيص المتاجر الإلكترونية...
    serviceBody,      // نص تعريفي بسيط

    // حقول قديمة للاحتياط
    objective1Text,
    objective2Text,

    // أهداف الخدمة الديناميكية من Create
    serviceObjectives = [],

    // صورة رئيسية
    mainImage,

    // معلومات الشريط السفلي
    launchDate,
    audience,
    accessText,
    qrImage,
    qrLabel,

    email,
    sourceLabel,
  } = data;

  // fallback لو ما فيه serviceObjectives
  const fallbackObjectives = [
    {
      text:
        objective1Text,
    },
    {
      text:
        objective2Text
    },
  ];

  const finalObjectives =
    Array.isArray(serviceObjectives) && serviceObjectives.length > 0
      ? serviceObjectives.slice(0, 6)
      : fallbackObjectives;

  return (
    <div className="w-full min-h-[1273px] bg-[#F3FAF4] text-[#005D45] flex flex-col font-lina">
      {/* HEADER */}
      <PosterHeader
        logoUrl={logoUrl}
        deptLine1={deptLine1}
        deptLine2={deptLine2}
        accentColor="#629FFC" // الأزرق الطويل زي ما وصفتي
        variant="short-bar"
      />

      {/* CONTENT */}
      <main className="px-20 pt-8 flex-1 flex flex-col justify-start">
        {/* العناوين العليا */}
        <section className="max-w-3xl mb-6">
          <p className="text-[38px] text-[#46C752] leading-snug">
            {serviceTagline}
          </p>

          <h1 className="mt-3 text-[40px] font-bold text-[#005D45] leading-snug">
            {serviceTitle}
          </h1>

          <p className="mt-4 text-[22px] leading-[1.9] text-[#005D45] text-justify">
            {serviceBody}
          </p>
        </section>

        {/* أهداف الخدمة – نفس الستايل، لكن ديناميكي حتى ٦ أهداف */}
        <section className="w-full max-w-4xl mx-auto mt-4">
          <h3 className="text-[32px] font-bold text-[#46C752] mb-4">
            أهداف الخدمة:
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {finalObjectives.map((obj, idx) => (
              <ObjectiveCard
                key={obj.id || idx}
                number={String(idx + 1).padStart(2, "0")}
                text={obj.text}
              />
            ))}
          </div>
        </section>

        {/* صورة رئيسية مع تدرج شفاف من الأعلى للأسفل */}
        {mainImage && (
          <section className="w-full max-w-4xl mx-auto mt-10 mb-10">
            <div className="relative rounded-3xl overflow-hidden shadow-md bg-[#DFF1E5]">
              <img
                src={mainImage}
                alt="Service main"
                className="w-full h-full object-cover"
              />
              {/* تدرج خفيّ: أعلى شبه مغطي، أسفل أوضح */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-transparent via-[#F3FAF4]/20 to-[#F3FAF4]/70" />
            </div>
          </section>
        )}

        {/* الشريط السفلي (تاريخ الإطلاق - المستفيدون - الوصول للخدمة/الباركود) */}
        <section className="w-full max-w-4xl mx-auto mb-8 mt-8">
          <div className="bg-[#E6F2E8] rounded-3xl px-8 py-5 grid md:grid-cols-3 gap-6">
            <InfoRow
              label="تاريخ الإطلاق"
              value={
                launchDate 
              }
            />
            <InfoRow
              label="المستفيدون"
              value={audience}
            />
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <div className="text-[12px] font-bold text-[#005D45] mb-1">
                  {qrLabel}
                </div>
                <div className="text-[11px] text-[#005D45] opacity-80">
                  {accessText}
                </div>
              </div>
              <div className="w-16 h-16 bg-white rounded grid place-items-center overflow-hidden">
                {qrImage ? (
                  <img
                    src={qrImage}
                    alt="QR"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-[9px] text-[#005D45]">QR</span>
                )}
              </div>
            </div>
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
  );
}

/* ——— عناصر فرعية ——— */

function ObjectiveCard({ number, text }) {
  return (
    <div className="rounded-2xl px-5 py-4 bg-white/60 border border-[#46C752]/15">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[22px] font-bold text-[#46C752]">{number}</span>
        <div className="w-10 h-1.5 bg-[#FFC629] rounded-full" />
      </div>
      <p className="text-[15px] text-[#005D45] leading-relaxed text-justify">
        {text}
      </p>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col justify-center">
      <div className="text-[14px] font-bold text-[#005D45] mb-1">
        {label}
      </div>
      <div className="text-[13px] text-[#005D45] whitespace-pre-line leading-relaxed">
        {value}
      </div>
    </div>
  );
}