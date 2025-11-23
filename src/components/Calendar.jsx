import React, { useEffect, useMemo, useState } from "react";
import "../index.css";

import { auth, db1 } from "../main.jsx";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";

export default function Calendar() {
  const now = new Date();
  const [currentDate, setCurrentDate] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(now.getDate());
  const [expandedId, setExpandedId] = useState(null);

  const [uid, setUid] = useState(null);
  const [savedEvents, setSavedEvents] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user ? user.uid : null);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!uid) {
      setSavedEvents([]);
      return;
    }

    const colRef = collection(db1, "users", uid, "savedEvents");
    const unsub = onSnapshot(colRef, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setSavedEvents(list);
    });

    return () => unsub();
  }, [uid]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const previousMonth = () => {
    const prev = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    setCurrentDate(prev);
    setSelectedDate(1);
  };

  const nextMonth = () => {
    const next = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    setCurrentDate(next);
    setSelectedDate(1);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const daysInPrevMonth = getDaysInMonth(
    new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
  );

  const generateCalendarDays = () => {
    const days = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        isNextMonth: false,
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true, isNextMonth: false });
    }

    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, isCurrentMonth: false, isNextMonth: true });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  const eventsByDay = useMemo(() => {
    const map = {};
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    for (const ev of savedEvents) {
      if (!ev.startsAt) continue;
      const d = new Date(ev.startsAt);
      if (d.getFullYear() !== year || d.getMonth() !== month) continue;

      const day = d.getDate();
      const time = d.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
      const isPast = d.getTime() < Date.now();

      const entry = {
        id: ev.id,
        title: ev.title,
        location: ev.city || ev.location || "",
        image: ev.img || ev.image,
        address: ev.address || "",
        description: ev.description || "",
        time,
        isPast,
        startsAt: ev.startsAt,
      };

      if (!map[day]) map[day] = [];
      map[day].push(entry);
    }

    Object.values(map).forEach((list) =>
      list.sort(
        (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
      )
    );

    return map;
  }, [savedEvents, currentDate]);

  const currentEvents = eventsByDay[selectedDate] || [];

  const handleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-card">
        {/* Header */}
        <div className="calendar-header">
          <h1>Calendar</h1>
          <svg className="calendar-icon" fill="currentColor" viewBox="0 0 24 24">
            <rect
              x="3"
              y="4"
              width="18"
              height="18"
              rx="2"
              ry="2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="16"
              y1="2"
              x2="16"
              y2="6"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="8"
              y1="2"
              x2="8"
              y2="6"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="3"
              y1="10"
              x2="21"
              y2="10"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Events for selected day - MOVED TO TOP */}
        <div className="events-section">
          <h2 className="events-title">
            Events for {monthNames[currentDate.getMonth()]} {selectedDate},{" "}
            {currentDate.getFullYear()}
          </h2>

          {currentEvents.length > 0 ? (
            <div className="events-list">
              {currentEvents.map((event) => (
                <article
                  key={event.id}
                  className={`calendar-event-card ${
                    event.isPast ? "past-event" : ""
                  } ${expandedId === event.id ? "expanded" : ""}`}
                  onClick={() => handleExpand(event.id)}
                >
                  <div className="calendar-event-card__body">
                    {/* Image - Left */}
                    <div className="calendar-event-card__media">
                      {event.image ? (
                        <img src={event.image} alt={event.title} />
                      ) : (
                        <div className="image-fallback" />
                      )}
                    </div>

                    {/* Title + Location - Center */}
                    <div className="calendar-event-card__content">
                      <h3 className="calendar-event-card__title">{event.title}</h3>
                      <p className="calendar-event-card__city">{event.location}</p>
                    </div>

                    {/* Time - Top Right */}
                    <div className="calendar-event-card__right-column">
                      <div className="calendar-event-card__time">{event.time}</div>
                    </div>
                  </div>

                  {/* Accordion Drawer */}
                  {expandedId === event.id && event.address && (
                    <div className="calendar-event-card__details">
                      <div className="calendar-event-card__row">
                        <div className="calendar-event-card__address">
                          📍 {event.address}
                        </div>

                        {event.description && (
                          <div className="calendar-event-card__description">
                            {event.description}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p className="no-events">
              {uid
                ? "No events scheduled for this day."
                : "Log in to see your saved events here."}
            </p>
          )}
        </div>

        {/* Month navigation */}
        <div className="calendar-navigation">
          <button
            onClick={previousMonth}
            className="nav-btn"
            aria-label="Previous month"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <h2 className="calendar-month">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>

          <button
            onClick={nextMonth}
            className="nav-btn"
            aria-label="Next month"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Calendar grid */}
        <div className="calendar-grid">
          {weekDays.map((d, i) => (
            <div key={`weekday-${i}`} className="weekday-header">
              {d}
            </div>
          ))}

          {calendarDays.map((dayObj, index) => {
            const isCurrent = dayObj.isCurrentMonth;
            const isSelected = isCurrent && dayObj.day === selectedDate;
            const hasEvents =
              isCurrent && (eventsByDay[dayObj.day]?.length || 0) > 0;

            return (
              <button
                key={`day-${index}`}
                onClick={() => isCurrent && setSelectedDate(dayObj.day)}
                disabled={!isCurrent}
                className={[
                  "calendar-day",
                  !isCurrent ? "other-month" : "",
                  isSelected ? "selected" : "",
                  hasEvents ? "has-events" : "",
                ]
                  .join(" ")
                  .trim()}
                aria-label={
                  hasEvents
                    ? `${dayObj.day}, has ${
                        eventsByDay[dayObj.day].length
                      } event${
                        eventsByDay[dayObj.day].length > 1 ? "s" : ""
                      }`
                    : String(dayObj.day)
                }
              >
                {dayObj.day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}