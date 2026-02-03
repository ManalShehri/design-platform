const AUTH_KEY = "dp_auth"; // { token, user: { name, email } }

export function getAuth() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
  } catch {
    return null;
  }
}

export function isAuthed() {
  return Boolean(getAuth()?.token);
}

export function loginMock({ name, email }) {
  const payload = {
    token: `mock-${Date.now()}`,
    user: {
      name: name || "مستخدم",
      email: email || "",
    },
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(payload));
  return payload;
}

export function updateUser(patch) {
  const auth = getAuth();
  if (!auth) return null;
  const next = { ...auth, user: { ...auth.user, ...patch } };
  localStorage.setItem(AUTH_KEY, JSON.stringify(next));
  return next;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}