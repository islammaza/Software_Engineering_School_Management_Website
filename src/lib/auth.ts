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
  localStorage.removeItem('schoolId');
  localStorage.removeItem('adminEmail');
  localStorage.removeItem('adminName');
}

export function requireAuth(navigate: (path: string) => void): string | null {
  const schoolId = getSchoolId();
  if (!schoolId) {
    navigate('/login');
    return null;
  }
  return schoolId;
}
