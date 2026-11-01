import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

const createIcon = (status) => {
  const colors = {
    Pending: "#E59A27",
    Verified: "#3182CE",
    "In Progress": "#805AD5",
    Resolved: "#269B68"
  };

  return L.divIcon({
    className: "",
    html: `<div style="
      width: 18px;
      height: 18px;
      background: ${colors[status] || "#E59A27"};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px #0005;
    "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
};

function MapUpdater({ selectedComplaint }) {
  const map = useMap();

  useEffect(() => {
    if (
      selectedComplaint?.latitude != null &&
      selectedComplaint?.longitude != null
    ) {
      map.flyTo(
        [selectedComplaint.latitude, selectedComplaint.longitude],
        16,
        { duration: 1 }
      );
    }
  }, [selectedComplaint, map]);

  return null;
}

function AdminMap({ complaints, selectedComplaint, onSelectComplaint }) {
  const mappedComplaints = complaints.filter(
    (complaint) =>
      Number.isFinite(Number(complaint.latitude)) &&
      Number.isFinite(Number(complaint.longitude)) &&
      complaint.latitude !== null &&
      complaint.longitude !== null
  );

  return (
    <div className="admin-map">
      <MapContainer
        center={[16.235, 80.558]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater selectedComplaint={selectedComplaint} />

        {mappedComplaints.map((complaint) => (
          <Marker
            key={complaint._id}
            position={[
              Number(complaint.latitude),
              Number(complaint.longitude)
            ]}
            icon={createIcon(complaint.status)}
            eventHandlers={{
              click: () => onSelectComplaint(complaint)
            }}
          >
            <Popup>
              <strong>{complaint.title}</strong>
              <br />
              {complaint.location}
              <br />
              Status: {complaint.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default AdminMap;