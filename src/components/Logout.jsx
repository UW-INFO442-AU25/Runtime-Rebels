import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "../index.css"; 

export default function Logout() {
  const navigate = useNavigate();

  const handleConfirmLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleCancelLogout = () => {
    navigate(-1);
  };

  return (
    <main
      className="logout-page"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-heading"
      aria-describedby="logout-description"
    >
      <h2 id="logout-heading">Are you sure you want to log out?</h2>
      <p id="logout-description">
        You will be signed out and returned to the home screen.
      </p>

      <div className="logout-buttons" role="group" aria-label="Logout confirmation options">
        <button
          className="logout-btn"
          onClick={handleConfirmLogout}
          aria-label="Confirm log out"
        >
          Log Out
        </button>

        <button
          className="cancel-btn"
          onClick={handleCancelLogout}
          aria-label="Cancel and go back"
        >
          Cancel
        </button>
      </div>
    </main>
  );
}
