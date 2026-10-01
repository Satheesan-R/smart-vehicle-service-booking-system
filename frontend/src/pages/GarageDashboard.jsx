import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate, useOutletContext } from "react-router-dom";
import { getCurrentUser, logout } from "../auth";
import { createBookingUpdate, getBookings, updateBookingStatus } from "../services/api";

import "./GarageDashboard.css";

const STATUS_OPTIONS = ["pending", "in-progress", "completed"];

function GarageShell({ bookings, user, onLogout, error, context }) {
  return (
    <div className="garage-dashboard">
      <aside className="garage-sidebar">
        <Link className="garage-brand" to="/" aria-label="Smart Vehicle Service home"><span className="garage-brand-mark">S.</span><span>SMART VEHICLE<small>SERVICE & CARE</small></span></Link>
        <p className="garage-nav-label">GARAGE WORKSPACE</p>
        <nav aria-label="Garage navigation">
          <NavLink end to="/garage">Overview <span aria-hidden="true">↗</span></NavLink>
          <NavLink to="/garage/requests">Service requests <span>{bookings.length}</span></NavLink>
          <NavLink to="/garage/update">Send an update <span aria-hidden="true">+</span></NavLink>
          <NavLink to="/garage/active">Active work <span aria-hidden="true">↗</span></NavLink>
        </nav>
        <div className="garage-sidebar-note"><span aria-hidden="true">↗</span><h2>Great service. Clear communication.</h2><p>Keep customers informed at every stage of their service.</p><Link to="/garage/update">Share a progress update →</Link></div>
        <div className="garage-account"><span className="garage-avatar" aria-hidden="true">{user?.name?.charAt(0).toUpperCase() || "G"}</span><div><strong>{user?.name || "Garage team"}</strong><small>Garage account</small></div><button type="button" onClick={onLogout}>Log out</button></div>
      </aside>
      <main className="garage-main">
        <header className="garage-topbar"><span>Workspace <span aria-hidden="true">/</span> <strong>Garage workspace</strong></span><span className="garage-account-tag">GARAGE TEAM</span></header>
        {error && <p className="garage-error" role="alert">{error}</p>}
        <Outlet context={context} />
        <footer className="garage-footer"><span>Smart Vehicle Service</span><span>Better care. Every journey.</span></footer>
      </main>
    </div>
  );
}

