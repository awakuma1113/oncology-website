const MEDICAL_ACCESS_KEY = 'medicalAccess';
const MEDICAL_ACCESS_AT_KEY = 'medicalAccessGrantedAt';
const MEDICAL_ACCESS_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function isMedicalAccessGranted() {
  const access = localStorage.getItem(MEDICAL_ACCESS_KEY);
  const grantedAt = Number(localStorage.getItem(MEDICAL_ACCESS_AT_KEY));
  if (access !== 'granted' || !Number.isFinite(grantedAt)) {
    clearMedicalAccess();
    return false;
  }
  if (Date.now() - grantedAt > MEDICAL_ACCESS_TTL_MS) {
    clearMedicalAccess();
    return false;
  }
  return true;
}

function grantMedicalAccess() {
  localStorage.setItem(MEDICAL_ACCESS_KEY, 'granted');
  localStorage.setItem(MEDICAL_ACCESS_AT_KEY, Date.now().toString());
}

function clearMedicalAccess() {
  localStorage.removeItem(MEDICAL_ACCESS_KEY);
  localStorage.removeItem(MEDICAL_ACCESS_AT_KEY);
}

function requireMedicalAccess() {
  if (!isMedicalAccessGranted()) {
    window.location.replace('education.html');
  }
}
