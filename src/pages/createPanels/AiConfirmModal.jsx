
export default function AiConfirmModal({
  showAiConfirm,
  aiStage,
  setShowAiConfirm,
  setAiStage,
  handleAiConfirm,
}) {
  if (!showAiConfirm) return null;

  return (

  <div className="fixed inset-0 z-50 flex items-center justify-center">
    
    {/* الخلفية المظللة */}
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

    {/* البوكس */}
    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center space-y-4">

      {aiStage === "confirm" && (
        <>
          <h3 className="text-lg font-bold text-brand-800">
            تنبيه قبل استخدام الذكاء الاصطناعي
          </h3>
          <p className="text-sm text-slate-600 leading-6">
            يرجى التأكد من عدم إدخال أو مشاركة أي بيانات سرية أو حساسة.
            سيتم استخدام المحتوى المدخل لغرض تحسين الصياغة فقط.
          </p>

          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => setShowAiConfirm(false)}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
            >
              إلغاء
            </button>
            <button
              onClick={handleAiConfirm}
              className="px-4 py-2 rounded-lg bg-brand-500 text-white text-sm hover:brightness-110"
            >
              موافق
            </button>
          </div>
        </>
      )}

      {aiStage === "loading" && (
        <>
          <div className="mx-auto w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-600">
            جاري تحسين المحتوى بالذكاء الاصطناعي…
          </p>
        </>
      )}

      {aiStage === "done" && (
        <>
          <h3 className="text-lg font-bold text-brand-800">
            تم التحسين بنجاح
          </h3>
          <p className="text-sm text-slate-600">
            تم تحسين المحتوى ويمكنك الآن مراجعته أو تصديره.
          </p>
          <button
            onClick={() => {
              setShowAiConfirm(false);
              setAiStage("idle");
            }}
            className="mt-2 px-4 py-2 rounded-lg bg-brand-500 text-white text-sm"
          >
            إغلاق
          </button>
        </>
      )}

    </div>
  </div>

    );
}