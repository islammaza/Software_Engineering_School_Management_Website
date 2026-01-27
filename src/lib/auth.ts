// Authentication helper functions

const getLocalStorage = (): Storage | null => {
  if (typeof window === "undefined") return null;
  return window.localStorage;
};

const getSessionStorage = (): Storage | null => {
  if (typeof window === "undefined") return null;
  return window.sessionStorage;
};

export function getSchoolId(): string | null {
  return getLocalStorage()?.getItem('schoolId') ?? null;
}

export function getAdminEmail(): string | null {
  return getLocalStorage()?.getItem('adminEmail') ?? null;
}

export function getAdminName(): string | null {
  return getLocalStorage()?.getItem('adminName') ?? null;
}

export function isAuthenticated(): boolean {
  return !!getSchoolId();
}

export function logout() {
  const local = getLocalStorage();
  const session = getSessionStorage();

  // Clear all authentication data
  local?.removeItem('schoolId');
  local?.removeItem('adminEmail');
  local?.removeItem('adminName');
  
  // Clear any other cached data
  local?.clear();
  session?.clear();
  
  // Prevent browser back button from accessing cached pages
  window.history.pushState(null, '', window.location.href);
  window.onpopstate = function() {
    window.history.pushState(null, '', window.location.href);
  };
}

export function requireAuth(navigate: (path: string) => void): string | null {
  const schoolId = getSchoolId();
  if (!schoolId) {
    navigate('/login');
    return null;
  }
  return schoolId;
}
