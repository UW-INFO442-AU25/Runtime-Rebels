import React, { useState, useEffect, useRef } from "react";
import { ref, onValue, update } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../main";
import { FaPencilAlt } from "react-icons/fa";
import "../index.css";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

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

  // Handle field changes instantly
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Convert selected file to Base64
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Handle file selection (preview immediately)
  const handleFileSelect = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Preview immediately
  const previewUrl = URL.createObjectURL(file);
  setUserData((prev) => ({ ...prev, avatar: previewUrl }));
  setSelectedFile(file);

  try {
    setUploading(true);

    // Convert to Base64 and save immediately
    const base64Data = await fileToBase64(file);
    const userRef = ref(db, `users/${auth.currentUser.uid}`);
    await update(userRef, { avatar: base64Data });

    // Update local state to the Base64 data so it's persistent
    setUserData((prev) => ({ ...prev, avatar: base64Data }));
    setSelectedFile(null);
  } catch (error) {
    console.error("Error saving profile picture:", error);
  } finally {
    setUploading(false);
  }
};

  // Save profile (fields + avatar) to Realtime Database
  const handleSave = async () => {
    try {
      setUploading(true);

      let avatarData = userData.avatar;

      if (selectedFile) {
        avatarData = await fileToBase64(selectedFile);
      }

      const userRef = ref(db, `users/${auth.currentUser.uid}`);
      await update(userRef, { ...userData, avatar: avatarData });

      setUserData((prev) => ({ ...prev, avatar: avatarData }));
      setSelectedFile(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-info">
          <div className="avatar-wrapper">
            <img
              src={selectedFile ? URL.createObjectURL(selectedFile) : userData.avatar || "../img/peopleonboat.png"}
              alt="Profile"
              className="profile-avatar"
            />
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
            <div className="edit-avatar-icon" onClick={() => fileInputRef.current.click()}>
              <FaPencilAlt />
            </div>
          </div>
          <div>
            <h2 className="profile-name">{userData.name}</h2>
            <p className="profile-email">{userData.email}</p>
          </div>
        </div>
        <button onClick={isEditing ? handleSave : () => setIsEditing(true)} className="edit-button">
          {isEditing ? (uploading ? "Saving..." : "Save") : "Edit"}
        </button>
      </div>

      {/* Form */}
      <div className="profile-form">
        {["name", "email", "phoneNumber", "zipcode", "language", "timeZone"].map((field) => (
          <div className="form-field" key={field}>
            <label>{field === "name" ? "Full Name" : field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              name={field}
              value={userData[field] || ""}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
