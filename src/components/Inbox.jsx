import React, { useState } from "react";
import { Calendar } from "lucide-react";
import "../index.css";

export default function Inbox() {
  const [selected, setSelected] = useState(0);

  const messages = [
    { name: "Jane Doe", subject: "Upcoming Pickleball Event", preview: "Join us this Monday...", time: "10:00am" },
    { name: "John Doe", subject: "Upcoming Reading Event", preview: "Book club starts at 9...", time: "9:00am" },
    { name: "June Doe", subject: "Upcoming Pickleball Event", preview: "See you on the court!", time: "Yesterday" },
  ];

  const events = [
    { title: "Pickleball Event", date: "Monday, November 20th" },
    { title: "Chair Yoga", date: "Tuesday, November 21st" },
    { title: "Movie Night", date: "Friday, November 24th" },
  ];

  return (
    <div className="inbox-page">
      {/* === SIDEBAR === */}
      <aside className="inbox-sidebar">
        <div className="inbox-header">
          <h2>Inbox</h2>
          <button className="inbox-btn">New Mail</button>
        </div>

        <input className="inbox-search" type="text" placeholder="Search" />

        <ul className="inbox-list">
          {messages.map((msg, i) => (
            <li
              key={i}
              className={`inbox-item ${selected === i ? "active" : ""}`}
              onClick={() => setSelected(i)}
            >
              <div className="inbox-avatar">{msg.name[0]}</div>
              <div className="inbox-info">
                <div className="inbox-top">
                  <span className="inbox-sender">{msg.name}</span>
                  <span className="inbox-time">{msg.time}</span>
                </div>
                <p className="inbox-subject">{msg.subject}</p>
                <p className="inbox-preview">{msg.preview}</p>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* === MAIN PANEL === */}
      <main className="inbox-content">
        <div className="inbox-message">
          <h3>{messages[selected].subject}</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi.
            Sed blandit libero ut sodales euismod. Donec sed nisi non sapien interdum
            placerat. Phasellus vitae tincidunt nulla.
          </p>
        </div>

        <div className="inbox-upcoming">
          <div className="inbox-upcoming-header">
            <h3>Upcoming Events</h3>
            <a href="/calendar">View Calendar</a>
          </div>
          <ul>
            {events.map((event, i) => (
              <li key={i}>
                <div className="inbox-event-icon"><Calendar/></div>
                <div>
                  <p className="inbox-event-title">{event.title}</p>
                  <p className="inbox-event-date">{event.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
