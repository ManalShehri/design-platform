export default function Home({ onStart }) {
  return (
    <div className="min-h-[calc(100vh-56px)] grid place-items-center bg-brand-800 text-white px-6">
      <div className="w-full max-w-3xl text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold">المنصّة الذكية للمنشورات</h1>
        <p className="text-white/90 leading-8">
          أنشئي تصاميم فورية من قوالب جاهزة، مع تحسينات بالذكاء الاصطناعي… بالعربية وRTL.
        </p>
        <button
          onClick={onStart}
          className="inline-flex items-center justify-center px-8 py-3 rounded-xl text-lg font-semibold bg-brand-500 hover:brightness-110 transition shadow-card"
        >
          ابدأ الخدمة
        </button>
      </div>
    </div>
  );
}