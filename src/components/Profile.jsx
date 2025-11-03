import React, { useState, useEffect } from 'react';
/*import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';*/
import { FaPencilAlt } from "react-icons/fa";
import "../index.css";

export default function Profile() {
const [isEditing, setIsEditing] = useState(false);


  const profileinfo = [
    {
      firstName: "Alexis",
      lastName: "Mars",
      email: "alexismars@gmail.com",
      phoneNumber: "206-738-9123",
      zipcode: "98405",
    }
  ];

    return (
  <section className="profile-container">
    {/* Header */}
    <div className="profile-header">
      <div className="profile-info">
        <div className="avatar-wrapper">
          <img
            src="../img/peopleonboat.png"
            alt="Profile"
            className="profile-avatar"
          />
          <div className="edit-avatar-icon">
            <FaPencilAlt />
          </div>
        </div>

        <div>
          <h2 className="profile-name">Alexa Rawles</h2>
          {<p className="profile-email">alexarawles@gmail.com</p>}
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
        <input type="text" placeholder="Full Name" defaultValue="Alexa Rawles" disabled={!isEditing} />
      </div>
      <div className="form-field">
        <label>Email</label>
        <input type="text" placeholder="Email" defaultValue="Alexa@gmail.com" disabled={!isEditing} />
      </div>
      <div className="form-field">
        <label>Phone Number</label>
        <input type="text" placeholder="Phone Number" disabled={!isEditing} />
      </div>
      <div className="form-field">
        <label>Country</label>
        <input type="text" placeholder="Country" disabled={!isEditing} />
      </div>
      <div className="form-field">
        <label>Language</label>
        <input type="text" placeholder="Language" disabled={!isEditing} />
      </div>
      <div className="form-field">
        <label>Time Zone</label>
        <input type="text" placeholder="Time Zone" disabled={!isEditing} />
      </div>
    </div>
  </section>
)};