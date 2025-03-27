import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDsdcoqtfQvqRMO6V_ipzDPPXhlfHFBTLY",
  authDomain: "travelmate-b950c.firebaseapp.com",
  projectId: "travelmate-b950c",
  storageBucket: "travelmate-b950c.firebasestorage.app",
  messagingSenderId: "944824258669",
  appId: "1:944824258669:web:1c7ee59728fd39a4b62f64",
  measurementId: "G-TCJ6CKB4V9",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 데이터 추가
export const addDatas = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error adding data:", error);
    throw error;
  }
};

// 데이터 조회
export const getDatas = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting data:", error);
    throw error;
  }
};

// 데이터 삭제
export const deleteDatas = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return docId;
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
};

// 데이터 수정
export const updateDatas = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
    return { id: docId, ...data };
  } catch (error) {
    console.error("Error updating data:", error);
    throw error;
  }
};
