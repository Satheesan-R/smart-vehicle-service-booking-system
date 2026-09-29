import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getCurrentUser } from "../../auth";
import { createBooking, getBookings } from "../../services/api";
import "../ClientDashboard.css";
import "./CreateBooking.css";

const SERVICES = [
  ["General Service", "Routine maintenance and a general vehicle check.", "▣"],
  ["Oil Change", "Engine oil and filter maintenance.", "◈"],
  ["Brake Service", "Inspection of braking performance and component wear.", "◎"],
  ["Engine Diagnostics", "Investigate warning lights and engine performance.", "⚙"],
  ["Battery Check", "Check battery condition and starting performance.", "ϟ"]
];

export default function CreateBooking() {
  const user = getCurrentUser();
  const { state } = useLocation();
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({ vehicle_id: typeof state?.rebook?.vehicle_id === "string" ? state.rebook.vehicle_id : "", service_type: SERVICES.some(([name]) => name === state?.rebook?.service_type) ? state.rebook.service_type : "General Service", booking_date: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [vehicleError, setVehicleError] = useState("");
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  useEffect(() => {
    let cancelled = false;
    getBookings(user.id).then(data => {
      if (!cancelled) setVehicles([...new Set(data.map(booking => booking.vehicle_id).filter(Boolean))]);
    }).catch(() => { if (!cancelled) setVehicleError("We could not load vehicles from past bookings. Please fill in your vehicle details manually."); });
    return () => { cancelled = true; };
  }, [user.id]);

  async function submit(event) {
    event.preventDefault();
    if (saving || success) return;
    setError("");
    if (!form.vehicle_id.trim() || !form.booking_date || form.booking_date < today) {
      setError("Please enter your vehicle model and registration number, then choose today or a future service date.");
      return;
    }
    setSaving(true);
    try {
      const result = await createBooking({ ...form, vehicle_id: form.vehicle_id.trim(), user_id: user.id });
      setSuccess(result.bookingId);
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  return (
    <div className="booking-page">
        <section className="booking-heading"><p className="client-eyebrow">COMPLETE YOUR SERVICE REQUEST</p><h1>Vehicle Service Booking Form</h1><p>Fill in the required fields below, review your details, and submit your request for garage review.</p></section>
        {success ? <section className="client-panel booking-success" role="status"><span aria-hidden="true">✓</span><h2>Service request #{success} submitted</h2><p>Your completed form has been sent for garage review. Open My Bookings to view the request and follow its progress.</p><Link className="client-button" to="/client/bookings">View my bookings →</Link><button type="button" className="booking-another" onClick={() => { setSuccess(null); setForm({ vehicle_id: "", service_type: "General Service", booking_date: "" }); }}>Fill another booking form</button></section> :
        <form aria-label="Vehicle service booking form" className="booking-grid" onSubmit={submit} aria-busy={saving}>
          <div className="booking-column">
            <section className="client-panel"><div className="booking-section-heading"><span>1</span><div><h2>Enter Vehicle Details</h2><p>Enter the vehicle model and registration number. You can also reuse details from a previous booking.</p></div></div>
              {vehicleError && <p className="booking-note">{vehicleError}</p>}
              {vehicles.length > 0 && <div className="booking-vehicle-options">{vehicles.map(vehicle => <button type="button" key={vehicle} disabled={saving} className={form.vehicle_id === vehicle ? "selected" : ""} aria-pressed={form.vehicle_id === vehicle} onClick={() => setForm(prev => ({ ...prev, vehicle_id: vehicle }))}><span aria-hidden="true">▣</span><strong>{vehicle}</strong></button>)}</div>}
              <label className="booking-field">Vehicle model and registration number (required)<input name="vehicle_id" aria-describedby="vehicle-entry-help" value={form.vehicle_id} onChange={e => setForm(prev => ({ ...prev, vehicle_id: e.target.value }))} placeholder="e.g. Toyota Prius / WP ABC-1234" required disabled={saving} /></label><p id="vehicle-entry-help" className="booking-note">Check the registration number before submitting so your garage can identify the correct vehicle.</p>
            </section>
            <section className="client-panel"><div className="booking-section-heading"><span>2</span><div><h2>Choose Your Service</h2><p>Select the service you want to request for this vehicle.</p></div></div><label className="booking-field">Service type (required)<select name="service_type" value={form.service_type} onChange={e => setForm(prev => ({ ...prev, service_type: e.target.value }))} required disabled={saving} aria-describedby="service-entry-help">{SERVICES.map(([name]) => <option key={name} value={name}>{name}</option>)}</select></label><p id="service-entry-help" className="booking-note">{SERVICES.find(([name]) => name === form.service_type)?.[1]}</p></section>
          </div>
          <div className="booking-column">
            <section className="client-panel"><div className="booking-section-heading"><span>3</span><div><h2>Enter Your Preferred Date</h2><p>Choose today or a future date for your service request.</p></div></div><label className="booking-field">Preferred service date (required)<input type="date" name="booking_date" aria-describedby="booking-date-help" min={today} value={form.booking_date} onChange={e => setForm(prev => ({ ...prev, booking_date: e.target.value }))} required disabled={saving} /></label><p id="booking-date-help" className="booking-note">This is your preferred date, not a confirmed appointment. Your garage will review the request; no time slot is reserved.</p></section>
            <section className="client-panel booking-summary"><h2>Review Your Form</h2><p className="booking-note">Check these details before submitting. You can edit the fields above.</p><dl><div><dt>Vehicle</dt><dd>{form.vehicle_id || "Vehicle details not entered"}</dd></div><div><dt>Service</dt><dd>{form.service_type}</dd></div><div><dt>Preferred date</dt><dd>{form.booking_date || "Preferred date not selected"}</dd></div><div><dt>Status after submission</dt><dd>Pending review</dd></div></dl><p className="booking-note">Submitting sends a service request to your garage. Confirm pricing and appointment arrangements with the garage.</p>{error && <p className="client-error" role="alert">{error}</p>}<button className="client-button" type="submit" disabled={saving}>{saving ? "Submitting request..." : "Submit Service Request →"}</button></section>
          </div>
        </form>}
    </div>
  );
}


