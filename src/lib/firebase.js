import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, onSnapshot, updateDoc } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBz9uCfqnOtjsqm2QQVTKFPfFa4w4ou2nQ",
  authDomain: "tujuradodelfalla.firebaseapp.com",
  projectId: "tujuradodelfalla",
  storageBucket: "tujuradodelfalla.firebasestorage.app",
  messagingSenderId: "602644542556",
  appId: "1:602644542556:web:6db6e152fde80d56482299",
  measurementId: "G-KVLVFFHGMJ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ============================================
// HELPERS DE FIRESTORE
// ============================================

/**
 * Obtener un documento de Firestore
 */
export async function fsGet(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
}

/**
 * Guardar/crear un documento en Firestore
 */
export async function fsSet(collectionName, docId, data) {
  try {
    await setDoc(doc(db, collectionName, docId), data);
    return true;
  } catch (error) {
    console.error("Error setting document:", error);
    return false;
  }
}

/**
 * Actualizar campos específicos de un documento
 */
export async function fsUpdate(collectionName, docId, data) {
  try {
    await updateDoc(doc(db, collectionName, docId), data);
    return true;
  } catch (error) {
    console.error("Error updating document:", error);
    return false;
  }
}

/**
 * Suscribirse a cambios en tiempo real de un documento
 * @returns función para cancelar la suscripción
 */
export function fsSubscribe(collectionName, docId, callback) {
  try {
    const docRef = doc(db, collectionName, docId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      callback(docSnap.exists() ? docSnap.data() : null);
    }, (error) => {
      console.error("Error in subscription:", error);
      callback(null);
    });
    return unsubscribe;
  } catch (error) {
    console.error("Error subscribing to document:", error);
    return () => {};
  }
}

// ============================================
// HELPERS DE LOCALSTORAGE
// ============================================

/**
 * Obtener valor de localStorage
 */
export function localGet(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

/**
 * Guardar valor en localStorage
 */
export function localSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Eliminar valor de localStorage
 */
export function localRemove(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
