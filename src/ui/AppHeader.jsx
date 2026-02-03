import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AppHeader() {
  const nav = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link to="/create" className="font-extrabold text-brand-900">
          المنصة الذكية للمنشورات
        </Link>

        <div className="relative">
          <button
            onClick={() => setOpen((s) => !s)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100"
          >
            <div className="h-9 w-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <span className="text-brand-800 font-black">
                {(user?.name || "م")[0]}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-slate-800">{user?.name}</div>
              <div className="text-xs text-slate-500">{user?.email}</div>
            </div>
          </button>

          {open && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setOpen(false)}
              />
              <div className="absolute z-50 mt-2 w-52 rounded-xl border bg-white shadow-xl overflow-hidden">
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-sm hover:bg-slate-50"
                >
                  الملف الشخصي
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                    nav("/", { replace: true });
                  }}
                  className="w-full text-right px-4 py-3 text-sm hover:bg-slate-50 text-red-600"
                >
                  تسجيل الخروج
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}