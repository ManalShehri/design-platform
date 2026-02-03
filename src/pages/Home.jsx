import { useNavigate } from "react-router-dom";

export default function Home({ onStart }) {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-[calc(100vh-56px)] bg-brand-800 text-white flex flex-col items-center justify-center px-6 overflow-hidden">

      {/* النص في المنتصف */}
      <div className="relative z-10 w-full max-w-3xl text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold">
          المنصّة الذكية للمنشورات
        </h1>

        <p className="text-white/90 leading-8 text-lg">
          صمّم منشورك خلال ثوانٍ عبر الذكاء الاصطناعي مع تصدير جاهز للطباعة أو النشر
        </p>

        <button
          onClick={onStart}
          className="inline-flex items-center justify-center px-8 py-3 rounded-xl text-lg font-semibold bg-brand-500 hover:brightness-110 transition shadow-card"
        >
          ابدأ الخدمة
        </button>
        <button
          onClick={() => navigate("/login")}
          className="inline-flex items-center justify-center px-8 py-3 rounded-xl text-lg font-semibold bg-white/10 hover:bg-white/15 transition shadow-card"
        >
          تسجيل الدخول
        </button>
      </div>

      {/* الصورة أسفل الصفحة */}
      <img
        src="/src/assets/002.svg"
        alt="Background Illustration"
        className="absolute bottom-0 left-0 w-full opacity-20 pointer-events-none select-none"
      />
    </div>
  );
}