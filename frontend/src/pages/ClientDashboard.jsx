import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../auth";
import { createBooking, getBookingUpdates, getBookings } from "../services/api";

const SERVICES = ["Oil Change", "Brake Service", "Engine Diagnostics", "Battery Check", "General Service"];

export default function ClientDashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [bookings, setBookings] = useState([]);
  const [updatesByBooking, setUpdatesByBooking] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    vehicle_id: "",
    service_type: SERVICES[0],
    booking_date: ""
  });

  const loadBookings = async () => {
    if (!user?.id) return;
    try {
      const data = await getBookings(user.id);
      setBookings(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadUpdatesForBooking = async (bookingId) => {
    try {
      const updates = await getBookingUpdates(bookingId);
      setUpdatesByBooking((prev) => ({
        ...prev,
        [bookingId]: updates
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    if (!bookings.length) return;

    bookings.forEach((booking) => {
      loadUpdatesForBooking(booking.id);
    });
  }, [bookings]);

  const onLogout = () => {
    logout();
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createBooking({ ...form, user_id: user.id });
      setForm({ vehicle_id: "", service_type: SERVICES[0], booking_date: "" });
      await loadBookings();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Client Dashboard</h1>
          <p className="muted">Book a service by adding your vehicle details and service type.</p>
        </div>
        <button className="btn btn-outline" onClick={onLogout}>Logout</button>
      </header>

      <section className="service-grid">
        {SERVICES.map((service) => (
          <article key={service} className="service-card">
            <h3>{service}</h3>
            <p>Professional maintenance delivered by certified partner garages.</p>
          </article>
        ))}
      </section>

      <section className="panel">
        <h2>Book Service</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label>Vehicle Details / Number</label>
          <input
            name="vehicle_id"
            value={form.vehicle_id}
            onChange={(e) => setForm((prev) => ({ ...prev, vehicle_id: e.target.value }))}
            placeholder="Example: KA-01-AB-1234 / Honda City"
            required
          />

          <label>Service</label>
          <select
            name="service_type"
            value={form.service_type}
            onChange={(e) => setForm((prev) => ({ ...prev, service_type: e.target.value }))}
            required
          >
            {SERVICES.map((service) => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>

          <label>Booking Date</label>
          <input
            type="date"
            name="booking_date"
            value={form.booking_date}
            onChange={(e) => setForm((prev) => ({ ...prev, booking_date: e.target.value }))}
            required
          />

          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </section>

      <section className="panel">
        <h2>My Service Requests</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Vehicle</th>
                <th>Service</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="5">No bookings yet.</td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.id}</td>
                    <td>{booking.vehicle_id}</td>
                    <td>{booking.service_type}</td>
                    <td>{String(booking.booking_date).slice(0, 10)}</td>
                    <td><span className={`status status-${booking.status}`}>{booking.status}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="timeline-grid">
          {bookings.map((booking) => {
            const updates = updatesByBooking[booking.id] || [];

            return (
              <article className="timeline-card" key={`updates-${booking.id}`}>
                <h3>Booking #{booking.id} Progress Updates</h3>

                {updates.length === 0 ? (
                  <p className="muted">No updates from garage yet.</p>
                ) : (
                  <ul className="timeline-list">
                    {updates.map((update) => (
                      <li key={update.id} className="timeline-item">
                        <p className="timeline-message">{update.message}</p>
                        <p className="timeline-meta">
                          {update.eta_value && update.eta_unit
                            ? `ETA: ${update.eta_value} ${update.eta_unit}`
                            : "ETA: Not specified"}
                          {" • "}
                          {new Date(update.created_at).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}