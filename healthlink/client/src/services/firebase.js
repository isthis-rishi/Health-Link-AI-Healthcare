import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBnSGK26VJ0uDYDmfogID9kC7B0jS7m-xM",
  authDomain: "ai-healthcare-920bb.firebaseapp.com",
  projectId: "ai-healthcare-920bb",
  storageBucket: "ai-healthcare-920bb.firebasestorage.app",
  messagingSenderId: "363236902384",
  appId: "1:363236902384:web:46409504e8f6b101634935"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export default app;
