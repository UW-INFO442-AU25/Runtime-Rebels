import React from "react";
import "../index.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="newsletter">


                    <p className="tagline">
                        “Accessible tools, guidance, and community resources to help you
                        thrive.”
                    </p>
                    <hr className="divider" />

                    <div className="footer-links">
                        <div>
                            <a href="about" className="footer-link">About Us</a>
                        </div>
                        <div>
                            <a href="resources" className="footer-link">Resources</a>
                        </div>
                        <div>
                            <a href="contactus" className="footer-link">Contact Us</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
