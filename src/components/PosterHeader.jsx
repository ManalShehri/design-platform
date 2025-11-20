// src/components/PosterHeader.jsx

export default function PosterHeader({
  logoUrl,
  deptLine1,
  deptLine2,
  accentColor = "#FFC629",
  variant = "default",
}) {
  return (
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
  );
}