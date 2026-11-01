
import { useEffect, useState } from "react";
import axios from "axios";
import AdminMap from "./AdminMap";
import "./AdminConsole.css";

const API = "/api";

function AdminConsole({ onBack }) {
  const [token, setToken] = useState(localStorage.getItem("urbanfix_admin_token") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAdminComplaints = async (loginToken) => {
    const response = await axios.get(`${API}/admin/complaints`, {
      headers: { Authorization: `Bearer ${loginToken}` }
    });
    setComplaints(response.data);
  };

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    fetchAdminComplaints(token)
      .catch(() => {
        localStorage.removeItem("urbanfix_admin_token");
        setToken("");
        setError("Session expired. Please login again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/login`, {
        email,
        password
      });

      if (response.data.user.role !== "admin") {
        setError("Admin access only.");
        return;
      }

      const adminToken = response.data.token;
      localStorage.setItem("urbanfix_admin_token", adminToken);
      setToken(adminToken);
      await fetchAdminComplaints(adminToken);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (complaintId, status) => {
    try {
      const response = await axios.patch(
        `${API}/admin/complaints/${complaintId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComplaints((previous) =>
        previous.map((item) =>
          item._id === complaintId ? response.data.complaint : item
        )
      );

      setSelectedComplaint(response.data.complaint);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Status update failed.");
    }
  };

  const logout = () => {
    localStorage.removeItem("urbanfix_admin_token");
    setToken("");
    setComplaints([]);
    setSelectedComplaint(null);
    setPassword("");
  };

  if (!token) {
    return (
      <div className="admin-login-page">
        <button className="admin-back" onClick={onBack}>← Back to Home</button>

        <form className="admin-login-card" onSubmit={handleLogin}>
          <span className="admin-eyebrow">URBANFIX AI · ADMINISTRATION</span>
          <h1>Admin Sign In</h1>
          <p>Sign in to manage reported infrastructure issues.</p>

          {error && <div className="admin-error">{error}</div>}

          <label>Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin email"
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="operations-page">
      <header className="operations-header">
        <div>
          <span className="operations-brand">UrbanFix <b>AI</b></span>
          <span className="operations-subtitle">Infrastructure Operations Centre</span>
        </div>

        <div className="operations-actions">
          <span className="admin-online">● Admin active</span>
          <button onClick={onBack}>Citizen Home</button>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="operations-main">
        <div className="operations-heading">
          <div>
            <span className="admin-eyebrow">CITY INFRASTRUCTURE MONITORING</span>
            <h1>Incident Operations</h1>
            <p>Monitor reported road defects and coordinate their resolution.</p>
          </div>
          <span className="incident-total">{complaints.length} reported incidents</span>
        </div>

        {error && <div className="admin-error">{error}</div>}

        <div className="operations-layout">
          <section className="map-section">
            <div className="panel-heading">
              <h2>Incident Location Map</h2>
              <span>OpenStreetMap</span>
            </div>

            <div className="map-legend">
              <span className="legend-pending">● Pending</span>
              <span className="legend-verified">● Verified</span>
              <span className="legend-progress">● In Progress</span>
              <span className="legend-resolved">● Resolved</span>
            </div>

            <div className="operations-map">
              <AdminMap
                complaints={complaints}
                selectedComplaint={selectedComplaint}
                onSelectComplaint={setSelectedComplaint}
              />
            </div>
          </section>

          <aside className="incident-feed">
            <div className="panel-heading">
              <h2>Incident Feed</h2>
              <span>{complaints.length} reports</span>
            </div>

            {loading && <p>Loading incidents...</p>}

            {!loading && complaints.length === 0 && (
              <p>No complaints have been reported yet.</p>
            )}

            {complaints.map((complaint) => (
              <button
                className={`incident-item ${
                  selectedComplaint?._id === complaint._id ? "incident-selected" : ""
                }`}
                key={complaint._id}
                onClick={() => setSelectedComplaint(complaint)}
              >
                {complaint.imageUrl ? (
                  <img src={complaint.imageUrl} alt="Road defect" />
                ) : (
                  <div className="incident-placeholder">⌖</div>
                )}

                <div className="incident-item-details">
                  <strong>{complaint.title}</strong>
                  <span>{complaint.location}</span>
                  <small>{complaint.status} · {complaint.priority} priority</small>
                </div>
              </button>
            ))}
          </aside>
        </div>

        {selectedComplaint && (
          <section className="investigation-panel">
            <div className="panel-heading">
              <div>
                <span className="admin-eyebrow">COMPLAINT INVESTIGATION</span>
                <h2>{selectedComplaint.title}</h2>
              </div>
              <button onClick={() => setSelectedComplaint(null)}>Close ×</button>
            </div>

            <div className="investigation-content">
              {selectedComplaint.imageUrl && (
                <img
                  className="investigation-image"
                  src={selectedComplaint.imageUrl}
                  alt="Reported road defect"
                />
              )}

              <div className="investigation-details">
                <p><strong>Description:</strong> {selectedComplaint.description}</p>
                <p><strong>Location:</strong> {selectedComplaint.location}</p>
                <p><strong>Category:</strong> {selectedComplaint.category}</p>
                <p><strong>Priority:</strong> {selectedComplaint.priority}</p>
                <p><strong>Current status:</strong> {selectedComplaint.status}</p>

                <label>Update complaint status</label>
                <select
                  value={selectedComplaint.status}
                  onChange={(e) =>
                    updateStatus(selectedComplaint._id, e.target.value)
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Verified">Verified</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminConsole;
