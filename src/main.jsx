import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.jsx";
import "leaflet/dist/leaflet.css";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKGR4cAExstfn9CgkUDESOsHNXEOdqHtc",
  authDomain: "azure--haven.firebaseapp.com",
  projectId: "azure--haven",
  storageBucket: "azure--haven.firebasestorage.app",
  messagingSenderId: "595483024183",
  appId: "1:595483024183:web:71035dda1825ba3cde58b2"
};

// Initialize Firebase
initializeApp(firebaseConfig);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);