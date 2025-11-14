import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import "leaflet/dist/leaflet.css";
import { getDatabase } from "firebase/database";

// Firebase configuration
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBKGR4cAExstfn9CgkUDESOsHNXEOdqHtc",
  authDomain: "azure--haven.firebaseapp.com",
  projectId: "azure--haven",
  storageBucket: "azure--haven.firebasestorage.app",
  messagingSenderId: "595483024183",
  appId: "1:595483024183:web:71035dda1825ba3cde58b2",
};

//Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };


const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
