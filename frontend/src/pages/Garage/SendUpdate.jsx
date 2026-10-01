import { useOutletContext } from "react-router-dom";
import { STATUS_OPTIONS } from "./garageConstants";

export default function SendUpdate() {
  const { bookings, updateForm, setUpdateForm, handleUpdateSubmit, savingId, updateSuccess } = useOutletContext();

  return (
    <section className="garage-panel garage-page-panel" aria-labelledby="update-title">
      <div className="garage-page-heading"><p className="garage-eyebrow">KEEP CUSTOMERS IN THE LOOP</p><h1 id="update-title">Send a progress update<span>.</span></h1><p>Share the latest work, estimated time, and service status with your customer.</p></div>
      {updateSuccess && <p className="garage-success" role="status">✓ {updateSuccess}</p>}
      <form className="garage-form" onSubmit={handleUpdateSubmit} aria-busy={savingId !== null}>
        <div><label htmlFor="garage-booking">Booking</label><select id="garage-booking" value={updateForm.booking_id} onChange={(event) => setUpdateForm((previous) => ({ ...previous, booking_id: event.target.value }))} required disabled={savingId !== null}><option value="">Select a customer booking</option>{bookings.map((booking) => <option key={booking.id} value={booking.id}>#{booking.id} — {booking.client_name || "Client"} ({booking.service_type})</option>)}</select></div>
        <div><label htmlFor="garage-message">Progress message</label><textarea id="garage-message" rows="5" value={updateForm.message} onChange={(event) => setUpdateForm((previous) => ({ ...previous, message: event.target.value }))} placeholder="Let your customer know what's been done and what comes next." required disabled={savingId !== null} /></div>
        <div className="garage-update-details"><fieldset className="garage-eta"><legend>Estimated time remaining <span>(optional)</span></legend><div><input aria-label="Estimated time amount" type="number" min="1" value={updateForm.eta_value} onChange={(event) => setUpdateForm((previous) => ({ ...previous, eta_value: event.target.value }))} placeholder="e.g. 5" disabled={savingId !== null} /><select aria-label="Estimated time unit" value={updateForm.eta_unit} onChange={(event) => setUpdateForm((previous) => ({ ...previous, eta_unit: event.target.value }))} disabled={savingId !== null}><option value="hours">Hours</option><option value="days">Days</option></select></div></fieldset><div><label htmlFor="garage-update-status">Service status</label><select id="garage-update-status" value={updateForm.status} onChange={(event) => setUpdateForm((previous) => ({ ...previous, status: event.target.value }))} disabled={savingId !== null}>{STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status.replace(/-/g, " ")}</option>)}</select></div></div>
        <button className="garage-button" type="submit" disabled={savingId !== null || !bookings.length}>{savingId === Number(updateForm.booking_id) ? "Sending..." : "Send update to customer"}<span aria-hidden="true">↗</span></button><p className="garage-form-note">The customer will see this message in their Service Updates page.</p>
      </form>
    </section>
  );
}
