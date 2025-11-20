// src/components/WorkshopInvitePoster.jsx
import PosterHeader from "./PosterHeader.jsx";
import PosterFooter from "./PosterFooter.jsx";

export default function WorkshopInvitePoster({ data }) {
  const {
    logoUrl,
    deptLine1,
    deptLine2,

    // العناوين الأساسية
    inviteLine,      // ندعوكم لحضور ورشة عمل عن بُعد
    audienceLine,    // لتدريب منسوبي ...
    systemLine,      // على نظام جاهز ...

    // أجندة الورشة (4 كروت مثلاً)
    agenda1Title,
    agenda1Body,
    agenda2Title,
    agenda2Body,
    agenda3Title,
    agenda3Body,
    agenda4Title,
    agenda4Body,

    // معلومات الصناديق السفلية
    boxDate,
    boxTime,
    boxWorkshopTitle,
    boxAudience,
    boxQrNote,
    qrImage, // اختياري: صورة باركود

    email,
    sourceLabel,
    workshopImage,
  } = data;

  return (
    <div className="w-full h-full bg-[#F3FAF4] text-[#005D45] flex flex-col font-lina">
 <PosterHeader
        logoUrl={logoUrl}
        deptLine1={deptLine1}
        deptLine2={deptLine2}
        accentColor="#629FFC" // الأزرق الطويل زي ما وصفتي
        variant="short-bar"
      />



      {/* CONTENT */}
      <main className="px-20 pt-8 flex-1 flex flex-col justify-start">
        {/* عناوين الدعوة */}
        <section className="max-w-3xl mb-8">
          <p className="text-[35px] text-[#005D45] leading-snug">
            {inviteLine || "ندعوكم لحضور ورشة عمل عن بُعد"}
          </p>

          <p className="text-[40px] font-bold text-[#46C752] leading-snug mt-4">
            {audienceLine || "لتدريب منسوبي منظومة البيئة والمياه والزراعة"}
          </p>

          <p className="text-[28px] font-bold text-[#005D45] leading-snug mt-5">
            {systemLine || "على نظام جاهز"}
          </p>
        </section>

        {/* أجندة الورشة */}
        <section className="w-full max-w-4xl bg-[#EAF5EC] rounded-3xl px-10 py-8 mb-10">
          <h3 className="text-[30px] font-bold text-[#005D45] mb-4">
            محاور الورشة:
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <AgendaItem
              title={agenda1Title || "خدمات الموارد المؤسسية"}
              body={
                agenda1Body ||
                "التعرّف على أبرز خدمات الموارد المؤسسية وكيفية الاستفادة منها."
              }
            />
            <AgendaItem
              title={agenda2Title || "خدمات الشبكات والهواتف"}
              body={
                agenda2Body ||
                "عرض موجز للخدمات الفنية المقدّمة للشبكات وأنظمة الاتصال."
              }
            />
            <AgendaItem
              title={agenda3Title || "خدمات الأمن والسلامة"}
              body={
                agenda3Body ||
                "توضيح دور نظام جاهز في طلبات وخدمات الأمن والسلامة."
              }
            />
            <AgendaItem
              title={agenda4Title || "خدمات الدعم والتطبيقات"}
              body={
                agenda4Body ||
                "شرح آلية رفع الطلبات للتطبيقات والدعم الفني والمتابعة."
              }
            />
          </div>
        </section>
        {/* صورة تحت محاور الورشة */}
{/* صورة تحت محاور الورشة */}
{workshopImage && (
  <section className="w-full max-w-3xl mx-auto mt-10 mb-10">
    <div className="rounded-2xl shadow-md overflow-hidden bg-white p-2">
      <img
        src={workshopImage}
        alt="Workshop Image"
        className="w-full h-100 object-cover rounded-xl"
      />
    </div>
  </section>
)}
        {/* صناديق المعلومات السفلية (5 صناديق) */}
        <section className="w-full max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* التاريخ */}
            <InfoBox
              label="التاريخ"
              value={boxDate || "الثلاثاء 11/11/2025"}
            />

            {/* الوقت */}
            <InfoBox
              label="الساعة"
              value={boxTime || "من 10:30 ص إلى 11:30 ص"}
            />

            {/* عنوان الورشة */}
            <InfoBox
              label="عنوان الورشة"
              value={boxWorkshopTitle || "شرح عام لنظام جاهز"}
            />

            {/* الجمهور المستهدف */}
            <InfoBox
              label="المستفيدون"
              value={boxAudience || "منسوبو منظومة البيئة والمياه والزراعة"}
            />

            {/* الباركود */}
            <div className="bg-[#005D45] rounded-2xl px-3 py-3 text-center text-white flex flex-col items-center justify-center gap-2">
              <div className="text-[11px] font-semibold mb-1">
                {boxQrNote || "من خلال الضغط أو مسح الباركود"}
              </div>
              {qrImage ? (
                <img
                  src={qrImage}
                  alt="QR code"
                  className="w-16 h-16 object-contain bg-white rounded"
                />
              ) : (
                <div className="w-16 h-16 bg-white/10 rounded grid place-items-center text-[9px]">
                  QR
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
   <PosterFooter
        email={email}
        sourceLabel={sourceLabel || "المصدر: وكالة الوزارة للبحث والابتكار"}
        rightLogos={[]}
      />
    </div>
  );
}

/* ————— عناصر فرعية ————— */

function AgendaItem({ title, body }) {
  return (
    <div className="bg-white/70 rounded-2xl px-4 py-4 h-full shadow-sm">
      {/* الشريط الأصفر */}
      <div className="w-10 h-1.5 bg-[#FFC629] rounded-full mb-3" />
      <h4 className="text-[16px] font-bold text-[#005D45] mb-2">{title}</h4>
      <p className="text-[13px] text-[#005D45] leading-relaxed">{body}</p>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="bg-[#005D45] rounded-2xl px-3 py-3 text-center text-white flex flex-col items-center justify-center">
      <div className="text-[11px] opacity-80 mb-1">{label}</div>
      <div className="text-[12px] font-semibold leading-snug whitespace-pre-line">
        {value}
      </div>
    </div>
  );
}