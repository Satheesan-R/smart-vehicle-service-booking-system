import { useEffect, useState } from "react";
import { getBookings, getBookingUpdates } from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../../auth";
import "../ClientDashboard.css";
import "./MyBookings.css";

export default function MyBookings() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updates, setUpdates] = useState([]);
  const [updatesLoading, setUpdatesLoading] = useState(false);
  const [updatesError, setUpdatesError] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [month, setMonth] = useState("");
  const [status, setStatus] = useState("all");
  const [reload, setReload] = useState(0);
  useEffect(() => {
    let cancelled = false;

    getBookings(user.id).then(data => { if (!cancelled) setBookings(data); })
      .catch(err => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user.id, reload]);
  useEffect(() => {
    if (expanded === null) return;
    let cancelled = false;

    getBookingUpdates(expanded).then(data => { if (!cancelled) setUpdates(data); })
      .catch(err => { if (!cancelled) setUpdatesError(err.message); })
      .finally(() => { if (!cancelled) setUpdatesLoading(false); });
    return () => { cancelled = true; };
  }, [expanded]);
  const filtered = bookings.filter(b => (status === "all" || b.status === status) && (!vehicle || b.vehicle_id === vehicle) && (!month || String(b.booking_date).startsWith(month)) && [b.id, b.vehicle_id, b.service_type].some(value => String(value).toLowerCase().includes(search.trim().toLowerCase())));
  function exportCsv() {
    const escape = value => {
      const text = String(value ?? "");
      const safe = /^[=+@\-\t\r\n]/.test(text) ? "'" + text : text;
      return '"' + safe.replace(/"/g, '""') + '"';
    };
    const rows = [["Booking ID", "Vehicle", "Service", "Date", "Status"], ...filtered.map(b => [b.id, b.vehicle_id, b.service_type, String(b.booking_date).slice(0, 10), b.status])];
    const blob = new Blob(["\uFEFF" + rows.map(row => row.map(escape).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "autocare-bookings.csv"; document.body.appendChild(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div className="client-dashboard history-page">
    <aside className="client-sidebar"><Link className="client-brand" to="/"><span className="client-brand-mark">S.</span><span>AutoCare<small>CUSTOMER PORTAL</small></span></Link><p className="client-nav-label">YOUR SERVICE WORKSPACE</p><nav aria-label="Customer navigation"><Link to="/client">Dashboard</Link><Link to="/client/book">Book Service</Link><Link to="/client/bookings" aria-current="page">Booking Details</Link></nav><div className="client-account"><div><strong>{user.name}</strong><small>Customer account</small></div><button onClick={() => { logout(); navigate("/"); }}>Log out</button></div></aside>
    <main className="client-main"><header className="client-topbar"><span>AutoCare / Booking History</span><span>{user.name}</span></header><section className="history-heading"><div><p className="client-eyebrow">YOUR SERVICE RECORDS</p><h1>My Bookings</h1><p>View your service requests, garage updates, and past bookings.</p></div><div className="history-heading-actions"><button type="button" onClick={exportCsv} disabled={loading || !!error || !filtered.length}>Export Logs ↓</button><Link className="client-button" to="/client/book">+ Book New Service</Link></div></section>
    <div aria-live="polite">{loading && <p className="history-notice">Loading your bookings...</p>}{error && <div className="client-error" role="alert">{error} <button type="button" onClick={() => { setLoading(true); setError(""); setReload(value => value + 1); }}>Try again</button></div>}</div><section className="history-stats" aria-label="Booking summary">{[["Vehicles booked", new Set(bookings.map(b => b.vehicle_id)).size], ["Pending requests", bookings.filter(b => b.status === "pending").length], ["In progress", bookings.filter(b => b.status === "in-progress").length], ["Completed", bookings.filter(b => b.status === "completed").length]].map(([label, value]) => <article key={label}><span aria-hidden="true">▦</span><div><small>{label}</small><strong>{loading || error ? "—" : value}</strong></div></article>)}</section>
<section className="history-filters" aria-label="Filter bookings"><div className="history-tabs">{[["all", "All"], ["pending", "Pending"], ["in-progress", "In Progress"], ["completed", "Completed"]].map(([value, label]) => <button type="button" key={value} aria-pressed={status === value} onClick={() => setStatus(value)}>{label} <span>{bookings.filter(b => value === "all" || b.status === value).length}</span></button>)}</div><div className="history-filter-fields"><input type="search" aria-label="Search bookings" placeholder="Search booking, vehicle or service..." value={search} onChange={e => setSearch(e.target.value)} /><input type="month" aria-label="Filter by booking month" value={month} onChange={e => setMonth(e.target.value)} /><select aria-label="Filter by vehicle" value={vehicle} onChange={e => setVehicle(e.target.value)}><option value="">All Vehicles</option>{[...new Set(bookings.map(b => b.vehicle_id))].map(v => <option key={v} value={v}>{v}</option>)}</select><button type="button" onClick={() => { setSearch(""); setMonth(""); setVehicle(""); setStatus("all"); }}>Reset</button></div><p className="history-record-count" aria-live="polite">Showing {filtered.length} of {bookings.length} records</p></section>{!loading && !error && <div className="history-list">{filtered.length === 0 ? <section className="client-panel history-empty"><h2>No bookings found</h2><p>Try adjusting the filters or book your next service.</p><Link to="/client/book">Book a service →</Link></section> : filtered.map(booking => <article className={`history-card history-${booking.status}`} key={booking.id}><div className="history-card-main"><span className="history-icon" aria-hidden="true">{booking.status === "completed" ? "✓" : booking.status === "in-progress" ? "⚙" : "◷"}</span><div><div className="history-card-meta"><span>BK-{String(booking.id).padStart(5, "0")}</span><span className={`client-status client-status-${booking.status}`}>{booking.status.replace(/-/g, " ")}</span></div><h2>{booking.service_type}</h2><p>{booking.vehicle_id}</p><time>{String(booking.booking_date).slice(0, 10)}</time></div></div><div className="history-actions"><button type="button" aria-expanded={expanded === booking.id} aria-controls={`details-${booking.id}`} onClick={() => { setUpdates([]); setUpdatesError(""); setUpdatesLoading(true); setExpanded(expanded === booking.id ? null : booking.id); }}>{expanded === booking.id ? "Hide Details" : "View Details"}</button><Link to="/client/book" state={{ rebook: { vehicle_id: booking.vehicle_id, service_type: booking.service_type } }}>Book Again</Link></div><section className="history-details" id={`details-${booking.id}`} hidden={expanded !== booking.id}><h3>Booking Details</h3><dl><div><dt>Vehicle</dt><dd>{booking.vehicle_id}</dd></div><div><dt>Service</dt><dd>{booking.service_type}</dd></div><div><dt>Requested date</dt><dd>{String(booking.booking_date).slice(0, 10)}</dd></div><div><dt>Status</dt><dd>{booking.status.replace(/-/g, " ")}</dd></div></dl><h3>Garage Progress Updates</h3>{expanded === booking.id && <div aria-live="polite">{updatesLoading ? <p>Loading updates...</p> : updatesError ? <p role="alert">{updatesError}</p> : updates.length ? <ul className="history-updates">{updates.map(update => <li key={update.id}><strong>{update.garage_name || "Garage update"}</strong><p>{update.message}</p><small>{new Date(update.created_at).toLocaleString()}{update.eta_value && update.eta_unit ? ` · Estimated time: ${update.eta_value} ${update.eta_unit}` : ""}</small></li>)}</ul> : <p>No garage updates yet.</p>}</div>}</section></article>)}</div>}
    </main>
  </div>;
}










