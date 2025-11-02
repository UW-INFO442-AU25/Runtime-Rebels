import React from "react";
import { NavLink, Link } from "react-router-dom";
import "../index.css";

export default function Header() {
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
        <button className="signup-btn">Sign Up</button>
      </div>
    </header>
  );
}
