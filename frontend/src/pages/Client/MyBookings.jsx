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
  const [reload, setReload] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError("");
    getBookings(user.id).then(data => { if (!cancelled) setBookings(data); })
      .catch(err => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user.id, reload]);
  return <div className="client-dashboard history-page">
    <aside className="client-sidebar"><Link className="client-brand" to="/"><span className="client-brand-mark">S.</span><span>AutoCare<small>CUSTOMER PORTAL</small></span></Link><p className="client-nav-label">YOUR SERVICE WORKSPACE</p><nav aria-label="Customer navigation"><Link to="/client">Dashboard</Link><Link to="/client/book">Book Service</Link><Link to="/client/bookings" aria-current="page">Booking Details</Link></nav><div className="client-account"><div><strong>{user.name}</strong><small>Customer account</small></div><button onClick={() => { logout(); navigate("/"); }}>Log out</button></div></aside>
    <main className="client-main"><header className="client-topbar"><span>AutoCare / Booking History</span><span>{user.name}</span></header><section className="history-heading"><div><p className="client-eyebrow">YOUR SERVICE RECORDS</p><h1>My Bookings</h1><p>View your service requests, garage updates, and past bookings.</p></div><Link className="client-button" to="/client/book">+ Book New Service</Link></section>
    <div aria-live="polite">{loading && <p className="history-notice">Loading your bookings...</p>}{error && <div className="client-error" role="alert">{error} <button type="button" onClick={() => setReload(value => value + 1)}>Try again</button></div>}</div>{/* HISTORY_CONTENT */}
    </main>
  </div>;
}

