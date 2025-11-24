import PosterHeader from "./PosterHeader.jsx";
import PosterFooter from "./PosterFooter.jsx";

export default function GeneralInfoPoster({ data }) {
  const {
    logoUrl,
    deptLine1,
    deptLine2,
    titlePrimary,
    titleSecondary,
    body,
    image,       // 👈 من formData (مرفق)
    email,
    sourceLabel,
  } = data;

  return (
    <div className="w-full h-full bg-[#F3FAF4] text-[#005D45] flex flex-col font-lina">
      <header className="px-8 pt-8 pb-3 flex items-center justify-between text-[10px] leading-snug">
        <div className="flex-shrink-0">
            <img src=" https://www.mewa.gov.sa/ar/Ministry/AboutMinistry/identity/MEWA%20-%20Brandmark%20-%20RGB.png" alt="Logo" className="w-180 h-24 object-contain" />
        </div>

        {/* الإدارة يسار + مستطيل على يمين النص */}
        <div className="flex items-start gap-2.5 flex-row-reverse">
          <div className="leading-snug text-right">
            <div className="text-[13px] font-bold">
              {deptLine1 || "وكالة الوزارة لتقنية المعلومات والتحول الرقمي"}
            </div>
            <div className="text-[11px] opacity-80 mt-0.5">
              {deptLine2 || "الإدارة العامة للتحول الرقمي"}
            </div>
          </div>
          <div className="w-[3px] h-10 bg-[#FFC629] rounded-full" />
        </div>
      </header>

      {/* CONTENT - padding أوسع */}
      <main className="px-20 pt-8 flex-1 flex flex-col justify-start">
        <section className="max-w-3xl">
          <h1 className="font-bold text-[42px] leading-tight text-[#46C752]">
            {titlePrimary || "نشرة الذكاء الاصطناعي"}
          </h1>
          <h2 className="text-[36px] leading-tight text-[#005D45] mt-1 pt-2">
            {titleSecondary ||
              "أهمية حماية البيانات في عصر الذكاء الاصطناعي"}
          </h2>

          <p className="mt-4 pt-6 text-[20px] leading-[1.6] text-[#005D45] text-justify">
            {body ||
            "تتزايد أهمية حماية الخصوصية والسرية في ظل الاستخدام المتنامي للذكاء الاصطناعي. من الضروري عدم مشاركة البيانات السرية مع أي جهة غير موثوقة، حيث يمكن أن تؤدي هذه الممارسات إلى انتهاك الخصوصية. بالإضافة إلى ذلك، يجب تجنب الاعتماد الكلي على تقنيات الذكاء الاصطناعي في اتخاذ القرارات، حيث إن ذلك قد يعرض البيانات الحساسة لمخاطر متعددة. لذا، ينبغي على الأفراد والمؤسسات اتخاذ تدابير فعالة لضمان حماية بياناتهم وضمان سريتها."
              }
          </p>
        </section>

        {/* الصورة أسفل النص */}
        <section className="mt-6 mb-5">
          <div className="w-full max-w-3xl rounded-3xl bg-[#DFF1E5] overflow-hidden shadow-card">
            {image ? (
              <img
                src={image}
                alt=""
                className="w-full h-[190px] object-cover"
              />
            ) : (
              <div className="w-full h-[190px] grid place-items-center text-[#005D45]/60 text-xs">
                مساحة صورة (مرفق)
              </div>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER - padding أصغر من المحتوى */}
      {/* FOOTER */}
           <PosterFooter
             email={email}
             sourceLabel={sourceLabel}
             rightLogos={[]}
           />
    </div>
  );
}