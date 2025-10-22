import React from "react";
import { NavLink } from "react-router";
import "../index.css";

export default function Header() {
  return (
    <header className="navbar">
      <div className="logo">
        <img src="./img/Design from Canva.png" alt="Azure Haven Logo" />
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
