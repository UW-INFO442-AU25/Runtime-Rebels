import React, { useEffect, useMemo, useState } from "react";
import "../index.css";

import { auth, db1 } from "../firebase";
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
        (a, b) =>
          new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
      )
    );

    return map;
  }, [savedEvents, currentDate]);

  const currentEvents = eventsByDay[selectedDate] || [];

  const handleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div
      className="calendar-container"
      role="main"
      aria-labelledby="calendar-heading"
    >
      <div
        className="calendar-card"
        role="region"
        aria-label="Monthly calendar with event list"
      >
        {/* Header */}
        <div className="calendar-header">
          <h1 id="calendar-heading">Calendar</h1>
          <svg
            className="calendar-icon"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
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

        {/* Events for selected day */}
        <div
          className="events-section"
          aria-labelledby="events-heading"
          aria-live="polite"
        >
          <h2
            className="events-title"
            id="events-heading"
          >
            Events for {monthNames[currentDate.getMonth()]} {selectedDate},{" "}
            {currentDate.getFullYear()}
          </h2>

          {currentEvents.length > 0 ? (
            <div
              className="events-list"
              role="list"
              aria-label="Events scheduled for the selected day"
            >
              {currentEvents.map((event) => (
                <article
                  key={event.id}
                  className={`calendar-event-card ${
                    event.isPast ? "past-event" : ""
                  } ${expandedId === event.id ? "expanded" : ""}`}
                  onClick={() => handleExpand(event.id)}
                  role="button"
                  aria-expanded={expandedId === event.id}
                  aria-label={`Event ${event.title} at ${event.time}${
                    event.location ? " in " + event.location : ""
                  }${event.isPast ? ", this event is in the past" : ""}`}
                >
                  <div className="calendar-event-card__body">
                    {/* Image */}
                    <div className="calendar-event-card__media">
                      {event.image ? (
                        <img src={event.image} alt={event.title} />
                      ) : (
                        <div
                          className="image-fallback"
                          aria-hidden="true"
                        />
                      )}
                    </div>

                    {/* Title + Location */}
                    <div className="calendar-event-card__content">
                      <h3 className="calendar-event-card__title">
                        {event.title}
                      </h3>
                      <p className="calendar-event-card__city">
                        {event.location}
                      </p>
                    </div>

                    {/* Time */}
                    <div className="calendar-event-card__right-column">
                      <div className="calendar-event-card__time">
                        {event.time}
                      </div>
                    </div>
                  </div>

                  {/* Accordion Drawer */}
                  {expandedId === event.id && event.address && (
                    <div className="calendar-event-card__details">
                      <div className="calendar-event-card__row">
                        <div className="calendar-event-card__address">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="location-icon"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            width={16}
                            height={16}
                            style={{ marginRight: "0.25rem" }}
                            aria-hidden="true"
                            focusable="false"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 22s8-7.333 8-12c0-4.418-3.582-8-8-8s-8 3.582-8 8c0 4.667 8 12 8 12z"
                            />
                          </svg>
                          {event.address}
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
            <p
              className="no-events"
              role="status"
              aria-live="polite"
            >
              {uid
                ? "No events scheduled for this day."
                : "Log in to see your saved events here."}
            </p>
          )}
        </div>

        {/* Month navigation */}
        <div
          className="calendar-navigation"
          aria-label="Change displayed month"
        >
          <button
            onClick={previousMonth}
            className="nav-btn"
            aria-label="Previous month"
          >
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <h2
            className="calendar-month"
            aria-live="polite"
          >
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>

          <button
            onClick={nextMonth}
            className="nav-btn"
            aria-label="Next month"
          >
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
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
        <div
          className="calendar-grid"
          aria-label="Calendar date picker"
        >
          {weekDays.map((d, i) => (
            <div
              key={`weekday-${i}`}
              className="weekday-header"
              aria-hidden="true"
            >
              {d}
            </div>
          ))}

          {calendarDays.map((dayObj, index) => {
            const isCurrent = dayObj.isCurrentMonth;
            const isSelected = isCurrent && dayObj.day === selectedDate;
            const eventCount =
              isCurrent && eventsByDay[dayObj.day]
                ? eventsByDay[dayObj.day].length
                : 0;
            const hasEvents = eventCount > 0;

            let ariaLabel = `${monthNames[currentDate.getMonth()]} ${dayObj.day}, ${currentDate.getFullYear()}`;
            if (hasEvents) {
              ariaLabel += `, ${eventCount} event${
                eventCount > 1 ? "s" : ""
              }`;
            }
            if (isSelected) {
              ariaLabel += ", selected";
            }

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
                aria-label={ariaLabel}
                aria-pressed={isSelected}
                aria-current={isSelected ? "date" : undefined}
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
