import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

const { loginSecure } = useAuth();

  return (
    <div className="min-h-[calc(100vh-56px)] bg-brand-800 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/10 rounded-2xl p-6 backdrop-blur border border-white/15">
        <h1 className="text-2xl font-extrabold text-center mb-6">تسجيل الدخول</h1>

        {/* <label className="block text-sm mb-2">اسم المستخدم</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-xl p-3 text-slate-900"
          placeholder="مثال: Manal"
        /> */}
        {error && (
            <div className="mt-3 rounded-xl border border-red-300 bg-red-50 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div className="mt-4">
            <label className="block text-sm mb-2">البريد الإلكتروني</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl p-3 text-slate-900"
              placeholder="name@domain.com"
              type="email"
              autoComplete="email"
            />
          </div>

          <div className="mt-3">
            <label className="block text-sm mb-2">كلمة المرور</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl p-3 text-slate-900"
              placeholder="********"
              type="password"
              autoComplete="current-password"
            />
          </div>

          <button
            onClick={async () => {
              setError("");
              setSubmitting(true);
              try {
                await loginSecure({ email, password });
                navigate("/create");
              } catch (e) {
                let msg = "فشل تسجيل الدخول";

                if (typeof e === "string") {
                  msg = e;
                } else if (e?.message) {
                  msg = e.message;
                } else if (e?.detail) {
                  msg = e.detail;
                }

                setError(msg);
              } finally {
                setSubmitting(false);
              }
            }}
            disabled={submitting}
            className="w-full mt-4 bg-brand-500 hover:brightness-110 rounded-xl py-3 font-semibold disabled:opacity-60"
          >
            {submitting ? "جاري الدخول..." : "دخول"}
          </button>

        <button
          onClick={async () => {
            await login({ username });
            navigate("/create");
          }}
          className="w-full mt-4 bg-brand-500 hover:brightness-110 rounded-xl py-3 font-semibold"
        >
        test  دخول
        </button>
      </div>
      <img
        src="/src/assets/002.svg"
        alt="Background Illustration"
        className="absolute bottom-0 left-0 w-full opacity-20 pointer-events-none select-none"
      />
    </div>
  );
}