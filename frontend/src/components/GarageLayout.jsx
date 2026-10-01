import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../auth";
import { createBookingUpdate, getBookings, updateBookingStatus } from "../services/api";
import { STATUS_OPTIONS } from "../pages/Garage/garageConstants";
import "../pages/GarageDashboard.css";

export default function GarageLayout() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [updateForm, setUpdateForm] = useState({ booking_id: "", message: "", eta_value: "", eta_unit: "hours", status: "in-progress" });

  const loadBookings = async () => {
    try { setBookings(await getBookings()); } catch (err) { setError(err.message); }
  };
  useEffect(() => { loadBookings(); }, []);

  const changeStatus = async (bookingId, status) => {
    setSavingId(bookingId); setError("");
    try { await updateBookingStatus(bookingId, status); await loadBookings(); }
    catch (err) { setError(err.message); }
    finally { setSavingId(null); }
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault(); setError("");
    if (!updateForm.booking_id || !updateForm.message.trim()) { setError("Please select a booking and enter update message."); return; }
    setSavingId(Number(updateForm.booking_id));
    try {
      await createBookingUpdate(updateForm.booking_id, { garage_id: user?.id, message: updateForm.message, eta_value: updateForm.eta_value ? Number(updateForm.eta_value) : null, eta_unit: updateForm.eta_unit, status: updateForm.status });
      setUpdateForm((prev) => ({ ...prev, message: "", eta_value: "" }));
      await loadBookings();
    } catch (err) { setError(err.message); }
    finally { setSavingId(null); }
  };

  const context = { bookings, user, updateForm, setUpdateForm, handleUpdateSubmit, changeStatus, savingId };
  const onLogout = () => { logout(); navigate("/"); };

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
          <NavLink to="/garage/settings">Settings <span aria-hidden="true">⚙</span></NavLink>
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
