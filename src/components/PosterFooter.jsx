// src/components/PosterFooter.jsx

export default function PosterFooter({
  email = "ITCOM@mewa.gov.sa",
  sourceLabel = "المصدر: إدارة ...",
  rightLogos = [], // مصفوفة روابط شعارات (اختياري)
}) {
  return (
      <footer className="px-5 pb-6 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-1.5 text-[#005D45]">
          <span className="text-sm">✉️</span>
          <span className="ltr">
            {email || "ITCOM@mewa.gov.sa"}
          </span>
        </div>

        <div className="ml-0">
          <div className="bg-[#005D45] text-white px-4 py-2 rounded-l-lg rounded-r-none text-[10px]">
            {sourceLabel || "ITCOM@mewa.gov.sa"}
          </div>
           <div className="flex-shrink-0">
            <img src="/src/assets/002.svg" alt="Logo" className="w-180 h-24 object-contain" />
        </div>
        </div>
      </footer>

  );
}