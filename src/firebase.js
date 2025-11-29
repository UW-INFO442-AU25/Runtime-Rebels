import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBKGR4cAExstfn9CgkUDESOsHNXEOdqHtc",
  authDomain: "azure--haven.firebaseapp.com",
  databaseURL: "https://azure--haven-default-rtdb.firebaseio.com/",
  projectId: "azure--haven",
  storageBucket: "azure--haven.firebasestorage.app",
  messagingSenderId: "595483024183",
  appId: "1:595483024183:web:71035dda1825ba3cde58b2",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getDatabase(app);

export const db1 = getFirestore(app);