import React, { useEffect, useState, useMemo } from "react";
import "../index.css";

import { buildIcs, downloadIcsFile } from "../util/ics";
import { useToast } from "./Toast";

import { auth, db1 } from "../firebase";
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
    startsAt: "2025-11-20T17:30:00-07:00",
    endsAt: "2025-11-20T19:00:00-07:00",
  },
  {
    id: 2,
    title: "Reading",
    location: "Bellevue, WA",
    address: "Bellevue Library, 345 110th Ave NE",
    description: "Quiet evening reading session. Bring your favorite book.",
    image: "/img/reading-before-bed-3x2 4.png",
    coords: [47.6102, -122.2014],
    startsAt: "2025-11-20T19:30:00-07:00",
    endsAt: "2025-11-20T21:00:00-07:00",
  },
  {
    id: 3,
    title: "Coffee Chats",
    location: "Kirkland, WA",
    address: "Kirkland Community Center, 340 Kirkland Ave",
    description: "Join fellow retirees for a relaxed morning of coffee and meaningful conversation. Share stories, make new friends, and enjoy good company in a welcoming atmosphere.",
    image: "/img/coffee.jpg",
    coords: [47.6815, -122.2087],
    startsAt: "2025-12-21T09:00:00-07:00",
    endsAt: "2025-12-21T11:00:00-07:00",
  },
  {
    id: 4,
    title: "Walking Group",
    location: "Seattle, WA",
    address: "Seward Park, 5900 Lake Washington Blvd S",
    description: "Gentle 2-mile walking group around the beautiful Seward Park trail. Perfect pace for all fitness levels. Enjoy nature, fresh air, and friendly conversation with peers.",
    image: "/img/sewardpark.jpg",
    coords: [47.5506, -122.2575],
    startsAt: "2025-12-22T10:30:00-07:00",
    endsAt: "2025-12-22T12:00:00-07:00",
  },
  {
    id: 5,
    title: "Tai Chi in the Park",
    location: "Redmond, WA",
    address: "Downtown Redmond Park, 16101 NE Redmond Way",
    description: "Gentle outdoor Tai Chi session led by local instructors. Perfect for balance, mobility, and relaxation.",
    image: "/img/taichi.jpg",
    coords: [47.6736, -122.1215],
    startsAt: "2025-12-03T09:30:00-07:00",
    endsAt: "2025-12-03T10:45:00-07:00",
  },
  {
    id: 6,
    title: "Arts and Crafts",
    location: "Renton, WA",
    address: "Renton Community Center, 1715 Maple Valley Hwy",
    description: "Relaxed indoor craft session. Supplies for acrylic painting, knitting, and scrapbooking provided.",
    image: "/img/crafts.jpg",
    coords: [47.4751, -122.206],
    startsAt: "2025-12-10T13:00:00-07:00",
    endsAt: "2025-12-10T15:30:00-07:00",
  },
  {
    id: 7,
    title: "Movie Afternoon",
    location: "Seattle, WA",
    address: "Greenwood Senior Center, 525 N 85th St",
    description: "Community film screening of a classic movie. Popcorn and soft drinks included.",
    image: "/img/movie.jpg",
    coords: [47.6900, -122.3554],
    startsAt: "2025-12-14T14:00:00-07:00",
    endsAt: "2025-12-14T16:30:00-07:00",
  },
  {
    id: 8,
    title: "Yoga for Beginners",
    location: "Bothell, WA",
    address: "Bothell YMCA, 11811 NE 195th St",
    description: "A gentle yoga class focused on stretching and mindfulness. Mats available on site.",
    image: "/img/yoga.jpg",
    coords: [47.7701, -122.1843],
    startsAt: "2025-12-18T11:00:00-07:00",
    endsAt: "2025-12-18T12:15:00-07:00",
  },
  {
    id: 9,
    title: "Holiday Potluck",
    location: "Bellevue, WA",
    address: "Crossroads Community Center, 16000 NE 10th St",
    description: "Seasonal gathering. Bring your favorite dish and meet new friends. Board games available.",
    image: "/img/potluck.jpg",
    coords: [47.6223, -122.141],
    startsAt: "2025-12-23T17:00:00-07:00",
    endsAt: "2025-12-23T19:30:00-07:00",
  },
  {
    id: 10,
    title: "Board Games Club",
    location: "Seattle, WA",
    address: "Capitol Hill Library, 425 Harvard Ave E",
    description: "Casual board game afternoon. Chess, Scrabble, Rummikub, and card games provided. Beginners welcome.",
    image: "/img/boardgames.jpg",
    coords: [47.6225, -122.3224],
    startsAt: "2026-01-05T14:00:00-07:00",
    endsAt: "2026-01-05T16:00:00-07:00",
  },
  {
    id: 11,
    title: "Photography Walk",
    location: "Kirkland, WA",
    address: "Marina Park Pavilion, 25 Lakeshore Plaza",
    description: "Slow paced waterfront photo walk. Learn phone camera basics and composition tips.",
    image: "/img/photowalk.jpg",
    coords: [47.6762, -122.2051],
    startsAt: "2026-01-09T10:00:00-07:00",
    endsAt: "2026-01-09T11:30:00-07:00",
  },
  {
    id: 12,
    title: "Cooking Together",
    location: "Seattle, WA",
    address: "Ballard Community Center, 6020 28th Ave NW",
    description: "Learn a simple seasonal recipe in a relaxed group setting. All ingredients included.",
    image: "/img/cooking.jpg",
    coords: [47.6728, -122.3924],
    startsAt: "2026-01-15T16:00:00-07:00",
    endsAt: "2026-01-15T18:00:00-07:00",
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
