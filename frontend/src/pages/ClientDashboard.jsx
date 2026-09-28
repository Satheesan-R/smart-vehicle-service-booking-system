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
  const [search, setSearch] = useState("");
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

  const activeBookings = bookings.filter(booking => booking.status === "in-progress");
  const pendingBookings = bookings.filter(booking => booking.status === "pending");
  const completedBookings = bookings.filter(booking => booking.status === "completed");
  const today = new Date();
  const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const nextBooking = [...pendingBookings].filter(booking => String(booking.booking_date).slice(0, 10) >= localDate).sort((a, b) => String(a.booking_date).localeCompare(String(b.booking_date)))[0];
  const filteredBookings = bookings.filter(booking => [booking.id, booking.vehicle_id, booking.service_type, booking.status].some(value => String(value).toLowerCase().includes(search.trim().toLowerCase())));
  const vehicles = [...new Set(bookings.map(booking => booking.vehicle_id).filter(Boolean))];
  const recentUpdates = bookings.flatMap(booking => (updatesByBooking[booking.id] || []).map(update => ({ ...update, bookingId: booking.id, service: booking.service_type }))).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 4);
  return (
    <div className="client-dashboard">
      <aside className="client-sidebar">
        <Link className="client-brand" to="/" aria-label="Smart Vehicle Service home"><span className="client-brand-mark">S.</span><span>AutoCare<small>CUSTOMER PORTAL</small></span></Link>
        <p className="client-nav-label">YOUR SERVICE WORKSPACE</p>
        <nav aria-label="Dashboard navigation">
          <a href="#client-overview">Dashboard <span aria-hidden="true">↗</span></a>
          <a href="#client-vehicles">My Vehicles <span aria-hidden="true">▣</span></a><a href="#client-book">Book a service <span aria-hidden="true">+</span></a>
          <a href="#client-requests">My Bookings <span>{bookings.length}</span></a>
          <a href="#client-progress">Service updates <span aria-hidden="true">↗</span></a>
        </nav>
        <div className="client-account"><span className="client-avatar" aria-hidden="true">{user?.name?.charAt(0).toUpperCase() || "C"}</span><div><strong>{user?.name || "Vehicle owner"}</strong><small>Client account</small></div><button type="button" onClick={onLogout}>Log out</button></div>
      </aside>
      <main className="client-main" id="client-overview">
        <header className="client-topbar"><label className="client-search"><span aria-hidden="true">⌕</span><input type="search" aria-label="Search bookings by vehicle, service or booking ID" placeholder="Search vehicle, service, or booking ID..." value={search} onChange={event => setSearch(event.target.value)} /></label><div className="client-topbar-user"><span className="client-avatar" aria-hidden="true">{user?.name?.charAt(0).toUpperCase() || "C"}</span><span>{user?.name || "Vehicle owner"}<small>Customer account</small></span></div></header>
        <section className="client-welcome" aria-labelledby="client-title"><div><p className="client-eyebrow">OPERATIONAL HUB · CLIENT PORTAL</p><h1 id="client-title">Welcome back, {user?.name || "there"}<span>.</span></h1><p>Manage your vehicle services, bookings, and service history from one place.</p></div><a className="client-button" href="#client-book">Book New Service <span aria-hidden="true">+</span></a></section>
        {error && <p className="client-error" role="alert">{error}</p>}
        <section className="client-stats" aria-label="Booking summary">{[["Upcoming Bookings", pendingBookings.filter(b => String(b.booking_date).slice(0, 10) >= localDate).length, "Preferred dates ahead", "▦"], ["Active Services", activeBookings.length, "Service work in progress", "⚙"], ["Completed Services", completedBookings.length, "Your completed bookings", "✓"], ["Pending Bookings", pendingBookings.length, "Awaiting garage review", "☷"]].map(([label, count, note, icon]) => <article className="client-stat" key={label}><span className="client-summary-icon" aria-hidden="true">{icon}</span><strong>{count}</strong><h2>{label}</h2><p>{note}</p></article>)}</section>        <div className="client-overview-grid">
          <div className="client-overview-main">
            <section className="client-panel client-live-service" aria-labelledby="client-live-title"><div className="client-live-heading"><div><p className="client-eyebrow">SERVICE IN PROGRESS</p><h2 id="client-live-title">{activeBookings[0]?.vehicle_id || "Service progress"}</h2><p>{activeBookings[0]?.service_type || "Track your vehicle's journey with your garage."}</p></div><span className="client-count">{activeBookings.length ? "In progress" : "No active service"}</span></div>
              {activeBookings.length ? <><div className="client-workflow-label"><strong>Service workflow</strong><span>Booking #{activeBookings[0].id}</span></div><ol className="client-workflow"><li className="done"><small>STEP 01</small><strong>Request received</strong><span>Submitted</span></li><li className="current" aria-current="step"><small>STEP 02</small><strong>Service in progress</strong><span>With your garage</span></li><li><small>STEP 03</small><strong>Completed</strong><span>Awaiting completion</span></li></ol><div className="client-active-message"><strong>Latest garage update</strong><p>{[...(updatesByBooking[activeBookings[0].id] || [])].sort((a,b) => new Date(b.created_at) - new Date(a.created_at))[0]?.message || "Your garage has not posted an update yet."}</p></div><a className="client-button" href="#client-progress">View all service updates →</a></> : <div className="client-empty"><strong>Ready when you are.</strong><p>Your service workflow appears here when a garage starts work on your booking.</p><a href="#client-vehicles">My Vehicles <span aria-hidden="true">▣</span></a><a href="#client-book">Book a service →</a></div>}
            </section>
            <section className="client-panel client-next-service" aria-labelledby="client-next-title"><div className="client-panel-heading"><div><h2 id="client-next-title">Upcoming Service</h2><p className="client-panel-description">Your next preferred service date.</p></div><span className="client-count">{nextBooking ? "Pending review" : "No upcoming request"}</span></div>{nextBooking ? <><div className="client-next-details"><div><small>VEHICLE</small><strong>{nextBooking.vehicle_id}</strong></div><div><small>SERVICE</small><strong>{nextBooking.service_type}</strong></div><div><small>REQUESTED DATE</small><strong>{String(nextBooking.booking_date).slice(0,10)}</strong></div></div><a className="client-button" href="#client-requests">View booking details →</a></> : <p className="client-no-updates">No upcoming pending bookings. Choose a date using the booking form below.</p>}</section>
          </div>

        </div>        <section className="client-panel client-requests" id="client-requests" aria-labelledby="client-requests-title">
          <div className="client-panel-heading"><div><p className="client-eyebrow">YOUR BOOKING HISTORY</p><h2 id="client-requests-title">Recent Bookings</h2></div><span className="client-count">{bookings.length} requests</span></div>
          <div className="client-table-wrap"><table><thead><tr><th scope="col">Booking</th><th scope="col">Vehicle</th><th scope="col">Service</th><th scope="col">Date</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead><tbody>{filteredBookings.length === 0 ? <tr><td colSpan="6"><div className="client-empty"><strong>No matching bookings.</strong><p>Try another search or create a new service request.</p><a href="#client-book">Book your first service ↗</a></div></td></tr> : filteredBookings.map(booking => <tr key={booking.id}><td><strong>#{booking.id}</strong></td><td>{booking.vehicle_id}</td><td>{booking.service_type}</td><td>{String(booking.booking_date).slice(0, 10)}</td><td><span className={`client-status client-status-${booking.status}`}>{booking.status?.replace(/-/g, " ")}</span></td><td><a className="client-table-action" href={`#booking-progress-${booking.id}`}>{booking.status === "in-progress" ? "Track Service" : "View Details"}</a></td></tr>)}</tbody></table></div>
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
        <section className="client-progress" id="client-progress" aria-labelledby="client-progress-title"><div className="client-panel-heading"><div><p className="client-eyebrow">STAY IN THE LOOP</p><h2 id="client-progress-title">Service progress</h2></div></div>
          {bookings.length === 0 ? <p className="client-progress-empty">Garage updates will appear here when your service journey begins.</p> : <div className="client-timeline-grid">{bookings.map(booking => {
            const updates = updatesByBooking[booking.id] || [];
            return <article className="client-timeline" id={`booking-progress-${booking.id}`} key={booking.id}><div className="client-timeline-heading"><h3>Booking #{booking.id}</h3><span>{booking.service_type}</span></div>{updates.length === 0 ? <p className="client-no-updates">No updates from your garage yet.</p> : <ul>{updates.map(update => <li key={update.id}><p>{update.message}</p><small>{update.eta_value && update.eta_unit ? `ETA: ${update.eta_value} ${update.eta_unit}` : "ETA: Not specified"}<span aria-hidden="true"> · </span>{new Date(update.created_at).toLocaleString()}</small></li>)}</ul>}</article>;
          })}</div>}
        </section>
          <aside className="client-overview-aside" aria-label="Vehicles and recent activity">
            <section className="client-panel" id="client-vehicles"><h2>Vehicles in Your Bookings</h2><p className="client-panel-description">Vehicle details from your service requests.</p>{vehicles.length ? <div className="client-vehicle-list">{vehicles.map(vehicle => <div key={vehicle}><span aria-hidden="true">▣</span><div><strong>{vehicle}</strong><small>{bookings.filter(b => b.vehicle_id === vehicle).length} service requests</small></div></div>)}</div> : <p className="client-no-updates">Your booked vehicles will appear here.</p>}</section>
            <section className="client-panel"><h2>Recent Garage Updates</h2><div className="client-recent-updates">{recentUpdates.length ? recentUpdates.map(update => <article key={`${update.bookingId}-${update.id}`}><span aria-hidden="true">◷</span><div><strong>Booking #{update.bookingId} · {update.service}</strong><p>{update.message}</p><time dateTime={update.created_at}>{new Date(update.created_at).toLocaleString()}</time></div></article>) : <p className="client-no-updates">No garage updates yet.</p>}</div><a className="client-aside-link" href="#client-progress">View all updates →</a></section>
            <section className="client-service-guide"><h2>Your service, organized.</h2><p>Keep your vehicle details handy and check your garage updates for the latest progress and estimated completion time.</p><a href="#client-book">Plan your next visit →</a></section>
          </aside>
        <footer className="client-footer"><span>Smart Vehicle Service</span><span>Better care. Every journey.</span></footer>
      </main>
    </div>
  );
}







