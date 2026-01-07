
export default function AiEnhanceSection({
  styleTone,
  setStyleTone,
  keywords,
  setKeywords,

  busy,
  aiLoading,

  setAiStage,
  setShowAiConfirm,
}) {
  return (

 <div className="mt-6 border rounded-xl p-4 bg-slate-50 space-y-3 relative">
          <h3 className="font-bold text-brand-800">التحسين بالذكاء الاصطناعي</h3>
          <p className="text-accent-brown"> الرجاء التأكد من عدم مشاركة بيانات سرية في حال رغبتك في تفعيل التحسين بالذكاء الاصطناعي</p>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold">الأسلوب</label>
              <select
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={styleTone}
                onChange={(e) => setStyleTone(e.target.value)}
              >
                <option>رسمي</option>
                <option>لطيف</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold">
                كلمات مفتاحية
              </label>
              <input
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="ابتكار، تمكين، تعلّم…"
              />
            </div>
          </div>
         <button
            // onClick={enhanceText}
onClick={() => {
  setAiStage("confirm");
  setShowAiConfirm(true);
}}

            disabled={busy || aiLoading}   // ❗ يتعطّل لو التصدير شغال أو الـ AI شغال
            className="w-full mt-2 bg-brand-500 text-white font-semibold px-4 py-2 rounded-lg hover:brightness-110 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {aiLoading ? "جاري التحسين..." : "تحسين المحتوى"}
          </button>
          {/* رسالة حالة الذكاء الاصطناعي */}
         {false && (
      <div className="absolute inset-0 z-50 flex items-center justify-center">
        {/* خلفية شفافة */}
        <div
          className="absolute inset-0 bg-black/30 rounded-xl"
          onClick={() => {
            // لو تبين تمنعين الإغلاق بالضغط خارجها احذفي هذا
            if (aiStage !== "loading") {
              setAiModalOpen(false);
              setAiStage("idle");
            }
          }}
        />

        {/* المودال */}
        <div className="relative z-10 w-[92%] max-w-md bg-white rounded-2xl shadow-xl p-5">
          {aiStage === "confirm" && (
            <>
              <h4 className="font-bold text-slate-800 text-base mb-2">
                تنبيه قبل التحسين
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                الرجاء التأكد من عدم مشاركة أي بيانات سرية أو حساسة عند استخدام
                ميزة التحسين بالذكاء الاصطناعي.
              </p>

              <div className="mt-4 flex gap-2 justify-end">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
                  onClick={() => {
                    setAiModalOpen(false);
                    setAiStage("idle");
                    setAiMessage("تم الإلغاء. لم يتم إرسال أي بيانات.");
                  }}
                >
                  إلغاء
                </button>

                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-brand-500 text-white hover:brightness-110 text-sm"
                  // onClick={runEnhance}
                  onClick={handleAiConfirm}
                >
                  متابعة
                </button>
              </div>
            </>
          )}

          {aiStage === "loading" && (
            <div className="py-6 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-brand-500 animate-spin" />
              <p className="mt-3 text-sm font-semibold text-slate-700">
                جاري التحسين...
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {aiMessage || "يرجى الانتظار"}
              </p>
            </div>
          )}

          {aiStage === "done" && (
            <div className="py-2">
              <h4 className="font-bold text-slate-800 text-base mb-2">
                نتيجة التحسين
              </h4>
              <p className="text-sm text-slate-600">{aiMessage}</p>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-brand-500 text-white hover:brightness-110 text-sm"
                  onClick={() => {
                    setAiModalOpen(false);
                    setAiStage("idle");
                  }}
                >
                  إغلاق
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )}

        </div>
          );
}