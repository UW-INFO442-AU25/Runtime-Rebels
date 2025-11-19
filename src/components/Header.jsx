import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../main";
import { Mail, Menu, X } from "lucide-react";
import "../index.css";

export default function Header() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Track user login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleProtectedNav = (e, path) => {
    if (!user) {
      e.preventDefault();
      navigate("/overview");
    }
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
            <NavLink to="/">Home</NavLink>
          </li>

          <li>
            <NavLink to="/events">Events</NavLink>
          </li>

          <li>
            <NavLink
              to="/calendar"
              onClick={(e) => handleProtectedNav(e, "/calendar")}
            >
              Calendar
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/discussion"
              onClick={(e) => handleProtectedNav(e, "/discussion")}
            >
              Discussion
            </NavLink>
          </li>

          <li>
            <NavLink to="/resources">Resources</NavLink>
          </li>
        </ul>
      </nav>

      {/* DESKTOP RIGHT SIDE */}
      <div className="desktop-actions">
        {!user ? (
          <NavLink to="/login">
            <button className="signup-btn">Login</button>
          </NavLink>
        ) : (
          <div className="user-actions">
            <NavLink to="/inbox" className="icon-btn">
              <Mail />
            </NavLink>

            <NavLink to="/profile" className="user-avatar">
              {user.email?.[0].toUpperCase()}
            </NavLink>

            <NavLink to="/logout" className="signup-btn logout">
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
          <li><NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink></li>
          <li><NavLink to="/events" onClick={() => setMenuOpen(false)}>Events</NavLink></li>

          <li>
            <NavLink
              to="/calendar"
              onClick={(e) => {
                handleProtectedNav(e, "/calendar");
                setMenuOpen(false);
              }}
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
            >
              Discussion
            </NavLink>
          </li>

          <li><NavLink to="/resources" onClick={() => setMenuOpen(false)}>Resources</NavLink></li>

          {!user ? (
            <li>
              <NavLink to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </NavLink>
            </li>
          ) : (
            <>
              <li>
                <NavLink to="/inbox" onClick={() => setMenuOpen(false)}>
                  Inbox
                </NavLink>
              </li>

              <li>
                <NavLink to="/profile" onClick={() => setMenuOpen(false)}>
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
