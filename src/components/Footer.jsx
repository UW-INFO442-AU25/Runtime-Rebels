import React from "react";
import "../index.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="newsletter">
                    <h2>
                        Stay in the loop!
                    </h2>
                    <p className="description">
                        Be the first to get updates on our latest content and new features.
                    </p>
                    <p className="legal">
                        By signing up, you’re agreeing to receive updates and
                        marketing emails from Azure Haven. You can unsubscribe at any time. For more information,
                        please contact us.
                    </p>

                    <form className="subscribe-form">
                        <input
                            type="email"
                            placeholder="Email address"
                            required
                            className="email-input"
                        />
                        <button type="submit" className="subscribe-btn">
                            Subscribe
                        </button>
                    </form>
                </div>

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

                <p className="tagline">
                    “Accessible tools, guidance, and community resources to help you
                    thrive.”
                </p>
            </div>
        </footer>
    );
}

export default Footer;
