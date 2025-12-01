import React, { useState, useEffect } from "react";
import { ref, onValue, update } from "firebase/database";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import "../index.css";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    let unsubDB = null;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = ref(db, `users/${user.uid}`);
        unsubDB = onValue(userRef, (snapshot) => {
          setUserData(snapshot.val());
        });
      } else {
        setUserData(null);
      }
    });

    return () => {
      unsubAuth();
      if (unsubDB) unsubDB();
    };
  }, []);

  if (!userData) return <p>Loading profile...</p>;

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // 1️⃣ Update Realtime Database
      await update(ref(db, `users/${auth.currentUser.uid}`), {
        ...userData,
        avatar: null,
      });

      // 2️⃣ Update Firebase Auth displayName
      if (auth.currentUser.displayName !== userData.name) {
        await updateProfile(auth.currentUser, {
          displayName: userData.name,
        });
      }

      setIsEditing(false);
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  const labelMap = {
    name: "Full Name",
    email: "Email",
    phoneNumber: "Phone Number",
    zipcode: "Zip Code",
    language: "Language",
    timeZone: "Time Zone",
  };

  return (
    <section className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <div className="avatar-wrapper">
            <div className="default-avatar">{getInitials(userData.name)}</div>
          </div>

          <div>
            <h2 className="profile-name">{userData.name}</h2>
            <p className="profile-email">{userData.email}</p>
          </div>
        </div>

        <button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className="edit-button"
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>

      <div className="profile-form">
        {Object.keys(labelMap).map((field) => (
          <div className="form-field" key={field}>
            <label>{labelMap[field]}</label>
            <input
              id={`profile-${field}`}
              name={field}
              type={field === "email" ? "email" : "text"}
              value={userData[field] || ""}
              onChange={handleChange}
              disabled={!isEditing || field === "email"}
              autoComplete={
                field === "name" ? "name" :
                field === "email" ? "email" :
                field === "phoneNumber" ? "tel" :
                field === "zipcode" ? "postal-code" :
                "off"
              }
            />
          </div>
        ))}
      </div>
    </section>
  );
}
