import { createContext, useContext, useMemo, useState } from "react";
import { useEffect } from "react";

const AuthContext = createContext(null);
const API_BASE = "http://localhost:3001";

export function AuthProvider({ children }) {
  useEffect(() => {
  fetchMe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
  const [user, setUser] = useState(null);

  const login = async ({ username }) => {
    // Frontend-only login (بدون backend)
    setUser({ name: username || "User" });
  };

  const logout = () => setUser(null);
  const loginSecure = async ({ email, password }) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // مهم عشان الكوكي
    body: JSON.stringify({ email, password }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.detail || "تعذر تسجيل الدخول");
  }
  setUser(json.user);
};

const logoutSecure = async () => {
  await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
  }).catch(() => {});
  setUser(null);
};

const fetchMe = async () => {
  const res = await fetch(`${API_BASE}/auth/me2`, {
    credentials: "include",
  });

  if (!res.ok) return;
  const json = await res.json().catch(() => ({}));
  if (json?.user) setUser(json.user);
};

  // const value = useMemo(() => ({ user, login, logout }), [user]);
  const value = useMemo(
  () => ({ user, login, logout, loginSecure, logoutSecure }),
  [user]
);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}