function Overview() {
  const { bookings, user } = useOutletContext();
  const activeBookings = bookings.filter((booking) => booking.status === "in-progress");
  const today = new Date().toISOString().slice(0, 10);
  const todayBookings = bookings.filter((booking) => String(booking.booking_date).slice(0, 10) === today);
  const stats = [
    ["New service requests", bookings.filter((booking) => booking.status === "pending").length, "Booking requests", "dot-1"],
    ["Today's appointments", todayBookings.length, "Appointments today", "dot-2"],
    ["Active services", activeBookings.length, "Vehicles being serviced", "dot-3"],
    ["Completed services", bookings.filter((booking) => booking.status === "completed").length, "Completed requests", "dot-0"],
    ["Pending invoices", "—", "Connect invoices to track payments", "dot-1"],
    ["Monthly revenue", "—", "Invoice data not available", "dot-2"]
  ];

  return (
    <>
      <section className="garage-welcome" aria-labelledby="garage-title"><div><p className="garage-eyebrow">SERVICE THAT KEEPS PEOPLE MOVING</p><h1 id="garage-title">Welcome back, {user?.name || "garage team"}<span>.</span></h1><p>Manage your service bookings, vehicles, customers, and ongoing repairs.</p></div><Link className="garage-button" to="/garage/update">Send an update <span aria-hidden="true">↗</span></Link></section>
      <section className="garage-stats garage-stats-wide" aria-label="Garage summary">{stats.map(([label, count, note, dot]) => <article className="garage-stat" key={label}><div><span>{label}</span><span className={`garage-stat-dot ${dot}`} aria-hidden="true" /></div><strong>{count}</strong><p>{note}</p></article>)}</section>
      <section className="garage-panel garage-requests" aria-labelledby="schedule-title"><div className="garage-panel-heading"><div><p className="garage-eyebrow">TODAY'S SERVICE SCHEDULE</p><h2 id="schedule-title">Today's appointments</h2></div><Link className="garage-count" to="/garage/requests">View all {bookings.length}</Link></div><div className="garage-table-wrap"><table><thead><tr><th>Time</th><th>Customer</th><th>Vehicle</th><th>Service</th><th>Status</th><th>Action</th></tr></thead><tbody>{todayBookings.length === 0 ? <tr><td colSpan="6"><div className="garage-empty"><strong>No appointments scheduled today.</strong><p>New bookings will appear here when they are requested for today.</p></div></td></tr> : todayBookings.map((booking) => <tr key={booking.id}><td>{new Date(booking.booking_date).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</td><td><span className="garage-customer-name">{booking.client_name || "Client"}</span><span className="garage-customer-email">{booking.client_email || "—"}</span></td><td>{booking.vehicle_id}</td><td>{booking.service_type}</td><td><span className={`garage-status garage-status-${booking.status}`}>{booking.status?.replace(/-/g, " ")}</span></td><td><Link className="garage-table-action" to="/garage/requests">View</Link></td></tr>)}</tbody></table></div></section>
      <section className="garage-panel garage-queue garage-overview-active" aria-labelledby="active-overview-title"><div className="garage-panel-heading"><div><p className="garage-eyebrow">ACTIVE SERVICES OVERVIEW</p><h2 id="active-overview-title">Vehicles in the garage</h2></div><Link className="garage-count" to="/garage/active">Manage service</Link></div>{activeBookings.length === 0 ? <div className="garage-queue-empty"><strong>No active services.</strong><p>Bookings marked in progress will appear here.</p></div> : <div className="garage-queue-list">{activeBookings.slice(0, 4).map((booking) => <Link key={booking.id} to="/garage/active"><span className="garage-job-id">#{booking.id}</span><div><strong>{booking.vehicle_id}</strong><small>{booking.client_name || "Client"} · {booking.service_type}</small></div><span aria-hidden="true">↗</span></Link>)}</div>}</section>
    </>
  );
}

function RequestsPage() {
  const { bookings, changeStatus, savingId } = useOutletContext();
  return <section className="garage-panel garage-requests garage-page-panel" aria-labelledby="requests-title"><div className="garage-page-heading"><p className="garage-eyebrow">EVERY REQUEST, ONE WORKSPACE</p><h1 id="requests-title">Customer service requests<span>.</span></h1><p>Review every booking and keep its status current.</p></div><div className="garage-table-wrap"><table><thead><tr><th>Booking</th><th>Customer</th><th>Vehicle</th><th>Service</th><th>Date</th><th>Status</th><th>Change status</th></tr></thead><tbody>{bookings.length === 0 ? <tr><td colSpan="7"><div className="garage-empty"><strong>Ready for your next customer.</strong><p>New service requests will appear here when customers book.</p></div></td></tr> : bookings.map((booking) => <tr key={booking.id}><td><strong>#{booking.id}</strong></td><td><span className="garage-customer-name">{booking.client_name || "Client"}</span><span className="garage-customer-email">{booking.client_email || "—"}</span></td><td>{booking.vehicle_id}</td><td>{booking.service_type}</td><td>{String(booking.booking_date).slice(0, 10)}</td><td><span className={`garage-status garage-status-${booking.status}`}>{booking.status?.replace(/-/g, " ")}</span></td><td><select className="garage-status-select" aria-label={`Change status for booking ${booking.id}`} value={booking.status} onChange={(event) => changeStatus(booking.id, event.target.value)} disabled={savingId !== null}>{STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status.replace(/-/g, " ")}</option>)}</select>{savingId === booking.id && <small className="garage-saving" role="status">Saving...</small>}</td></tr>)}</tbody></table></div></section>;
}

function UpdatePage() {
  const { bookings, updateForm, setUpdateForm, handleUpdateSubmit, savingId } = useOutletContext();
  return <section className="garage-panel garage-page-panel" aria-labelledby="update-title"><div className="garage-page-heading"><p className="garage-eyebrow">KEEP CUSTOMERS IN THE LOOP</p><h1 id="update-title">Send a progress update<span>.</span></h1><p>Share the latest work, estimated time, and service status with your customer.</p></div><form className="garage-form" onSubmit={handleUpdateSubmit} aria-busy={savingId !== null}><div><label htmlFor="garage-booking">Booking</label><select id="garage-booking" value={updateForm.booking_id} onChange={(event) => setUpdateForm((prev) => ({ ...prev, booking_id: event.target.value }))} required disabled={savingId !== null}><option value="">Select a customer booking</option>{bookings.map((booking) => <option key={booking.id} value={booking.id}>#{booking.id} — {booking.client_name || "Client"} ({booking.service_type})</option>)}</select></div><div><label htmlFor="garage-message">Progress message</label><textarea id="garage-message" rows="5" value={updateForm.message} onChange={(event) => setUpdateForm((prev) => ({ ...prev, message: event.target.value }))} placeholder="Let your customer know what's been done and what comes next." required disabled={savingId !== null} /></div><div className="garage-update-details"><fieldset className="garage-eta"><legend>Estimated time remaining <span>(optional)</span></legend><div><input aria-label="Estimated time amount" type="number" min="1" value={updateForm.eta_value} onChange={(event) => setUpdateForm((prev) => ({ ...prev, eta_value: event.target.value }))} placeholder="e.g. 5" disabled={savingId !== null} /><select aria-label="Estimated time unit" value={updateForm.eta_unit} onChange={(event) => setUpdateForm((prev) => ({ ...prev, eta_unit: event.target.value }))} disabled={savingId !== null}><option value="hours">Hours</option><option value="days">Days</option></select></div></fieldset><div><label htmlFor="garage-update-status">Service status</label><select id="garage-update-status" value={updateForm.status} onChange={(event) => setUpdateForm((prev) => ({ ...prev, status: event.target.value }))} disabled={savingId !== null}>{STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status.replace(/-/g, " ")}</option>)}</select></div></div><button className="garage-button" type="submit" disabled={savingId !== null || !bookings.length}>{savingId === Number(updateForm.booking_id) ? "Sending..." : "Send update to customer"}<span aria-hidden="true">↗</span></button><p className="garage-form-note">Updates will appear in your customer's service progress.</p></form></section>;
}

function ActivePage() {
  const { bookings } = useOutletContext();
  const activeBookings = bookings.filter((booking) => booking.status === "in-progress");
  return <section className="garage-panel garage-page-panel" aria-labelledby="active-title"><div className="garage-page-heading"><p className="garage-eyebrow">ON YOUR WORKBENCH</p><h1 id="active-title">Active service work<span>.</span></h1><p>Vehicles currently inside the garage and being serviced.</p></div>{activeBookings.length === 0 ? <div className="garage-queue-empty"><strong>Your workbench is clear.</strong><p>Bookings marked in progress will appear here.</p><Link to="/garage/requests">Review service requests ↗</Link></div> : <div className="garage-active-grid">{activeBookings.map((booking) => <article className="garage-active-card" key={booking.id}><span className="garage-job-id">#{booking.id}</span><h2>{booking.vehicle_id}</h2><p><strong>Customer:</strong> {booking.client_name || "Client"}</p><p><strong>Service:</strong> {booking.service_type}</p><span className="garage-status garage-status-in-progress">Repair in progress</span><div className="garage-progress"><span style={{ width: "65%" }} /></div><p className="garage-progress-label">Progress <strong>65%</strong></p><p className="garage-active-meta">Expected completion: <strong>To be confirmed</strong></p><Link className="garage-button" to="/garage/update">Manage service <span aria-hidden="true">↗</span></Link></article>)}</div>}</section>;
}

export default function GarageDashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [updateForm, setUpdateForm] = useState({ booking_id: "", message: "", eta_value: "", eta_unit: "hours", status: "in-progress" });

  const loadBookings = async () => { try { setBookings(await getBookings()); } catch (err) { setError(err.message); } };
  useEffect(() => { loadBookings(); }, []);
  const changeStatus = async (bookingId, status) => { setSavingId(bookingId); setError(""); try { await updateBookingStatus(bookingId, status); await loadBookings(); } catch (err) { setError(err.message); } finally { setSavingId(null); } };
  const handleUpdateSubmit = async (event) => { event.preventDefault(); setError(""); if (!updateForm.booking_id || !updateForm.message.trim()) { setError("Please select a booking and enter update message."); return; } setSavingId(Number(updateForm.booking_id)); try { await createBookingUpdate(updateForm.booking_id, { garage_id: user?.id, message: updateForm.message, eta_value: updateForm.eta_value ? Number(updateForm.eta_value) : null, eta_unit: updateForm.eta_unit, status: updateForm.status }); setUpdateForm((prev) => ({ ...prev, message: "", eta_value: "" })); await loadBookings(); } catch (err) { setError(err.message); } finally { setSavingId(null); } };
  const onLogout = () => { logout(); navigate("/"); };
  const context = { bookings, user, updateForm, setUpdateForm, handleUpdateSubmit, changeStatus, savingId };

  return <GarageShell bookings={bookings} user={user} onLogout={onLogout} error={error} context={context} />;
}

export { GarageShell, Overview, RequestsPage, UpdatePage, ActivePage };
