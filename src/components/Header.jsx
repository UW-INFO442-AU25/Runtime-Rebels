import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../main";
import "../index.css";

export default function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Track Firebase login status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/"); // Redirect after logout
  };

  return (
    <header className="navbar">
      {/* === LOGO === */}
      <div className="logo">
        <Link to="/">
          <img
            src="/img/N Logo.png"
            alt="Azure Haven Logo"
            style={{ width: "50px", height: "auto" }}
          />
        </Link>
      </div>

      {/* === NAVIGATION === */}
      <nav>
        <ul className="nav-links">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Home
            </NavLink>
          </li>

          {user && (
            <>
              <li>
                <NavLink
                  to="/events"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  Events
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/calendar"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  Calendar
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/discussion"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  Discussion
                </NavLink>
              </li>
            </>
          )}

          <li>
            <NavLink
              to="/resources"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Resources
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* === RIGHT SIDE (Search, Inbox, Profile, Logout) === */}
      <div className="search-signup">
        <input type="text" placeholder="Search..." className="search-bar" />

        {!user ? (
          <Link to="/login">
            <button className="signup-btn">Login</button>
          </Link>
        ) : (
          <div className="user-actions">
            {/* Inbox Icon */}
            <Link to="/inbox" className="icon-btn" title="Inbox">
              📩
            </Link>

            {/* Profile Avatar (clickable) */}
            <Link to="/profile" className="user-avatar" title="Profile">
              {user.email?.[0].toUpperCase()}
            </Link>

            {/* Logout */}
            <button className="signup-btn logout" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
