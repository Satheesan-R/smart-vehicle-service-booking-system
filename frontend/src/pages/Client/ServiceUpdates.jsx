import { useEffect, useState } from "react";
import { getCurrentUser } from "../../auth";
import { getBookingUpdates, getBookings } from "../../services/api";
import "../ClientDashboard.css";
import "./ServiceUpdates.css";

export default function ServiceUpdates() {
  const user = getCurrentUser();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadUpdates() {
      try {
        const bookings = await getBookings(user.id);
        const servicesWithUpdates = await Promise.all(bookings.map(async (booking) => ({
          booking,
          updates: await getBookingUpdates(booking.id)
        })));
        if (!cancelled) setServices(servicesWithUpdates);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadUpdates();
    return () => { cancelled = true; };
  }, [user.id]);

  return (
    <main className="client-updates-page">
      <section className="client-welcome" aria-labelledby="updates-title"><div><p className="client-eyebrow">MESSAGES FROM YOUR GARAGE</p><h1 id="updates-title">Service updates<span>.</span></h1><p>Follow progress messages and estimated completion details for your vehicles.</p></div></section>
      {error && <p className="client-error" role="alert">{error}</p>}
      {loading ? <p className="client-no-updates">Loading your garage updates...</p> : services.length === 0 ? <section className="client-panel client-updates-empty"><strong>No service updates yet.</strong><p>Garage messages will appear here after you create a service booking.</p></section> : <section className="client-update-list" aria-label="Garage service updates">{services.map(({ booking, updates }) => <article className="client-panel client-update-card" key={booking.id}><div className="client-panel-heading"><div><p className="client-eyebrow">BOOKING #{booking.id}</p><h2>{booking.vehicle_id}</h2><p className="client-update-service">{booking.service_type} · {String(booking.booking_date).slice(0, 10)}</p></div><span className={`client-status client-status-${booking.status}`}>{booking.status?.replace(/-/g, " ")}</span></div>{updates.length === 0 ? <p className="client-no-updates">Your garage has not posted an update for this service yet.</p> : <ol className="client-update-timeline">{updates.map((update) => <li key={update.id}><div><strong>{update.message}</strong><small>{update.eta_value && update.eta_unit ? `Estimated time: ${update.eta_value} ${update.eta_unit}` : "Estimated time: Not specified"} · {new Date(update.created_at).toLocaleString()}</small></div></li>)}</ol>}</article>)}</section>}
    </main>
  );
}
