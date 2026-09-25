import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../auth";
import { createBooking, getBookingUpdates, getBookings } from "../services/api";

import "./ClientDashboard.css";

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
    <div className="client-dashboard">
      <aside className="client-sidebar">
        <Link className="client-brand" to="/" aria-label="Smart Vehicle Service home"><span className="client-brand-mark">S.</span><span>SMART VEHICLE<small>SERVICE & CARE</small></span></Link>
        <p className="client-nav-label">YOUR WORKSPACE</p>
        <nav aria-label="Dashboard navigation">
          <a href="#client-overview">Overview <span aria-hidden="true">↗</span></a>
          <a href="#client-book">Book a service <span aria-hidden="true">+</span></a>
          <a href="#client-requests">My requests <span>{bookings.length}</span></a>
          <a href="#client-progress">Service updates <span aria-hidden="true">↗</span></a>
        </nav>
        <div className="client-sidebar-note"><span aria-hidden="true">↗</span><h2>Keep your journey moving.</h2><p>Your next service is just a few details away.</p><a href="#client-book">Book your next visit →</a></div>
        <div className="client-account"><span className="client-avatar" aria-hidden="true">{user?.name?.charAt(0).toUpperCase() || "C"}</span><div><strong>{user?.name || "Vehicle owner"}</strong><small>Client account</small></div><button type="button" onClick={onLogout}>Log out</button></div>
      </aside>
      <main className="client-main" id="client-overview">
        <header className="client-topbar"><span>Workspace <span aria-hidden="true">/</span> <strong>Overview</strong></span><span className="client-account-tag">VEHICLE OWNER</span></header>
        <section className="client-welcome" aria-labelledby="client-title"><div><p className="client-eyebrow">YOUR SERVICE, SIMPLIFIED</p><h1 id="client-title">Welcome back, {user?.name?.split(" ")[0] || "there"}<span>.</span></h1><p>Here's what's happening with your vehicle care.</p></div><a className="client-button" href="#client-book">Book a service <span aria-hidden="true">+</span></a></section>
        {error && <p className="client-error" role="alert">{error}</p>}
        <section className="client-stats" aria-label="Booking summary">
          {[["Total requests", bookings.length, "Your service history"], ["Pending", bookings.filter(b => b.status === "pending").length, "Awaiting garage review"], ["In progress", bookings.filter(b => b.status === "in-progress").length, "Getting the care it needs"], ["Completed", bookings.filter(b => b.status === "completed").length, "Service completed"]].map(([label, count, note], index) => <article className="client-stat" key={label}><div><span>{label}</span><span className={`client-stat-dot dot-${index}`} aria-hidden="true" /></div><strong>{count}</strong><p>{note}</p></article>)}
        </section>
        <div className="client-workspace-grid">
          <section className="client-panel client-booking" id="client-book" aria-labelledby="client-book-title">
            <div className="client-panel-heading"><div><p className="client-eyebrow">PLAN YOUR NEXT VISIT</p><h2 id="client-book-title">Book a service</h2></div><span className="client-panel-symbol" aria-hidden="true">+</span></div>
            <p className="client-panel-description">Tell us about your vehicle and the care it needs.</p>
            <form className="client-form" onSubmit={handleSubmit} aria-busy={loading}>
              <div><label htmlFor="client-vehicle">Vehicle details / number</label><input id="client-vehicle" name="vehicle_id" value={form.vehicle_id} onChange={(e) => setForm(prev => ({ ...prev, vehicle_id: e.target.value }))} placeholder="KA-01-AB-1234 / Honda City" required disabled={loading} /></div>
              <div><label htmlFor="client-service">Service type</label><select id="client-service" name="service_type" value={form.service_type} onChange={(e) => setForm(prev => ({ ...prev, service_type: e.target.value }))} required disabled={loading}>{SERVICES.map(service => <option key={service} value={service}>{service}</option>)}</select></div>
              <div><label htmlFor="client-date">Preferred booking date</label><input id="client-date" type="date" name="booking_date" value={form.booking_date} onChange={(e) => setForm(prev => ({ ...prev, booking_date: e.target.value }))} required disabled={loading} /></div>
              <button className="client-button" type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit service request"}<span aria-hidden="true">↗</span></button>
              <p className="client-form-note">Follow your request below after submitting.</p>
            </form>
          </section>
          <section className="client-panel client-services" aria-labelledby="client-services-title"><p className="client-eyebrow">CARE FOR EVERY MILE</p><h2 id="client-services-title">What can we help with?</h2><p className="client-panel-description">Choose a service to get your booking started.</p><div className="client-service-list">{SERVICES.map((service, index) => <a key={service} href="#client-book" onClick={() => setForm(prev => ({ ...prev, service_type: service }))}><span className="client-service-number">0{index + 1}</span><span>{service}</span><span aria-hidden="true">↗</span></a>)}</div><div className="client-service-note"><strong>A little care goes a long way.</strong><p>Regular maintenance helps you stay ready for the road ahead.</p></div></section>
        </div>
        <section className="client-panel client-requests" id="client-requests" aria-labelledby="client-requests-title">
          <div className="client-panel-heading"><div><p className="client-eyebrow">EVERY VISIT, IN ONE PLACE</p><h2 id="client-requests-title">My service requests</h2></div><span className="client-count">{bookings.length} requests</span></div>
          <div className="client-table-wrap"><table><thead><tr><th scope="col">Booking</th><th scope="col">Vehicle</th><th scope="col">Service</th><th scope="col">Date</th><th scope="col">Status</th></tr></thead><tbody>{bookings.length === 0 ? <tr><td colSpan="5"><div className="client-empty"><strong>Your service journey starts here.</strong><p>Your bookings will appear here once you submit a request.</p><a href="#client-book">Book your first service ↗</a></div></td></tr> : bookings.map(booking => <tr key={booking.id}><td><strong>#{booking.id}</strong></td><td>{booking.vehicle_id}</td><td>{booking.service_type}</td><td>{String(booking.booking_date).slice(0, 10)}</td><td><span className={`client-status client-status-${booking.status}`}>{booking.status?.replace(/-/g, " ")}</span></td></tr>)}</tbody></table></div>
        </section>
        <section className="client-progress" id="client-progress" aria-labelledby="client-progress-title"><div className="client-panel-heading"><div><p className="client-eyebrow">STAY IN THE LOOP</p><h2 id="client-progress-title">Service progress</h2></div></div>
          {bookings.length === 0 ? <p className="client-progress-empty">Garage updates will appear here when your service journey begins.</p> : <div className="client-timeline-grid">{bookings.map(booking => {
            const updates = updatesByBooking[booking.id] || [];
            return <article className="client-timeline" key={booking.id}><div className="client-timeline-heading"><h3>Booking #{booking.id}</h3><span>{booking.service_type}</span></div>{updates.length === 0 ? <p className="client-no-updates">No updates from your garage yet.</p> : <ul>{updates.map(update => <li key={update.id}><p>{update.message}</p><small>{update.eta_value && update.eta_unit ? `ETA: ${update.eta_value} ${update.eta_unit}` : "ETA: Not specified"}<span aria-hidden="true"> · </span>{new Date(update.created_at).toLocaleString()}</small></li>)}</ul>}</article>;
          })}</div>}
        </section>
        <footer className="client-footer"><span>Smart Vehicle Service</span><span>Better care. Every journey.</span></footer>
      </main>
    </div>
  );
}
