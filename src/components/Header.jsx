import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../main";
import "../index.css";

export default function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Track login status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/"); // take user home after logout
  };

  return (
    <header className="navbar">
      <div className="logo">
        <Link to="/">
          <img
            src="/img/N Logo.png"
            alt="Azure Haven Logo"
            style={{ width: "50px", height: "auto" }}
          />
        </Link>
      </div>

      <nav>
        <ul className="nav-links">
          {/* Always show Home */}
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Home
            </NavLink>
          </li>

          {/* Show these ONLY if logged in */}
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

          {/* Resources always available */}
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

      <div className="search-signup">
        <input type="text" placeholder="Search..." className="search-bar" />

        {!user ? (
          <Link to="/login">
            <button className="signup-btn">Login</button>
          </Link>
        ) : (
          <Link to="/logout">
            <button className="signup-btn">Log Out</button>
          </Link>

        )}
      </div>
    </header>
  );
}
