import React, { useEffect, useState } from "react";
import "../index.css";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { buildIcs, downloadIcsFile } from "../util/ics";
import { getSavedEvents, saveEvent, removeEvent } from "../util/savedEvents";
import { useToast } from "./Toast";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const events = [
  {
    id: 1,
    title: "Pickleball",
    time: "5:30 PM",
    city: "Seattle, WA",
    img: "/img/Pickleball_Pros 1.png",
    coords: [47.6062, -122.3321],
    startsAt: "2025-10-20T17:30:00-07:00",
    endsAt: "2025-10-20T19:00:00-07:00",
  },
  {
    id: 2,
    title: "Reading",
    time: "7:30 PM",
    city: "Bellevue, WA",
    img: "/img/reading-before-bed-3x2 4.png",
    coords: [47.6101, -122.2015],
    startsAt: "2025-10-20T19:30:00-07:00",
    endsAt: "2025-10-20T21:00:00-07:00",
  },
];

function BellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm6-6V11a6 6 0 0 0-12 0v5l-2 2v1h16v-1l-2-2Z"
        fill="#ffffff"
        opacity=".92"
      />
    </svg>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12.1 21.35 10 19.45C5.4 15.36 2 12.28 2 8.5A4.5 4.5 0 0 1 6.5 4 5 5 0 0 1 12 6.09 5 5 0 0 1 17.5 4 4.5 4.5 0 0 1 22 8.5c0 3.78-3.4 6.86-8 10.95l-1.9 1.9Z"
        fill={filled ? "#ffffff" : "none"}
        stroke="#ffffff"
        strokeWidth="2"
      />
    </svg>
  );
}

function formatEventDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString([], { weekday: "short", month: "short", day: "numeric" });
}

function formatEventTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString([], { hour: "numeric", minute: "2-digit" });
}

function formatDateTimeLine(iso) {
  return `${formatEventDate(iso)} • ${formatEventTime(iso)}`;
}

function EventCard({ e, saved, onToggleSave }) {
  const dateLine = formatDateTimeLine(e.startsAt);

  return (
    <article className="event-card">
      <div className="event-card__media">
        <img src={e.img} alt={e.title} />
      </div>

      <div className="event-card__body">
        <div className="event-card__time">{dateLine}</div>
        <div className="event-card__content">
          <h3 className="event-card__title">{e.title}</h3>
          <p className="event-card__city">{e.city}</p>
        </div>
        <div className="event-card__actions">
          <button className="icon-btn" aria-label="Notify me"><BellIcon /></button>
          <button
            className="icon-btn"
            aria-label={saved ? "Remove from calendar" : "Save to calendar"}
            onClick={() => onToggleSave(e)}
          >
            <HeartIcon filled={saved} />
          </button>
        </div>
      </div>
    </article>
  );
}

function MapPanel({ items }) {
  const center = [47.6088, -122.27];
  return (
    <aside className="events-map">
      <MapContainer center={center} zoom={11} scrollWheelZoom={false} style={{ height: 420, width: "100%" }}>
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {items.map((e) => (
          <Marker key={e.id} position={e.coords}>
            <Popup>
              <strong>{e.title}</strong><br />
              {formatEventDate(e.startsAt)} • {formatEventTime(e.startsAt)}<br />
              {e.city}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </aside>
  );
}

export default function Events() {
  const { show } = useToast();
  const [savedIds, setSavedIds] = useState(() => new Set(getSavedEvents().map(e => String(e.id))));
  const [query, setQuery] = useState("");
  const [filterCity, setFilterCity] = useState("all");

  // Live filter logic
  const filteredEvents = events.filter((e) => {
    const matchesQuery = e.title.toLowerCase().includes(query.toLowerCase()) || e.city.toLowerCase().includes(query.toLowerCase());
    const matchesCity = filterCity === "all" || e.city.includes(filterCity);
    return matchesQuery && matchesCity;
  });

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key && e.key.startsWith("azurehaven:savedEvents")) {
        setSavedIds(new Set(getSavedEvents().map(ev => String(ev.id))));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function toggleSave(e) {
    const key = String(e.id);
    if (savedIds.has(key)) {
      removeEvent(e.id);
      setSavedIds((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
      show({ title: "Removed from your calendar", description: e.title });
      return;
    }

    saveEvent(e);
    setSavedIds((prev) => new Set(prev).add(key));

    const blob = buildIcs(e);
    downloadIcsFile(blob, e.title);

    show({
      title: "RSVP saved",
      description: `${e.title} • ${formatEventDate(e.startsAt)} ${formatEventTime(e.startsAt)}`
    });
  }

  return (
    <div className="events-page">
      <div className="events-wrap">
        <div className="events-header">
          <h1 className="events-title">Events</h1>

          <div className="events-controls">
            <input
              type="text"
              placeholder="Search events..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="events-search"
            />
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="events-filter"
            >
              <option value="all">All Cities</option>
              <option value="Seattle, WA">Seattle</option>
              <option value="Bellevue, WA">Bellevue</option>
            </select>
          </div>
        </div>

        <section className="events-grid">
          <div className="events-list">
            {filteredEvents.map((e) => (
              <EventCard
                key={e.id}
                e={e}
                saved={savedIds.has(String(e.id))}
                onToggleSave={toggleSave}
              />
            ))}
            {filteredEvents.length === 0 && (
              <p className="no-events">No events match your search.</p>
            )}
          </div>

          <aside>
            <MapPanel items={filteredEvents} />
          </aside>
        </section>
      </div>
    </div>
  );
}
