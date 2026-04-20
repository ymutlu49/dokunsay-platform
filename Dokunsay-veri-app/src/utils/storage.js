export function loadStudents() {
  try {
    const raw = localStorage.getItem("dv_students");
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

export function saveStudents(list) {
  try { localStorage.setItem("dv_students", JSON.stringify(list)); } catch (e) {}
}

// Mevcut öğrenciyi getir; yoksa "Ziyaretçi" dön
export function loadCurrentStudent() {
  try {
    const raw = localStorage.getItem("dv_current_student");
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

export function saveCurrentStudent(student) {
  try {
    if (student) localStorage.setItem("dv_current_student", JSON.stringify(student));
    else localStorage.removeItem("dv_current_student");
  } catch (e) {}
}

// Benzersiz öğrenci ID üret (zaman tabanlı)
export function genStudentId() {
  return `s${Date.now().toString(36)}${Math.floor(Math.random() * 1000).toString(36)}`;
}
