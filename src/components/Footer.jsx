import React from "react";
import "../index.css";

function Footer() {
  return (
    <footer className="footer" role="contentinfo" aria-label="Footer">
      <div className="footer-content">
        <div className="newsletter">
          <h2 className="name">Azure Haven</h2>

          <p className="tagline">
            “Accessible tools, guidance, and community resources to help you
            thrive.”
          </p>
          <hr className="divider" />

          <nav className="footer-links" aria-label="Footer navigation">
            <div>
              <a
                href="/about"
                className="footer-link"
                aria-label="Learn more about Azure Haven"
              >
                About Us
              </a>
            </div>
            <div>
              <a
                href="/resources"
                className="footer-link"
                aria-label="View available resources"
              >
                Resources
              </a>
            </div>
            <div>
              <a
                href="/contactus"
                className="footer-link"
                aria-label="Contact Azure Haven"
              >
                Contact Us
              </a>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
