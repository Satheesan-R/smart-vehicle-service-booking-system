const AUTH_STORAGE_KEY = "svs_auth";

export function saveAuth(authPayload) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authPayload));
}

export function getAuth() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getCurrentUser() {
  const auth = getAuth();
  return auth?.user ?? null;
}

export function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}