import React from "react";
import "../index.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        
        <h2 className="name">Azure Haven</h2>
        <p className="description">Accessible tools, guidance, and community resources to help you thrive.</p>

        <hr className="divider" />

        {/* Footer Links */}
        <div className="footer-links">
          <a href="/about" className="footer-link">About Us</a>
          <a href="/resources" className="footer-link">Resources</a>
          <a href="/contactus" className="footer-link">Contact Us</a>
        </div>

        <p className="legal">© 2025 Azure Haven • All Rights Reserved</p>
      </div>
    </footer>
  );
}
