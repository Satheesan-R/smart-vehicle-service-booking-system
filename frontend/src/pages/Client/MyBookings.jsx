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
  const [search, setSearch] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [month, setMonth] = useState("");
  const [status, setStatus] = useState("all");
  const [reload, setReload] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError("");
    getBookings(user.id).then(data => { if (!cancelled) setBookings(data); })
      .catch(err => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user.id, reload]);
  const filtered = bookings.filter(b => (status === "all" || b.status === status) && (!vehicle || b.vehicle_id === vehicle) && (!month || String(b.booking_date).startsWith(month)) && [b.id, b.vehicle_id, b.service_type].some(value => String(value).toLowerCase().includes(search.trim().toLowerCase())));
  return <div className="client-dashboard history-page">
    <aside className="client-sidebar"><Link className="client-brand" to="/"><span className="client-brand-mark">S.</span><span>AutoCare<small>CUSTOMER PORTAL</small></span></Link><p className="client-nav-label">YOUR SERVICE WORKSPACE</p><nav aria-label="Customer navigation"><Link to="/client">Dashboard</Link><Link to="/client/book">Book Service</Link><Link to="/client/bookings" aria-current="page">Booking Details</Link></nav><div className="client-account"><div><strong>{user.name}</strong><small>Customer account</small></div><button onClick={() => { logout(); navigate("/"); }}>Log out</button></div></aside>
    <main className="client-main"><header className="client-topbar"><span>AutoCare / Booking History</span><span>{user.name}</span></header><section className="history-heading"><div><p className="client-eyebrow">YOUR SERVICE RECORDS</p><h1>My Bookings</h1><p>View your service requests, garage updates, and past bookings.</p></div><Link className="client-button" to="/client/book">+ Book New Service</Link></section>
    <div aria-live="polite">{loading && <p className="history-notice">Loading your bookings...</p>}{error && <div className="client-error" role="alert">{error} <button type="button" onClick={() => setReload(value => value + 1)}>Try again</button></div>}</div><section className="history-stats" aria-label="Booking summary">{[["Vehicles booked", new Set(bookings.map(b => b.vehicle_id)).size], ["Pending requests", bookings.filter(b => b.status === "pending").length], ["In progress", bookings.filter(b => b.status === "in-progress").length], ["Completed", bookings.filter(b => b.status === "completed").length]].map(([label, value]) => <article key={label}><span aria-hidden="true">▦</span><div><small>{label}</small><strong>{loading || error ? "—" : value}</strong></div></article>)}</section>
<section className="history-filters" aria-label="Filter bookings"><div className="history-tabs">{[["all", "All"], ["pending", "Pending"], ["in-progress", "In Progress"], ["completed", "Completed"]].map(([value, label]) => <button type="button" key={value} aria-pressed={status === value} onClick={() => setStatus(value)}>{label} <span>{bookings.filter(b => value === "all" || b.status === value).length}</span></button>)}</div><div className="history-filter-fields"><input type="search" aria-label="Search bookings" placeholder="Search booking, vehicle or service..." value={search} onChange={e => setSearch(e.target.value)} /><input type="month" aria-label="Filter by booking month" value={month} onChange={e => setMonth(e.target.value)} /><select aria-label="Filter by vehicle" value={vehicle} onChange={e => setVehicle(e.target.value)}><option value="">All Vehicles</option>{[...new Set(bookings.map(b => b.vehicle_id))].map(v => <option key={v} value={v}>{v}</option>)}</select><button type="button" onClick={() => { setSearch(""); setMonth(""); setVehicle(""); setStatus("all"); }}>Reset</button></div><p className="history-record-count" aria-live="polite">Showing {filtered.length} of {bookings.length} records</p></section>{/* HISTORY_CONTENT */}
    </main>
  </div>;
}




