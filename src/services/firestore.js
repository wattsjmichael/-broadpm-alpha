import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase'

// Save tasks
export async function saveProjectData(projectId, data) {
  await setDoc(doc(db, "projects", projectId), data, { merge: true })
}

// Load tasks
export async function loadProjectData(projectId) {
  const snap = await getDoc(doc(db, "projects", projectId))
  return snap.exists() ? snap.data() : null
}

//Reset Button
export async function deleteProjectData(projectId) {
  await deleteDoc(doc(db, "projects", projectId))
}
