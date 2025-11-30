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

  return (
    <article
      className={`event-card ${expanded ? "expanded" : ""}`}
      onClick={onExpand}
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
              onClick={(evt) => {
                evt.stopPropagation();
                onFocusLocation(e.coords);
              }}
            >
              <MapPin size={16} className="inline-block mr-1" />
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
