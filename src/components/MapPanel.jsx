import React, { useMemo, useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { formatEventDate, formatEventTime } from "../util/format";

export default function MapPanel({ items, focus }) {
  const center = useMemo(() => {
    if (!items.length) return [47.6088, -122.27];

    const avgLat = items.reduce((s, e) => s + e.coords[0], 0) / items.length;
    const avgLng = items.reduce((s, e) => s + e.coords[1], 0) / items.length;
    return [avgLat, avgLng];
  }, [items]);

  return (
    <aside className="events-map" aria-label="Map showing event locations">
      <MapContainer
        center={center}
        zoom={items.length === 1 ? 13 : 10}
        scrollWheelZoom={false}
        style={{ height: 420, width: "100%" }}
        className="leaflet-rounded"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {items.map((e) => (
          <Marker key={e.id} position={e.coords}>
            <Popup>
              <strong>{e.title}</strong>
              <br />
              {formatEventDate(e.startsAt)} • {formatEventTime(e.startsAt)}
              <br />
              {e.location}
            </Popup>
          </Marker>
        ))}

        <MapFocus coords={focus} />
      </MapContainer>
    </aside>
  );
}

function MapFocus({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (!coords) return;
    map.flyTo(coords, 14, { animate: true });
  }, [coords, map]);

  return null;
}
