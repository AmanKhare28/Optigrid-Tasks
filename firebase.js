import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBqIXjJr3EoLrx_WpulXK_QmJm8tf7jqK4",
  authDomain: "optigrit-2c811.firebaseapp.com",
  projectId: "optigrit-2c811",
  storageBucket: "optigrit-2c811.firebasestorage.app",
  messagingSenderId: "499128872955",
  appId: "1:499128872955:web:e6705eda35ac68ddeb255e",
  measurementId: "G-Y121K4PSVY",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
