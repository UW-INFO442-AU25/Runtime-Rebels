import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { auth, db } from "../firebase";
import { Mail, Menu, X } from "lucide-react";
import "../index.css";

export default function Header() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userRef = ref(db, `users/${currentUser.uid}`);
        onValue(userRef, (snapshot) => {
          setProfile(snapshot.val());
        });
      } else {
        setProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    navigate("/logout");
  };

  const handleProtectedNav = (e, path) => {
    if (!user) {
      e.preventDefault();
      navigate("/overview");
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <header className="navbar">
      {/* LOGO */}
      <div className="logo">
        <NavLink to="/">
          <img src="/img/N Logo.png" alt="Logo" />
        </NavLink>
      </div>

      {/* HAMBURGER */}
      <button className="hamburger-btn" onClick={() => setMenuOpen(true)}>
        <Menu size={30} />
      </button>

      {/* DESKTOP NAV */}
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

      {/* DESKTOP RIGHT SIDE */}
      <div className="desktop-actions">
        {!user ? (
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <button className="signup-btn">Login</button>
          </NavLink>
        ) : (
          <div className="user-actions">
            <NavLink
              to="/inbox"
              className={({ isActive }) => `icon-btn ${isActive ? "active-link" : ""}`}
            >
              <Mail />
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) => `user-avatar ${isActive ? "active-link" : ""}`}
            >
              {profile ? getInitials(profile.name) : "U"}
            </NavLink>

            <NavLink
              to="/logout"
              className={({ isActive }) => `signup-btn logout ${isActive ? "active-link" : ""}`}
            >
              Log Out
            </NavLink>
          </div>
        )}
      </div>

      {/* FULLSCREEN MOBILE MENU */}
      <div className={`mobile-menu-overlay ${menuOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setMenuOpen(false)}>
          <X size={34} />
        </button>

        <ul className="mobile-links">
          <li>
            <NavLink
              to="/"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/events"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Events
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/calendar"
              onClick={(e) => {
                handleProtectedNav(e, "/calendar");
                setMenuOpen(false);
              }}
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Calendar
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/discussion"
              onClick={(e) => {
                handleProtectedNav(e, "/discussion");
                setMenuOpen(false);
              }}
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Discussion
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/resources"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Resources
            </NavLink>
          </li>

          {!user ? (
            <li>
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Login
              </NavLink>
            </li>
          ) : (
            <>
              <li>
                <NavLink
                  to="/inbox"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  Inbox
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  Profile
                </NavLink>
              </li>

              <li>
                <button className="logout-btn-mobile" onClick={handleLogout}>
                  Log Out
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}
