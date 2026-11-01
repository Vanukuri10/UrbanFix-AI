
import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function LocationMarker({ position, onChange }) {
  useMapEvents({
    click(event) {
      onChange([
        event.latlng.lat,
        event.latlng.lng
      ]);
    }
  });

  return position ? <Marker position={position} /> : null;
}

function LocationPicker({ position, onChange }) {
  const [message, setMessage] = useState("");

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMessage("Location is not supported by this browser.");
      return;
    }

    setMessage("Getting your location...");

    navigator.geolocation.getCurrentPosition(
      (result) => {
        const coordinates = [
          result.coords.latitude,
          result.coords.longitude
        ];

        onChange(coordinates);
        setMessage("Location captured successfully.");
      },
      () => {
        setMessage("Unable to get location. Please select it on the map.");
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  return (
    <div className="location-picker">
      <button
        type="button"
        className="location-button"
        onClick={getCurrentLocation}
      >
        ◎ Use My Current Location
      </button>

      <p className="location-instruction">
        Or click directly on the map to select the road location.
      </p>

      <div className="location-map">
        <MapContainer
          center={position || [16.235, 80.558]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LocationMarker
            position={position}
            onChange={onChange}
          />
        </MapContainer>
      </div>

      {position && (
        <p className="selected-coordinates">
          Selected: {position[0].toFixed(6)}, {position[1].toFixed(6)}
        </p>
      )}

      {message && <p className="location-message">{message}</p>}
    </div>
  );
}

export default LocationPicker;
