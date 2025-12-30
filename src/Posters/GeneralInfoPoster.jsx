import PosterHeader from "./Utl//PosterHeader.jsx";
import PosterFooter from "./Utl/PosterFooter.jsx";

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
      <PosterHeader
        logoUrl={logoUrl}
        deptLine1={deptLine1}
        deptLine2={deptLine2}
        accentColor="#629FFC" // الأزرق الطويل
        variant="short-bar"
      />

      {/* CONTENT - padding أوسع */}
      <main className="px-20 pt-8 flex-1 flex flex-col justify-start">
        <section className="max-w-3xl">
          <h1 className="font-bold text-[42px] leading-tight text-[#46C752]">
            {titlePrimary}
          </h1>
          <h2 className="text-[36px] leading-tight text-[#005D45] mt-1 pt-2">
            {titleSecondary}
          </h2>

          <p className="mt-4 pt-6 text-[20px] leading-[1.6] text-[#005D45] text-justify">
            {body}
          </p>
        </section>

        {/* الصورة أسفل النص */}
        <section className="mt-6 mb-5">
          <div className="w-full max-w-3xl rounded-3xl bg-[#DFF1E5] overflow-hidden shadow-card">
            {image ? (
              <div className="relative w-full h-full">
                <img
                  src={image}
                  alt=""
                  className="w-full h-full object-cover"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#F3FAF4]/70 via-[#F3FAF4]/20 to-transparent" />
              </div>
            ) : (
              <div className="w-full h-[540px] grid place-items-center text-[#005D45]/60 text-xs">
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