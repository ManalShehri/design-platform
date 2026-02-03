// ✅ NEW FILE: src/pages/Profile.jsx
// (Add this page only — no changes to your existing code here)

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";

function Section({ title, children }) {
  return (
    <section className="bg-white rounded-2xl shadow-card border p-6">
      <h2 className="text-lg font-extrabold text-brand-800 mb-4">{title}</h2>
      {children}
    </section>
  );
}

export default function Profile() {
  const { user } = useAuth();

  // fallback (in case user is not ready yet)
  const safeUser = useMemo(
    () => ({
      name: user?.name || "",
      email: user?.email || "",
      jobTitle: user?.jobTitle || "",
      image: user?.image || "",
    }),
    [user]
  );

  // -------- Personal info form state --------
  const [name, setName] = useState(safeUser.name);
  const [email, setEmail] = useState(safeUser.email);
  const [jobTitle, setJobTitle] = useState(safeUser.jobTitle);
  const [imagePreview, setImagePreview] = useState(safeUser.image);

  // -------- Password reset state --------
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // UI messages
  const [infoMsg, setInfoMsg] = useState("");
  const [infoErr, setInfoErr] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [passErr, setPassErr] = useState("");

  useEffect(() => {
    setName(safeUser.name);
    setEmail(safeUser.email);
    setJobTitle(safeUser.jobTitle);
    setImagePreview(safeUser.image);
  }, [safeUser]);

  const onPickImage = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(String(e.target?.result || ""));
    reader.readAsDataURL(file);
  };

  const handleSaveInfo = async () => {
    setInfoMsg("");
    setInfoErr("");

    // ✅ Frontend-only for now:
    // later: call backend endpoint to persist
    try {
      // Example placeholder:
      // await updateProfile({ name, jobTitle, image: imagePreview });

      setInfoMsg("تم حفظ البيانات");
    } catch (e) {
      setInfoErr(e?.message || "تعذر حفظ البيانات.");
    }
  };

  const handleResetPassword = async () => {
    setPassMsg("");
    setPassErr("");

    if (!newPassword || newPassword.length < 8) {
      setPassErr("كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPassErr("تأكيد كلمة المرور غير مطابق.");
      return;
    }

    // ✅ Frontend-only for now:
    // later: call backend endpoint to change password securely
    try {
      // Example placeholder:
      // await changePassword({ currentPassword, newPassword });

      setPassMsg("تم تحديث كلمة المرور).");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (e) {
      setPassErr(e?.message || "تعذر تحديث كلمة المرور.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-brand-800">
            الملف الشخصي
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* ===== Personal Info ===== */}
          <Section title="المعلومات الشخصية">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden border flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-brand-800 font-extrabold text-xl">
                    {(name || email || "U")[0]?.toUpperCase()}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  الصورة
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full border rounded-xl p-2 text-sm bg-white"
                  onChange={(e) => onPickImage(e.target.files?.[0])}
                />
                <p className="text-xs text-slate-500 mt-1">
                  (واجهة فقط الآن — سيتم ربطها بالباكند لاحقاً)
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  الاسم الأول
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="الاسم"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  الاسم الأخير
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="الاسم"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  البريد الإلكتروني
                </label>
                <input
                  value={email}
                  disabled
                  className="w-full border rounded-xl p-3 bg-slate-100 text-slate-600 cursor-not-allowed"
                  placeholder="email"
                />
                {/* <p className="text-xs text-slate-500 mt-1">
                  البريد لا يتغير حالياً.
                </p> */}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  المسمى الوظيفي
                </label>
                <input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full border rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="مثال: Software Engineer"
                />
              </div>

              {(infoErr || infoMsg) && (
                <div
                  className={[
                    "rounded-xl border px-4 py-3 text-sm",
                    infoErr
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700",
                  ].join(" ")}
                >
                  {infoErr || infoMsg}
                </div>
              )}

              <button
                type="button"
                onClick={handleSaveInfo}
                className="w-full bg-brand-500 hover:brightness-110 text-white font-semibold px-4 py-3 rounded-xl"
              >
                حفظ المعلومات
              </button>
            </div>
          </Section>

          {/* ===== Password Settings ===== */}
          <Section title="إعدادات كلمة المرور">
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  كلمة المرور الحالية
                </label>
                <input
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="********"
                  type="password"
                  autoComplete="current-password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  كلمة المرور الجديدة
                </label>
                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="********"
                  type="password"
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  تأكيد كلمة المرور الجديدة
                </label>
                <input
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full border rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="********"
                  type="password"
                  autoComplete="new-password"
                />
              </div>

              {(passErr || passMsg) && (
                <div
                  className={[
                    "rounded-xl border px-4 py-3 text-sm",
                    passErr
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700",
                  ].join(" ")}
                >
                  {passErr || passMsg}
                </div>
              )}

              <button
                type="button"
                onClick={handleResetPassword}
                className="w-full bg-brand-900 hover:brightness-110 text-white font-semibold px-4 py-3 rounded-xl"
              >
                تحديث كلمة المرور
              </button>

              <p className="text-xs text-slate-500">
                ملاحظة: التحديث الحقيقي سيتم عبر الباكند (جلسات/توكن) لاحقاً.
              </p>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}