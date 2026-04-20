import {
  doc, setDoc, getDoc, updateDoc, collection,
  query, where, getDocs, arrayUnion, arrayRemove,
} from "firebase/firestore";
import { db } from "../config/firebase";
import type { UserProfile, ClassRoom, ProgressMap, Template } from "../types";

/* ===== User Profile ===== */

export async function createUserProfile(uid: string, profile: UserProfile): Promise<void> {
  await setDoc(doc(db, "users", uid), profile);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  await updateDoc(doc(db, "users", uid), data);
}

/* ===== Progress ===== */

export async function saveUserProgress(uid: string, progress: ProgressMap): Promise<void> {
  await setDoc(doc(db, "progress", uid), { activities: progress }, { merge: true });
}

export async function loadUserProgress(uid: string): Promise<ProgressMap> {
  const snap = await getDoc(doc(db, "progress", uid));
  if (!snap.exists()) return {};
  return (snap.data().activities as ProgressMap) || {};
}

/* ===== Custom Templates ===== */

export async function saveUserTemplates(uid: string, templates: Template[]): Promise<void> {
  await setDoc(doc(db, "templates", uid), { customTemplates: templates });
}

export async function loadUserTemplates(uid: string): Promise<Template[]> {
  const snap = await getDoc(doc(db, "templates", uid));
  if (!snap.exists()) return [];
  return (snap.data().customTemplates as Template[]) || [];
}

/* ===== Classroom Management ===== */

export async function createClass(teacherId: string, teacherName: string, className: string): Promise<ClassRoom> {
  const code = generateClassCode();
  const classRef = doc(collection(db, "classes"));
  const classroom: ClassRoom = {
    id: classRef.id,
    name: className,
    teacherId,
    teacherName,
    studentIds: [],
    code,
    createdAt: Date.now(),
  };
  await setDoc(classRef, classroom);

  // Add class to teacher's classIds
  await updateDoc(doc(db, "users", teacherId), {
    classIds: arrayUnion(classRef.id),
  });

  return classroom;
}

export async function joinClassByCode(studentId: string, code: string): Promise<ClassRoom | null> {
  const q = query(collection(db, "classes"), where("code", "==", code.toUpperCase()));
  const snap = await getDocs(q);
  if (snap.empty) return null;

  const classDoc = snap.docs[0];
  const classroom = classDoc.data() as ClassRoom;

  // Add student to class
  await updateDoc(doc(db, "classes", classroom.id), {
    studentIds: arrayUnion(studentId),
  });

  // Add class to student's classIds
  await updateDoc(doc(db, "users", studentId), {
    classIds: arrayUnion(classroom.id),
  });

  return { ...classroom, studentIds: [...classroom.studentIds, studentId] };
}

export async function getClassById(classId: string): Promise<ClassRoom | null> {
  const snap = await getDoc(doc(db, "classes", classId));
  return snap.exists() ? (snap.data() as ClassRoom) : null;
}

export async function getTeacherClasses(teacherId: string): Promise<ClassRoom[]> {
  const q = query(collection(db, "classes"), where("teacherId", "==", teacherId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as ClassRoom);
}

export async function getClassStudents(classId: string): Promise<UserProfile[]> {
  const classroom = await getClassById(classId);
  if (!classroom || !classroom.studentIds.length) return [];

  const students: UserProfile[] = [];
  for (const sid of classroom.studentIds) {
    const profile = await getUserProfile(sid);
    if (profile) students.push(profile);
  }
  return students;
}

export async function removeStudentFromClass(classId: string, studentId: string): Promise<void> {
  await updateDoc(doc(db, "classes", classId), {
    studentIds: arrayRemove(studentId),
  });
  await updateDoc(doc(db, "users", studentId), {
    classIds: arrayRemove(classId),
  });
}

/* ===== Parent-Student Linking ===== */

export async function findStudentByCode(code: string): Promise<UserProfile | null> {
  const q = query(
    collection(db, "users"),
    where("role", "==", "student"),
    where("studentCode", "==", code.toUpperCase())
  );
  const snap = await getDocs(q);
  return snap.empty ? null : (snap.docs[0].data() as UserProfile);
}

export async function linkParentToStudent(parentId: string, studentId: string): Promise<void> {
  await updateDoc(doc(db, "users", parentId), {
    parentOf: arrayUnion(studentId),
  });
}

export async function getChildrenProgress(parentId: string): Promise<{ profile: UserProfile; progress: ProgressMap }[]> {
  const parent = await getUserProfile(parentId);
  if (!parent || !parent.parentOf.length) return [];

  const results: { profile: UserProfile; progress: ProgressMap }[] = [];
  for (const childId of parent.parentOf) {
    const profile = await getUserProfile(childId);
    const progress = await loadUserProgress(childId);
    if (profile) results.push({ profile, progress });
  }
  return results;
}

/* ===== Utils ===== */

function generateClassCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
