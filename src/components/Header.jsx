import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { auth, db } from "../firebase";
import { Mail, Menu, X } from "lucide-react";
import "../index.css";

export default function Header() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Listen for auth state
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
  setMenuOpen(false); // Close mobile menu first
  navigate("/logout"); // Navigate to logout confirmation page
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
      <div className="logo" >
        <NavLink to="/" aria-label="Azure Haven Home">
          <img src="/img/N Logo.png" alt="Azure Haven Home Logo" />
        </NavLink>
      </div>

      {/* HAMBURGER */}
      <button 
        className="hamburger-btn" 
        onClick={() => setMenuOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={menuOpen}>
        <Menu size={30} aria-hidden="true" />
      </button>

      {/* DESKTOP NAV */}
      <nav aria-label="Main navigation">
        <ul className="nav-links">
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/events">Events</NavLink></li>
          <li>
            <NavLink to="/calendar" onClick={(e) => handleProtectedNav(e, "/calendar")}>
              Calendar
            </NavLink>
          </li>
          <li>
            <NavLink to="/discussion" onClick={(e) => handleProtectedNav(e, "/discussion")}>
              Discussion
            </NavLink>
          </li>
          <li><NavLink to="/resources">Resources</NavLink></li>
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
            <NavLink to="/inbox" className="icon-btn" aria-label="View inbox">
              <Mail aria-hidden="true" />
            </NavLink>

            <NavLink 
              to="/profile" 
              className="user-avatar"
              aria-label={`View profile for ${profile?.name || 'user'}`}
            >
              {profile ? getInitials(profile.name) : "U"}
            </NavLink>

            <NavLink to="/logout" className="signup-btn logout">
              Log Out
            </NavLink>
          </div>
        )}
      </div>

      {/* FULLSCREEN MOBILE MENU */}
      <div className={`mobile-menu-overlay ${menuOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      
      >
        <button className="close-btn" onClick={() => setMenuOpen(false)} aria-label="Close navigation menu">
          <X size={34} aria-hidden="true" />
        </button>
        <nav aria-label="Mobile navigation">
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
                <li><NavLink to="/inbox" onClick={() => setMenuOpen(false)}>Inbox</NavLink></li>
                <li><NavLink to="/profile" onClick={() => setMenuOpen(false)}>Profile</NavLink></li>
                <li><button className="logout-btn-mobile" onClick={handleLogout}>Log Out</button></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
