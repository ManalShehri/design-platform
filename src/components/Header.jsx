export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* <img src="/logo.png" className="w-8 h-8" alt="" /> */}
          <span className="font-extrabold text-brand-800">المنصّة الذكية للمنشورات</span>
        </div>
        <nav className="text-sm text-slate-600">
          <a className="hover:text-brand-800" href="#">الدليل</a>
        </nav>
      </div>
    </header>
  );
}