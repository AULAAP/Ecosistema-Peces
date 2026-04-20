
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Connection test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client is offline.");
    }
  }
}
testConnection();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error("Error signing in with Google", error);
    
    if (error.code === 'auth/popup-blocked') {
      alert("El navegador bloqueó la ventana emergente. Por favor, permite las ventanas emergentes para este sitio o intenta abrir la aplicación en una pestaña nueva.");
    } else if (error.code === 'auth/cancelled-popup-request') {
      // Often happens if the user clicks login twice quickly
      console.warn("Se canceló la solicitud de ventana emergente previa.");
    } else {
      alert("Error al iniciar sesión: " + (error.message || "Error desconocido"));
    }
    
    throw error;
  }
};

export const logout = () => auth.signOut();

export { onAuthStateChanged };
export type { User };
