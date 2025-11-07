import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../main";
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
    <main className="logout-page">
      <h2>Are you sure you want to log out?</h2>
      <div className="logout-buttons">
        <button className="logout-btn" onClick={handleConfirmLogout}>
          Log Out
        </button>
        <button className="cancel-btn" onClick={handleCancelLogout}>
          Cancel
        </button>
      </div>
    </main>
  );
}
