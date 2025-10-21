import React from "react";
import "../index.css";

export default function Header() {
  return (
    <header className="navbar">
      <div className="logo">Azure Haven</div>
      <nav>
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">Events</a></li>
          <li><a href="#">Calendar</a></li>
          <li><a href="#">Discussion</a></li>
          <li><a href="#">Resources</a></li>
        </ul>
      </nav>
      <div className="search-signup">
        <input type="text" placeholder="Search..." className="search-bar" />
        <button className="signup-btn">Sign Up</button>
      </div>
    </header>
  );
}
