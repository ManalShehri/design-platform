// src/components/WorkshopInvitePoster.jsx
import PosterHeader from "./PosterHeader.jsx";
import PosterFooter from "./PosterFooter.jsx";

export default function WorkshopInvitePoster({ data }) {
  const {
    logoUrl,
    deptLine1,
    deptLine2,

    // العناوين الأساسية
    inviteLine, // ندعوكم لحضور ورشة عمل عن بُعد
    audienceLine, // لتدريب منسوبي ...
    systemLine, // على نظام جاهز ...

    // أجندة الورشة (حقول ثابتة + مصفوفة ديناميكية لاحقًا)
    agenda1Title,
    agenda1Body,
    agenda2Title,
    agenda2Body,
    agenda3Title,
    agenda3Body,
    agenda4Title,
    agenda4Body,
    agendaItems = [], // 👈 مصفوفة لمحاور ديناميكية (عنوان + وصف)

    // الصناديق الخضراء
    boxes = [],

    email,
    sourceLabel,
    workshopImage,
  } = data;

  // 🔹 تجهيز محاور الورشة:
  // لو فيه agendaItems من النموذج → نستخدمها (حد أقصى 6)
  // لو لا → نرجع للمحاور الأربعة الافتراضية الموجودة الآن
  const fallbackAgenda = [
    {
      title: agenda1Title || "خدمات الموارد المؤسسية",
      body:
        agenda1Body ||
        "التعرّف على أبرز خدمات الموارد المؤسسية وكيفية الاستفادة منها.",
    },
    {
      title: agenda2Title || "خدمات الشبكات والهواتف",
      body:
        agenda2Body ||
        "عرض موجز للخدمات الفنية المقدّمة للشبكات وأنظمة الاتصال.",
    },
    {
      title: agenda3Title || "خدمات الأمن والسلامة",
      body:
        agenda3Body ||
        "توضيح دور نظام جاهز في طلبات وخدمات الأمن والسلامة.",
    },
    {
      title: agenda4Title || "خدمات الدعم والتطبيقات",
      body:
        agenda4Body ||
        "شرح آلية رفع الطلبات للتطبيقات والدعم الفني والمتابعة.",
    },
  ];

  const finalAgenda =
    Array.isArray(agendaItems) && agendaItems.length > 0
      ? agendaItems.slice(0, 6) // ٢ إلى ٦ عناصر
      : fallbackAgenda;

  return (
    <div className="w-full min-h-[1273px] bg-[#F3FAF4] text-[#005D45] flex flex-col font-lina">
      <PosterHeader
        logoUrl={logoUrl}
        deptLine1={deptLine1}
        deptLine2={deptLine2}
        accentColor="#629FFC" // الأزرق الطويل
        variant="short-bar"
      />

      {/* CONTENT */}
      <main className="px-20 pt-8 flex-1 flex flex-col justify-start">
        {/* عناوين الدعوة */}
        <section className="max-w-3xl mb-8">
          <p className="text-[35px] text-[#005D45] leading-snug">
            {inviteLine}
          </p>

          <p className="text-[40px] font-bold text-[#46C752] leading-snug mt-4">
            {audienceLine}
          </p>

          <p className="text-[30px] font-bold text-[#005D45] leading-snug mt-5">
            {systemLine}
          </p>
        </section>

        {/* أجندة الورشة – نفس التصميم، لكن ديناميكي حتى ٦ محاور */}
        <section className="w-full max-w-4xl bg-[#EAF5EC] rounded-3xl px-10 py-8 mb-10">
          <h3 className="text-[32px] font-bold text-[#005D45] mb-4">
            محاور الورشة:
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {finalAgenda.slice(0, 6).map((item, idx) => (
              <AgendaItem key={idx} title={item.title} body={item.body} />
            ))}
          </div>
        </section>

        {/* صورة تحت محاور الورشة */}
        {workshopImage && (
          <section className="w-full max-w-3xl mx-auto mt-10 mb-10">
            <div className="rounded-2xl shadow-md overflow-hidden bg-white p-2">
              <img
                src={workshopImage}
                alt="Workshop Image"
                className="w-full h-64 object-cover rounded-xl"
              />
            </div>
          </section>
        )}

        {/* صناديق المعلومات السفلية */}
        {boxes.length > 0 && <BoxesSection boxes={boxes} />}
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

/* ————— توزيع البوكسات الخضراء ————— */

function BoxesSection({ boxes }) {
  // لا أكثر من 5
  const limited = boxes.slice(0, 5);
  const count = limited.length;

  if (count === 0) return null;

  // ✅ حالة 1–4 بوكسات: كلها في سطر واحد في المنتصف
  if (count <= 4) {
    return (
      <section className="w-full max-w-4xl mx-auto mt-4 mb-8">
        <div className="flex justify-center gap-4 flex-nowrap">
          {limited.map((box, idx) => (
            <DynamicBox key={box.id || idx} box={box} index={idx} />
          ))}
        </div>
      </section>
    );
  }

  // ✅ حالة 5 بوكسات: 3 فوق + 2 تحت، وكل صف في المنتصف
  const firstRow = limited.slice(0, 3); // 0,1,2
  const secondRow = limited.slice(3); // 3,4

  return (
    <section className="w-full max-w-4xl mx-auto mt-4 mb-8">
      <div className="flex flex-col items-center gap-4">
        <div className="flex justify-center gap-4 flex-nowrap">
          {firstRow.map((box, idx) => (
            <DynamicBox key={box.id || idx} box={box} index={idx} />
          ))}
        </div>
        <div className="flex justify-center gap-4 flex-nowrap">
          {secondRow.map((box, idx) => (
            <DynamicBox
              key={box.id || idx + 3}
              box={box}
              index={idx + 3}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ————— عناصر فرعية ————— */

function AgendaItem({ title, body }) {
  return (
    <div className="bg-white/70 rounded-2xl px-4 py-4 h-full shadow-sm">
      {/* الشريط الأصفر */}
      <div className="w-10 h-1.5 bg-[#FFC629] rounded-full mb-3" />
      <h4 className="text-[20px] font-bold text-[#005D45] mb-2">{title}</h4>
      <p className="text-[15px] text-[#005D45] leading-relaxed">{body}</p>
    </div>
  );
}

function DynamicBox({ box, index }) {
  return (
    <div className="bg-[#005D45] rounded-2xl px-4 py-4 text-white flex flex-col items-center text-center gap-2 w-[190px] min-h-[120px]">
      <div className="flex flex-col items-center gap-1">
        <span className="text-[14px]">{box.icon }</span>
        <span className="text-[12px] font-bold">
          {box.label || `المربع ${index + 1}`}
        </span>
      </div>

      <div className="w-8 h-1 bg-[#FFC629] rounded-full" />

      <p className="text-[12px] leading-relaxed whitespace-pre-line">
        {box.text || ""}
      </p>
    </div>
  );
}

// احتياط لو احتجناه لاحقاً
function InfoBox({ label, value }) {
  return (
    <div className="bg-[#005D45] rounded-2xl px-3 py-3 text-center text-white flex flex-col items-center justify-center">
      <div className="text-[11px] opacity-80 mb-1">{label}</div>
      <div className="text-[12px] font-semibold leading-snug whitespace-pre-line">
        {value}</div>
    </div>
  );
}