import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

export default function ContactUs() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const response = await fetch("https://formspree.io/f/xkgkwwjo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, message }),
      });

      if (response.ok) {
        setStatus("Message delivered!");
        setSubject("");
        setMessage("");
      } else {
        setStatus("Message did not send — try again.");
      }
    } catch {
      setStatus("Error sending message.");
    }
  };

  return (
    <main className="contact-main">
      <header className="contact-header" aria-labelledby="contact-title">
        <h1 id="contact-title">Contact Azure Haven</h1>
        <p>Have questions about your mental health, retirement, or our platform?</p>
      </header>

      <section className="contact-form-container" aria-labelledby="form-title">
        <div className="contact-card form-col">
          <h2 id="form-title">Send a Message</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                type="text"
                placeholder="Brief description"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                placeholder="How can we help you?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <p className="privacy">
              <strong>Privacy Notice: </strong>
              Your personal information is protected.
            </p>

            <button type="submit">
              Send Message <FaPaperPlane aria-hidden="true" />
            </button>

            {/* Status messages announced by screen readers */}
            {status && (
              <p className="status" role="status" aria-live="polite">
                {status}
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
