// src/components/ExecutiveSummaryPoster.jsx
import PosterFooter from "./PosterFooter.jsx";

export default function ExecutiveSummaryPoster({ data }) {
  const {
    logoUrl,
    title = "Executive Summary",
    intro = "تهدف هذه الخطوات إلى ...",
    tableRows = [],
    footerNote = "نص توضيحي صغير في الأسفل",
  } = data;

  const rows = Array.isArray(tableRows) ? tableRows.slice(0, 6) : [];

  return (
    <div className="w-full h-full bg-white text-[#205833] flex flex-col font-lina">
      {/* Header */}
      <header className="px-12 pt-10 flex items-start justify-between">
        {/* Right: small dark green shape + title */}
        <div className="flex items-center gap-3">
          <div className="w-5 h-10 bg-[#205833] rounded-sm" />
          <h1 className="text-[34px] font-bold text-[#205833] leading-none">
            {title}
          </h1>
        </div>

        {/* Left: logo */}
        <div className="h-12 flex items-center">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-12 object-contain" />
          ) : (
            <div className="h-12 w-28 bg-slate-100 rounded" />
          )}
        </div>
      </header>

      {/* Body */}
      <main className="px-12 pt-8 flex-1">
        {/* Light green box */}
        <div className="bg-[#EAF5EC] rounded-3xl px-8 py-6 mb-7">
          <p className="text-[18px] leading-relaxed text-[#205833]">
            {intro}
          </p>
        </div>

        {/* Table */}
        <div className="rounded-3xl overflow-hidden border border-[#E2EFE5]">
          {/* Header row */}
          <div className="grid grid-cols-2 bg-[#205833]">
            <div className="px-6 py-4 text-[#F3FAF4] font-bold text-[16px]">
              البند
            </div>
            <div className="px-6 py-4 text-[#F3FAF4] font-bold text-[16px]">
              التفاصيل
            </div>
          </div>

          {/* Rows */}
          {rows.length === 0 ? (
            <div className="px-6 py-6 text-[14px] text-slate-500">
              لا توجد بيانات بعد
            </div>
          ) : (
            rows.map((r, idx) => (
              <div
                key={r.id || idx}
                className="grid grid-cols-2 bg-white border-t border-[#E2EFE5]"
              >
                <div className="px-6 py-4 text-[15px] text-[#205833]">
                  {r.col1 || ""}
                </div>
                <div className="px-6 py-4 text-[15px] text-[#205833]">
                  {r.col2 || ""}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Footer (left shading + right small text) */}
      <footer className="px-12 pb-10 pt-6 flex items-end justify-between">
        {/* left shading shape */}
        <div className="h-10 w-56 rounded-xl bg-gradient-to-r from-[#205833]/20 to-transparent" />

        {/* right note */}
        <div className="text-[12px] text-[#205833] opacity-90">
          {footerNote}
        </div>
      </footer>

      {/* لو تبين نفس Footer component حقكم بدل الفوتر أعلاه:
          احذفي <footer>... واستعملي PosterFooter */}
      {/* <PosterFooter sourceLabel={footerNote} rightLogos={[]} /> */}
    </div>
  );
}