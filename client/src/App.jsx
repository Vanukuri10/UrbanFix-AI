import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import AdminConsole from "./components/AdminConsole";
import LocationPicker from "./components/LocationPicker";

const API_URL = "/api/complaints";

function App() {
  const [complaints, setComplaints] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Pothole",
    location: "",
    priority: "Medium",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [image, setImage] = useState(null);
const [imagePreview, setImagePreview] = useState("");

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(API_URL);
      setComplaints(response.data);
      setError("");
    } catch {
      setError("Unable to load complaints. Please check the backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    setError("Please select a JPG, PNG, or WEBP image.");
    e.target.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    setError("Image size must be less than 5 MB.");
    e.target.value = "";
    return;
  }

  setError("");
  setImage(file);
  setImagePreview(URL.createObjectURL(file));
};


const handleSubmit = async (e) => {
  e.preventDefault();
    if (!selectedLocation) {
    setError("Please select the road location on the map or use GPS.");
    return;
  }
  setMessage("");
  setError("");
  setSubmitting(true);

  try {
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("latitude", selectedLocation[0]);
    formData.append("longitude", selectedLocation[1]);

    if (image) {
      formData.append("image", image);
    }

    await axios.post(API_URL, formData);

    setForm({
      title: "",
      description: "",
      category: "Pothole",
      location: "",
      priority: "Medium",
    });

    setImage(null);
    setImagePreview("");
    setSelectedLocation(null);

    if (document.getElementById("image")) {
      document.getElementById("image").value = "";
    }

    setMessage("Complaint submitted and saved successfully!");
    await fetchComplaints();

    setTimeout(() => setMessage(""), 3000);
  } catch (err) {
    setError(
      err.response?.data?.error ||
        err.response?.data?.message ||
        "Unable to submit complaint. Please try again."
    );
  } finally {
    setSubmitting(false);
  }
};

  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (item) => item.status === "Pending"
  ).length;

  const completedComplaints = complaints.filter(
    (item) => item.status === "Resolved"
  ).length;

  const getSeverity = (priority) => {
    if (priority === "High") return "High";
    if (priority === "Low") return "Low";
    return "Medium";
  };

  const getDisplayStatus = (status) => {
    if (status === "Pending") return "Pending Review";
    if (status === "Resolved") return "Completed";
    return status;
  };

  if (showAdmin) {
  return <AdminConsole onBack={() => setShowAdmin(false)} />;
}

  return (
    <div className="app">
      <nav className="navbar">
        <a href="#home" className="logo">
          <span className="logo-icon">U</span>
          <span>
            UrbanFix <span className="logo-ai">AI</span>
          </span>
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#report">Report Defect</a>
          <a href="#complaints">Complaints</a>
        </div>

        <div className="nav-actions">
  <button
    className="admin-access-button"
    onClick={() => setShowAdmin(true)}
  >
    Admin Access
  </button>

  <a href="#report" className="nav-button">
    Report a Problem
  </a>
</div>
      </nav>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow">
              SMART CITY · INFRASTRUCTURE MANAGEMENT
            </span>

            <h1>
              Better Roads.
              <br />
              <span>Smarter Cities.</span>
            </h1>

            <p>
              Identify road defects, report damaged roads, and help
              prioritize urban maintenance with human-verified decisions.
            </p>

            <div className="hero-actions">
              <a href="#report" className="primary-button">
                Report a Road Defect →
              </a>

              <a href="#complaints" className="secondary-button">
                View Complaints
              </a>
            </div>

            <div className="hero-note">
              <span className="status-dot"></span>
              Real-time complaint management · Human-reviewed decisions
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-card">
              <div className="visual-top">
                <span>INFRASTRUCTURE MONITOR</span>
                <span className="live-badge">● LIVE DATA</span>
              </div>

              <div className="road-illustration">
                <div className="road-line"></div>
                <div className="road-defect defect-one"></div>
                <div className="road-defect defect-two"></div>
                <div className="road-marker marker-one">!</div>
                <div className="road-marker marker-two">!</div>
              </div>

              <div className="visual-bottom">
                <div>
                  <span className="visual-label">Complaint system</span>
                  <strong>Connected to database</strong>
                </div>

                <div className="scan-icon">⌕</div>
              </div>
            </div>

            <div className="floating-card">
              <span className="floating-icon">✓</span>
              <div>
                <strong>Human verification</strong>
                <p>Decisions stay in human hands</p>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">YOUR INFRASTRUCTURE OVERVIEW</span>
              <h2>Complaint Overview</h2>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon blue">▤</div>
              <p>Total Complaints</p>
              <h3>{totalComplaints}</h3>
              <span>Reports stored in database</span>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">◷</div>
              <p>Pending Review</p>
              <h3>{pendingComplaints}</h3>
              <span>Awaiting review</span>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">✓</div>
              <p>Completed Repairs</p>
              <h3>{completedComplaints}</h3>
              <span>Resolved complaints</span>
            </div>
          </div>
        </section>

        <section className="workspace" id="report">
          <div className="report-panel">
            <span className="eyebrow">CITIZEN REPORTING</span>
            <h2>Report a Road Defect</h2>

            <p className="panel-description">
              Describe a damaged road to create a complaint in the database.
            </p>

            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              
            <label htmlFor="image">Upload road-defect photo</label>

           <input
             id="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
          />

          {imagePreview && (
          <div className="image-preview">
          <img src={imagePreview} alt="Selected road defect" />
          <button
          type="button"
          onClick={() => {
          URL.revokeObjectURL(imagePreview);
          setImage(null);
          setImagePreview("");
          document.getElementById("image").value = "";
          }}
          >
         Remove image
          </button>
          </div>
             )}

             <label htmlFor="title">Defect title</label>

              <input
                id="title"
                name="title"
                placeholder="e.g. Large pothole near the entrance"
                value={form.title}
                onChange={handleChange}
                required
              />

              <label htmlFor="description">Detailed description</label>

              <textarea
                id="description"
                name="description"
                placeholder="Describe the road defect..."
                value={form.description}
                onChange={handleChange}
                required
                rows="3"
              />

              <label htmlFor="category">Defect category</label>

              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="Pothole">Pothole</option>
                <option value="Road Damage">Road Damage</option>
                <option value="Waterlogging">Waterlogging</option>
                <option value="Other">Other</option>
              </select>

              <label htmlFor="location">Road location</label>

              <input
                id="location"
                name="location"
                placeholder="e.g. Main Road, near bus stop"
                value={form.location}
                onChange={handleChange}
                required
              />
              <label>Select exact road location</label>

               <LocationPicker
                position={selectedLocation}
                onChange={setSelectedLocation}
              />

              <label htmlFor="priority">Estimated priority</label>

              <select
                id="priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                required
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <button
                type="submit"
                className="primary-button submit-button"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Complaint →"}
              </button>
            </form>
          </div>
        </section>
        <section className="complaints-section" id="complaints">
          <div className="section-heading">
            <div>
              <span className="eyebrow">ROAD ISSUE MANAGEMENT</span>
              <h2>Recent Complaints</h2>
            </div>

            <span className="complaint-count">
              {totalComplaints} reports
            </span>
          </div>

          {loading && <p>Loading complaints...</p>}

          {error && complaints.length === 0 && (
            <p className="error-message">{error}</p>
          )}

          <div className="complaint-list">
            {complaints.map((complaint) => {
              const severity = getSeverity(complaint.priority);
              const status = getDisplayStatus(complaint.status);

              return (
                <article
                  className="complaint-card"
                  key={complaint._id}
                >
                  {complaint.imageUrl ? (
  <img
    src={complaint.imageUrl}
    alt="Reported road defect"
    className="complaint-image"
  />
) : (
  <div className="complaint-symbol">⌖</div>
)}

                  <div className="complaint-details">
                    <h3>{complaint.title}</h3>
                    <p>⌖ {complaint.location}</p>
                    <small>{complaint.category}</small>
                  </div>

                  <span
                    className={`severity severity-${severity.toLowerCase()}`}
                  >
                    {severity} severity
                  </span>

                  <span
                    className={`complaint-status status-${status
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                  >
                    {status}
                  </span>
                </article>
              );
            })}

            {!loading && complaints.length === 0 && !error && (
              <div className="empty-state">
                No complaints yet. Submit your first road-defect report!
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <a href="#home" className="logo footer-logo">
          <span className="logo-icon">U</span>
          <span>
            UrbanFix <span className="logo-ai">AI</span>
          </span>
        </a>
      </footer>
    </div>
  );
}

export default App;
