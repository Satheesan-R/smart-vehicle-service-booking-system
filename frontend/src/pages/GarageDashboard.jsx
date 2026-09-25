import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../auth";
import { logout } from "../auth";
import { createBookingUpdate, getBookings, updateBookingStatus } from "../services/api";

import "./GarageDashboard.css";

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
    <div className="garage-dashboard">
      <aside className="garage-sidebar">
        <Link className="garage-brand" to="/" aria-label="Smart Vehicle Service home"><span className="garage-brand-mark">S.</span><span>SMART VEHICLE<small>SERVICE & CARE</small></span></Link>
        <p className="garage-nav-label">GARAGE WORKSPACE</p>
        <nav aria-label="Garage navigation"><a href="#garage-overview">Overview <span aria-hidden="true">↗</span></a><a href="#garage-requests">Service requests <span>{bookings.length}</span></a><a href="#garage-update">Send an update <span aria-hidden="true">+</span></a><a href="#garage-queue">Active work <span aria-hidden="true">↗</span></a></nav>
        <div className="garage-sidebar-note"><span aria-hidden="true">↗</span><h2>Great service. Clear communication.</h2><p>Keep customers informed at every stage of their service.</p><a href="#garage-update">Share a progress update →</a></div>
        <div className="garage-account"><span className="garage-avatar" aria-hidden="true">{user?.name?.charAt(0).toUpperCase() || "G"}</span><div><strong>{user?.name || "Garage team"}</strong><small>Garage account</small></div><button type="button" onClick={onLogout}>Log out</button></div>
      </aside>
      <main className="garage-main" id="garage-overview">
        <header className="garage-topbar"><span>Workspace <span aria-hidden="true">/</span> <strong>Garage overview</strong></span><span className="garage-account-tag">GARAGE TEAM</span></header>
        <section className="garage-welcome" aria-labelledby="garage-title"><div><p className="garage-eyebrow">SERVICE THAT KEEPS PEOPLE MOVING</p><h1 id="garage-title">Your workshop, organized<span>.</span></h1><p>Welcome, {user?.name || "garage team"}. Manage requests and keep your customers up to date.</p></div><a className="garage-button" href="#garage-update">Send an update <span aria-hidden="true">↗</span></a></section>
        {error && <p className="garage-error" role="alert">{error}</p>}
        <section className="garage-stats" aria-label="Service request summary">{[["Total requests", bookings.length, "All customer bookings"], ["Pending", bookings.filter(b => b.status === "pending").length, "Ready for your review"], ["In progress", bookings.filter(b => b.status === "in-progress").length, "Currently being serviced"], ["Completed", bookings.filter(b => b.status === "completed").length, "Jobs completed"]].map(([label, count, note], index) => <article className="garage-stat" key={label}><div><span>{label}</span><span className={`garage-stat-dot dot-${index}`} aria-hidden="true" /></div><strong>{count}</strong><p>{note}</p></article>)}</section>
        <div className="garage-workspace-grid">
          <section className="garage-panel" id="garage-update" aria-labelledby="garage-update-title">
            <div className="garage-panel-heading"><div><p className="garage-eyebrow">KEEP CUSTOMERS IN THE LOOP</p><h2 id="garage-update-title">Send a progress update</h2></div><span className="garage-panel-symbol" aria-hidden="true">↗</span></div>
            <p className="garage-panel-description">Share the latest work, estimated time, and service status.</p>
            <form className="garage-form" onSubmit={handleUpdateSubmit} aria-busy={savingId !== null}>
              <div><label htmlFor="garage-booking">Booking</label><select id="garage-booking" value={updateForm.booking_id} onChange={e => setUpdateForm(prev => ({ ...prev, booking_id: e.target.value }))} required disabled={savingId !== null}><option value="">Select a customer booking</option>{bookings.map(booking => <option key={booking.id} value={booking.id}>#{booking.id} — {booking.client_name || "Client"} ({booking.service_type})</option>)}</select></div>
              <div><label htmlFor="garage-message">Progress message</label><textarea id="garage-message" rows="3" value={updateForm.message} onChange={e => setUpdateForm(prev => ({ ...prev, message: e.target.value }))} placeholder="Let your customer know what's been done and what comes next." required disabled={savingId !== null} /></div>
              <div className="garage-update-details"><fieldset className="garage-eta"><legend>Estimated time remaining <span>(optional)</span></legend><div><input aria-label="Estimated time amount" type="number" min="1" value={updateForm.eta_value} onChange={e => setUpdateForm(prev => ({ ...prev, eta_value: e.target.value }))} placeholder="e.g. 5" disabled={savingId !== null} /><select aria-label="Estimated time unit" value={updateForm.eta_unit} onChange={e => setUpdateForm(prev => ({ ...prev, eta_unit: e.target.value }))} disabled={savingId !== null}><option value="hours">Hours</option><option value="days">Days</option></select></div></fieldset><div><label htmlFor="garage-update-status">Service status</label><select id="garage-update-status" value={updateForm.status} onChange={e => setUpdateForm(prev => ({ ...prev, status: e.target.value }))} disabled={savingId !== null}>{STATUS_OPTIONS.map(status => <option key={status} value={status}>{status.replace(/-/g, " ")}</option>)}</select></div></div>
              <button className="garage-button" type="submit" disabled={savingId !== null || !bookings.length}>{savingId === Number(updateForm.booking_id) ? "Sending..." : "Send update to customer"}<span aria-hidden="true">↗</span></button><p className="garage-form-note">Updates will appear in your customer's service progress.</p>
            </form>
          </section>
          <section className="garage-panel garage-queue" id="garage-queue" aria-labelledby="garage-queue-title"><p className="garage-eyebrow">ON YOUR WORKBENCH</p><h2 id="garage-queue-title">Active service work</h2><p className="garage-panel-description">A quick look at the jobs currently in progress.</p>
            {bookings.filter(b => b.status === "in-progress").length === 0 ? <div className="garage-queue-empty"><span aria-hidden="true">✓</span><strong>Your workbench is clear.</strong><p>Bookings marked in progress will appear here.</p><a href="#garage-requests">Review service requests ↗</a></div> : <div className="garage-queue-list">{bookings.filter(b => b.status === "in-progress").map(booking => <a key={booking.id} href="#garage-update" onClick={() => setUpdateForm(prev => ({ ...prev, booking_id: String(booking.id), status: booking.status }))}><span className="garage-job-id">#{booking.id}</span><div><strong>{booking.service_type}</strong><small>{booking.client_name || "Client"} · {booking.vehicle_id}</small></div><span aria-hidden="true">↗</span></a>)}</div>}
            <div className="garage-service-note"><strong>A clear update makes a difference.</strong><p>Share an estimated completion time so customers can plan their day.</p></div>
          </section>
        </div>
        <section className="garage-panel garage-requests" id="garage-requests" aria-labelledby="garage-requests-title"><div className="garage-panel-heading"><div><p className="garage-eyebrow">EVERY REQUEST, ONE WORKSPACE</p><h2 id="garage-requests-title">Customer service requests</h2></div><span className="garage-count">{bookings.length} requests</span></div>
          <div className="garage-table-wrap"><table><thead><tr><th scope="col">Booking</th><th scope="col">Customer</th><th scope="col">Vehicle</th><th scope="col">Service</th><th scope="col">Date</th><th scope="col">Status</th><th scope="col">Change status</th></tr></thead><tbody>{bookings.length === 0 ? <tr><td colSpan="7"><div className="garage-empty"><strong>Ready for your next customer.</strong><p>New service requests will appear here when customers book.</p></div></td></tr> : bookings.map(booking => <tr key={booking.id}><td><strong>#{booking.id}</strong></td><td><span className="garage-customer-name">{booking.client_name || "Client"}</span><span className="garage-customer-email">{booking.client_email || "—"}</span></td><td>{booking.vehicle_id}</td><td>{booking.service_type}</td><td>{String(booking.booking_date).slice(0, 10)}</td><td><span className={`garage-status garage-status-${booking.status}`}>{booking.status?.replace(/-/g, " ")}</span></td><td><select className="garage-status-select" aria-label={`Change status for booking ${booking.id}`} value={booking.status} onChange={e => changeStatus(booking.id, e.target.value)} disabled={savingId !== null}>{STATUS_OPTIONS.map(status => <option key={status} value={status}>{status.replace(/-/g, " ")}</option>)}</select>{savingId === booking.id && <small className="garage-saving" role="status">Saving...</small>}</td></tr>)}</tbody></table></div>
        </section>
        <footer className="garage-footer"><span>Smart Vehicle Service</span><span>Better care. Every journey.</span></footer>
      </main>
    </div>
  );
}
