// src/components/PosterFooter.jsx

export default function PosterFooter({
  email = "ITCOM@mewa.gov.sa",
  sourceLabel = "المصدر: إدارة ...",
  rightLogos = [], // احتياط للمستقبل
}) {
  return (
    <footer className="relative px-5 pt-3 pb-6 text-[10px] overflow-hidden">
      {/* خلفية الصورة بعرض الفوتر كامل + شفافية */}
      <img
        src="/src/assets/002.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none select-none"
      />

      {/* المحتوى فوق الخلفية */}
      <div className="relative z-10 flex items-center justify-between ltr">
        {/* <div className="flex items-center gap-1.5 text-[#005D45]">
          <span className="text-sm ltr  text-[#005D45]">يسعدنا مشاركتكم عبر البريد الالكتروني</span>
          <span className="ltr">
            {email || "ITCOM@mewa.gov.sa"}
          </span>
        </div> */}
        {/* البوكس الأخضر أقصى اليسار */}
        <div className="bg-[#005D45] text-white px-4 py-2 rounded-l-lg rounded-r-none text-[10px]">
          {sourceLabel || "المصدر: إدارة ..."}
        </div>

        {/* الإيميل يمين */}
        
      </div>
    </footer>
  );
}