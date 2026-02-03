import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useState, useRef, useEffect } from "react";


export default function Header() {
  const navigate = useNavigate();
  const { auth, user, logoutSecure, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // const { user, logout } = useAuth();
  useEffect(() => {
    const onDown = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex-shrink-0">
            <img src=" https://www.mewa.gov.sa/ar/Ministry/AboutMinistry/identity/MEWA%20-%20Brandmark%20-%20RGB.png" alt="Logo" className="w-180 h-16 object-contain" />
        </div>
        <div className="flex items-center gap-3">
          {/* <img src="/logo.png" className="w-8 h-8" alt="" /> */}
          <span className="font-extrabold text-brand-800">المنصّة الذكية للمنشورات</span>
        </div>
        {/* <nav className="text-sm text-slate-600"> */}
          <nav className="text-sm text-slate-600 flex items-center gap-2">
          {/* <span className="font-extrabold text-brand-800">المنصّة الذكية للمنشورات</span> */}
          {!user ? (
              <button
                onClick={() => navigate("/login")}
                className="ml-3 text-sm px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Login
              </button>
            ) : (
              <div className="relative ml-3" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                  className="text-sm px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center gap-2"
                >
                  <span className="w-7 h-7 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-xs">
                    {(user?.name || user?.email || "U")[0]?.toUpperCase()}
                  </span>
                  <span className="font-semibold text-brand-800">
                    {user?.name || user?.email}
                  </span>
                  <span className="text-xs opacity-70">▾</span>
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-card overflow-hidden z-50">
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        navigate("/profile");
                      }}
                      className="w-full text-right px-4 py-3 text-sm hover:bg-gray-50 text-slate-700"
                    >
                      الملف الشخصي
                    </button>

                   
                    <button
                      onClick={() => {
                        navigate("/create");
                        setOpen(false);
                      }}
                      className="w-full text-right px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      الرئيسية
                    </button>
                     <button
                      type="button"
                      onClick={async () => {
                        setOpen(false);
                        await logoutSecure();
                        navigate("/");
                      }}
                      className="w-full text-right px-4 py-3 text-sm hover:bg-gray-50 text-red-600"
                    >
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            )}

          {/* <a className="hover:text-brand-800" href="#">الدليل</a> */}
        </nav>
      </div>
    </header>
  );
}