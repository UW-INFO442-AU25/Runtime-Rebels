import React from "react";
import { MapPin } from "lucide-react";
import { formatEventDate, formatEventTime, formatDateTimeLine } from "../util/format";

export default function EventCard({
  e,
  saved,
  expanded,
  onToggleSave,
  onExpand,
  onFocusLocation,
}) {
  const dateLine = formatDateTimeLine(e.startsAt);

  const handleKeyExpand = (evt) => {
    if (evt.key === "Enter" || evt.key === " ") {
      evt.preventDefault();
      onExpand();
    }
  };

  const handleKeyFocusLocation = (evt) => {
    if (evt.key === "Enter" || evt.key === " ") {
      evt.preventDefault();
      onFocusLocation(e.coords);
    }
  };

  return (
    <article
      className={`event-card ${expanded ? "expanded" : ""}`}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      aria-label={`${e.title} in ${e.location}, ${dateLine}${saved ? ", RSVP saved" : ""}`}
      onClick={onExpand}
      onKeyDown={handleKeyExpand}
    >
      <div className="event-card__body">
        {/* Image - Left */}
        <div className="event-card__media">
          <img src={e.image} alt={e.title} />
        </div>

        {/* Title + Location - Center */}
        <div className="event-card__content">
          <h3 className="event-card__title">{e.title}</h3>
          <p className="event-card__city">{e.location}</p>
        </div>

        {/* Date + Actions - Top Right */}
        <div className="event-card__right-column">
          <div className="event-card__time">{dateLine}</div>

          <button
            className={`rsvp-btn ${saved ? "rsvp-btn--saved" : ""}`}
            onClick={(evt) => {
              evt.stopPropagation();
              onToggleSave(e);
            }}
            aria-pressed={saved}
            aria-label={saved ? "Remove RSVP for this event" : "RSVP to this event"}
          >
            {saved ? "RSVP'd" : "RSVP"}
          </button>
        </div>
      </div>

      {/* Accordion Drawer */}
      {expanded && (
        <div className="event-card__details">
          <div className="event-card__row">
            <div
              className="event-card__address"
              role="button"
              tabIndex={0}
              aria-label={`Focus map on ${e.address || "event location"}`}
              onClick={(evt) => {
                evt.stopPropagation();
                onFocusLocation(e.coords);
              }}
              onKeyDown={handleKeyFocusLocation}
            >
              <MapPin
                size={16}
                className="inline-block mr-1"
                aria-hidden="true"
                focusable="false"
              />
              {e.address}
            </div>

            <div className="event-card__description">
              {e.description}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
