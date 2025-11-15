import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from "../main";
import { FaPencilAlt } from "react-icons/fa";
import "../index.css";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = ref(db, `users/${user.uid}`);
        onValue(userRef, (snapshot) => {
          setUserData(snapshot.val());
        });
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!userData) return <p>Loading profile...</p>;

  // Handle changes instantly
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...userData, [name]: value };
    setUserData(updatedData);

    const userRef = ref(db, `users/${auth.currentUser.uid}`);
    update(userRef, { [name]: value }).catch((error) =>
      console.error("Error updating profile:", error)
    );
  };

  return (
    <section className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-info">
          <div className="avatar-wrapper">
            <img
              src={userData.avatar || "../img/peopleonboat.png"}
              alt="Profile"
              className="profile-avatar"
            />
            <div className="edit-avatar-icon">
              <FaPencilAlt />
            </div>
          </div>
          <div>
            <h2 className="profile-name">{userData.name}</h2>
            <p className="profile-email">{userData.email}</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="edit-button"
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>

      {/* Form */}
      <div className="profile-form">
        <div className="form-field">
          <label>Full Name</label>
          <input
            name="name"
            value={userData.name || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div className="form-field">
          <label>Email</label>
          <input
            name="email"
            value={userData.email || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div className="form-field">
          <label>Phone Number</label>
          <input
            name="phoneNumber"
            value={userData.phoneNumber || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div className="form-field">
          <label>Country</label>
          <input
            name="country"
            value={userData.country || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div className="form-field">
          <label>Language</label>
          <input
            name="language"
            value={userData.language || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div className="form-field">
          <label>Time Zone</label>
          <input
            name="timeZone"
            value={userData.timeZone || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
      </div>
    </section>
  );
}