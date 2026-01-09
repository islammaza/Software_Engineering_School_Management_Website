// Authentication helper functions

export function getSchoolId(): string | null {
  return localStorage.getItem('schoolId');
}

export function getAdminEmail(): string | null {
  return localStorage.getItem('adminEmail');
}

export function getAdminName(): string | null {
  return localStorage.getItem('adminName');
}

export function isAuthenticated(): boolean {
  return !!getSchoolId();
}

export function logout() {
  // Clear all authentication data
  localStorage.removeItem('schoolId');
  localStorage.removeItem('adminEmail');
  localStorage.removeItem('adminName');
  
  // Clear any other cached data
  localStorage.clear();
  sessionStorage.clear();
  
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
