import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../auth";
import { logout } from "../auth";
import { createBookingUpdate, getBookings, updateBookingStatus } from "../services/api";

const STATUS_OPTIONS = ["pending", "in-progress", "completed"];

export default function GarageDashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    booking_id: "",
    message: "",
    eta_value: "",
    eta_unit: "hours",
    status: "in-progress"
  });

  const loadBookings = async () => {
    try {
      const data = await getBookings();
      setBookings(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const onLogout = () => {
    logout();
    navigate("/");
  };

  const changeStatus = async (bookingId, status) => {
    setSavingId(bookingId);
    setError("");
    try {
      await updateBookingStatus(bookingId, status);
      await loadBookings();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!updateForm.booking_id || !updateForm.message.trim()) {
      setError("Please select a booking and enter update message.");
      return;
    }

    setSavingId(Number(updateForm.booking_id));

    try {
      await createBookingUpdate(updateForm.booking_id, {
        garage_id: user?.id,
        message: updateForm.message,
        eta_value: updateForm.eta_value ? Number(updateForm.eta_value) : null,
        eta_unit: updateForm.eta_unit,
        status: updateForm.status
      });

      setUpdateForm((prev) => ({
        ...prev,
        message: "",
        eta_value: ""
      }));

      await loadBookings();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Garage Dashboard</h1>
          <p className="muted">View client service requests and manage their progress.</p>
        </div>
        <button className="btn btn-outline" onClick={onLogout}>Logout</button>
      </header>

      <section className="panel">
        <h2>Send Progress Update to Client</h2>
        <form className="form form-inline" onSubmit={handleUpdateSubmit}>
          <label>Booking</label>
          <select
            value={updateForm.booking_id}
            onChange={(e) => setUpdateForm((prev) => ({ ...prev, booking_id: e.target.value }))}
            required
          >
            <option value="">Select booking</option>
            {bookings.map((booking) => (
              <option key={booking.id} value={booking.id}>
                #{booking.id} - {booking.client_name || "Client"} ({booking.service_type})
              </option>
            ))}
          </select>

          <label>Update Message</label>
          <input
            value={updateForm.message}
            onChange={(e) => setUpdateForm((prev) => ({ ...prev, message: e.target.value }))}
            placeholder="Example: Repair is in progress. Need 5 more hours."
            required
          />

          <label>ETA</label>
          <div className="eta-row">
            <input
              type="number"
              min="1"
              value={updateForm.eta_value}
              onChange={(e) => setUpdateForm((prev) => ({ ...prev, eta_value: e.target.value }))}
              placeholder="5"
            />
            <select
              value={updateForm.eta_unit}
              onChange={(e) => setUpdateForm((prev) => ({ ...prev, eta_unit: e.target.value }))}
            >
              <option value="hours">hours</option>
              <option value="days">days</option>
            </select>
          </div>

          <label>Status</label>
          <select
            value={updateForm.status}
            onChange={(e) => setUpdateForm((prev) => ({ ...prev, status: e.target.value }))}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <button className="btn btn-primary" type="submit" disabled={savingId === Number(updateForm.booking_id)}>
            {savingId === Number(updateForm.booking_id) ? "Sending..." : "Send Update"}
          </button>
        </form>
      </section>

      <section className="panel">
        <h2>Client Service Requests</h2>
        {error && <p className="error-text">{error}</p>}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Client Name</th>
                <th>Client Email</th>
                <th>Vehicle</th>
                <th>Service</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="8">No client requests available.</td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.id}</td>
                    <td>{booking.client_name || "-"}</td>
                    <td>{booking.client_email || "-"}</td>
                    <td>{booking.vehicle_id}</td>
                    <td>{booking.service_type}</td>
                    <td>{String(booking.booking_date).slice(0, 10)}</td>
                    <td><span className={`status status-${booking.status}`}>{booking.status}</span></td>
                    <td>
                      <select
                        value={booking.status}
                        onChange={(e) => changeStatus(booking.id, e.target.value)}
                        disabled={savingId === booking.id}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}