import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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

  // Protect certain routes
  const handleProtectedNav = (e, path) => {
    if (!user) {
      e.preventDefault();
      navigate("/overview");
    }
  };

  return (
    <header className="navbar">
      {/* === LOGO === */}
      <div className="logo">
        <NavLink to="/">
          <img
            src="/img/N Logo.png"
            alt="Azure Haven Logo"
            style={{ width: "50px", height: "auto" }}
          />
        </NavLink>
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

          <li>
            <NavLink
              to="/events"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Events
            </NavLink>
          </li>

          {/* Protected routes */}
          <li>
            <NavLink
              to="/calendar"
              onClick={(e) => handleProtectedNav(e, "/calendar")}
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Calendar
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/discussion"
              onClick={(e) => handleProtectedNav(e, "/discussion")}
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Discussion
            </NavLink>
          </li>

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

      {/* === RIGHT SIDE === */}
      <div className="search-signup">
        {!user ? (
          <NavLink to="/login">
            <button className="signup-btn">Login</button>
          </NavLink>
        ) : (
          <div className="user-actions">
            <NavLink to="/inbox" className="icon-btn" title="Inbox">
              📩
            </NavLink>

            <NavLink to="/profile" className="user-avatar" title="Profile">
              {user.email?.[0].toUpperCase()}
            </NavLink>

            <NavLink to="/logout" className="signup-btn logout">
            Log Out
            </NavLink>

          </div>
        )}
      </div>
    </header>
  );
}
