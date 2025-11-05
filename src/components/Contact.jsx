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
      const response = await fetch("/api/contact", {
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
        setStatus("Failed — try again.");
      }
    } catch {
      setStatus("Error sending message.");
    }
  };

  return (
    <div className="contact-main">
      <div className="contact-header">
        <h1>Contact Azure Haven</h1>
        <p>Have questions about your mental health, retirement, or our platform?</p>
      </div>

      <div className="contact-form-container">
        <div className="contact-card form-col">
          <h3>Send a Message</h3>

          <form onSubmit={handleSubmit}>
            <label>Subject</label>
            <input
              type="text"
              placeholder="Brief description"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />

            <label>Message</label>
            <textarea
              placeholder="How can we help you?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />

            <p className="privacy">
              <strong>Privacy Notice: </strong>Your personal information is protected.
            </p>

            <button type="submit">
              Send Message <FaPaperPlane />
            </button>
          </form>

          {status && <p className="status">{status}</p>}
        </div>
      </div>
    </div>
  );
}
