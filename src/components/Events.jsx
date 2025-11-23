import React, { useEffect, useState, useMemo } from "react";
import "../index.css";

import { buildIcs, downloadIcsFile } from "../util/ics";
import { useToast } from "./Toast";

import { auth, db1 } from "../main.jsx";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";

import EventCard from "./EventCard";
import MapPanel from "./MapPanel";

const events = [
  {
    id: 1,
    title: "Pickleball",
    location: "Seattle, WA",
    address: "North Seattle Pickleball Courts, 310 NE 103rd St",
    description: "Beginner and intermediate casual matches. Paddles provided.",
    image: "/img/Pickleball_Pros 1.png",
    coords: [47.61058, -122.33191],
    startsAt: "2025-10-20T17:30:00-07:00",
    endsAt: "2025-10-20T19:00:00-07:00",
  },
  {
    id: 2,
    title: "Reading",
    location: "Bellevue, WA",
    address: "Bellevue Library, 345 110th Ave NE",
    description: "Quiet evening reading session. Bring your favorite book.",
    image: "/img/reading-before-bed-3x2 4.png",
    coords: [47.6102, -122.2014],
    startsAt: "2025-10-20T19:30:00-07:00",
    endsAt: "2025-10-20T21:00:00-07:00",
  },
  {
    id: 3,
    title: "Coffee Chats",
    location: "Kirkland, WA",
    address: "Kirkland Community Center, 340 Kirkland Ave",
    description: "Join fellow retirees for a relaxed morning of coffee and meaningful conversation. Share stories, make new friends, and enjoy good company in a welcoming atmosphere.",
    image: "/img/coffee.jpg",
    coords: [47.6815, -122.2087],
    startsAt: "2025-10-21T09:00:00-07:00",
    endsAt: "2025-10-21T11:00:00-07:00",
  },
  {
    id: 4,
    title: "Walking Group",
    location: "Seattle, WA",
    address: "Seward Park, 5900 Lake Washington Blvd S",
    description: "Gentle 2-mile walking group around the beautiful Seward Park trail. Perfect pace for all fitness levels. Enjoy nature, fresh air, and friendly conversation with peers.",
    image: "/img/sewardpark.jpg",
    coords: [47.5506, -122.2575],
    startsAt: "2025-10-22T10:30:00-07:00",
    endsAt: "2025-10-22T12:00:00-07:00",
  }
];

export default function Events() {
  const { show } = useToast();

  // auth
  const [uid, setUid] = useState(null);

  // saved state
  const [savedIds, setSavedIds] = useState(new Set());

  // expanded card
  const [expandedId, setExpandedId] = useState(null);

  // map focus coords
  const [focusedCoords, setFocusedCoords] = useState(null);

  // search and filters
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");

  // on mount
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user ? user.uid : null);
    });
    return () => unsub();
  }, []);

  // listener for saved events
  useEffect(() => {
    if (!uid) {
      setSavedIds(new Set());
      return;
    }

    const colRef = collection(db1, "users", uid, "savedEvents");
    const unsub = onSnapshot(colRef, (snap) => {
      const ids = new Set();
      snap.forEach((docSnap) => ids.add(String(docSnap.id)));
      setSavedIds(ids);
    });
    return () => unsub();
  }, [uid]);

  // save and unsave
  async function toggleSave(e) {
    if (!uid) {
      show({
        title: "Sign in required",
        description: "Please log in to save events to your calendar.",
      });
      return;
    }

    const key = String(e.id);
    const isSaved = savedIds.has(key);
    const docRef = doc(db1, "users", uid, "savedEvents", key);

    try {
      if (isSaved) {
        await deleteDoc(docRef);
        show({
          title: "Removed from your calendar",
          description: e.title,
        });
      } else {
        await setDoc(docRef, {
          title: e.title,
          location: e.location,
          image: e.image,
          address: e.address,
          description: e.description,
          coords: e.coords,
          startsAt: e.startsAt,
          endsAt: e.endsAt,
          createdAt: Date.now(),
        });

        const blob = buildIcs({
          title: e.title,
          location: e.location,
          startsAt: e.startsAt,
          endsAt: e.endsAt,
        });
        downloadIcsFile(blob, e.title);

        show({
          title: "RSVP saved",
          description: `${e.title}`,
        });
      }
    } catch {
      show({
        title: "Something went wrong",
        description: "Could not update your RSVP.",
      });
    }
  }

  // search logic
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setSearchQuery(searchInput);
    }
  };

  const uniqueCities = useMemo(() => {
    const cities = [...new Set(events.map((e) => e.location))];
    return cities.sort();
  }, []);

  const filteredEvents = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return events.filter((event) => {
      const matchesSearch =
        query === "" ||
        event.title.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query);

      const matchesCity =
        selectedCity === "all" || event.location === selectedCity;

      return matchesSearch && matchesCity;
    });
  }, [searchQuery, selectedCity]);

  function clearFilters() {
    setSearchInput("");
    setSearchQuery("");
    setSelectedCity("all");
  }

  function handleExpand(id) {
    setExpandedId(expandedId === id ? null : id);
  }

  return (
    <div className="events-page">
      <div className="events-wrap">
        <h1 className="events-title">Events</h1>

        {/* SEARCH + FILTER UI */}
        <div className="events-controls">

          <input
            type="text"
            className="events-search"
            placeholder="Search by event name or location..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyPress}
            aria-label="Search events by name or location"
          />

          <select
            className="events-filter"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            aria-label="Filter by city"
          >
            <option value="all">All Locations</option>
            {uniqueCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <button
            onClick={() => setSearchQuery(searchInput)}
            className="primary-btn"
            aria-label="Search"
          >
            Search
          </button>

          {(searchQuery || selectedCity !== "all") && (
            <button
              onClick={clearFilters}
              className="secondary-btn"
              aria-label="Clear all filters"
            >
              Clear
            </button>
          )}
        </div>

        {/* RESULTS TEXT */}
        <p className="events-result">
          {filteredEvents.length === 0 ? (
            "No events found matching your search."
          ) : filteredEvents.length === 1 ? (
            "1 event found"
          ) : (
            `${filteredEvents.length} events found`
          )}
          {(searchQuery || selectedCity !== "all") && (
            <span className="events-result-filter">
              {searchQuery && ` for "${searchQuery}"`}
              {searchQuery && selectedCity !== "all" && " in "}
              {selectedCity !== "all" && selectedCity}
            </span>
          )}
        </p>

        {/* GRID */}
        <section className="events-grid">
          <div className="events-list">
            {filteredEvents.map((e) => (
              <EventCard
                key={e.id}
                e={e}
                saved={savedIds.has(String(e.id))}
                expanded={expandedId === e.id}
                onExpand={() => handleExpand(e.id)}
                onToggleSave={toggleSave}
                onFocusLocation={(coords) => setFocusedCoords(coords)}
              />
            ))}
          </div>

          <aside>
            <MapPanel items={filteredEvents} focus={focusedCoords} />
          </aside>
        </section>
      </div>
    </div>
  );
}
