import { useCallback, useEffect, useState } from "react";
import { getCurrentUser } from "../../auth";
import { createVehicle, getBookings, getVehicles } from "../../services/api";
import "../ClientDashboard.css";
import "./MyVehicles.css";

const emptyForm = { vehicle_number: "", brand: "", model: "" };

export default function MyVehicles() {
  const user = getCurrentUser();
  const [vehicles, setVehicles] = useState([]);
  const [serviceCounts, setServiceCounts] = useState({});
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadVehicles = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const vehicleData = await getVehicles(user.id);
      setVehicles(vehicleData);
    } catch (err) {
      setError(err.message === "Request failed" ? "Vehicle service is unavailable. Please restart the backend and try again." : err.message);
    }

    try {
      const bookingData = await getBookings(user.id);
      setServiceCounts(bookingData.reduce((counts, booking) => ({ ...counts, [booking.vehicle_id]: (counts[booking.vehicle_id] || 0) + 1 }), {}));
    } catch {
      setServiceCounts({});
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!form.vehicle_number.trim() || !form.brand.trim() || !form.model.trim()) {
      setError("Enter the vehicle number, brand, and model before saving.");
      return;
    }
    setSaving(true);
    try {
      await createVehicle({ vehicle_number: form.vehicle_number.trim().toUpperCase(), brand: form.brand.trim(), model: form.model.trim(), user_id: user.id });
      setForm(emptyForm);
      setMessage("Vehicle details saved successfully.");
      await loadVehicles();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="client-vehicles-page">
      <section className="client-welcome" aria-labelledby="vehicles-title">
        <div><p className="client-eyebrow">YOUR VEHICLE PROFILE</p><h1 id="vehicles-title">My vehicles<span>.</span></h1><p>Keep your vehicle details ready for faster service bookings.</p></div>
      </section>
      <div className="client-vehicles-grid">
        <section className="client-panel" aria-labelledby="add-vehicle-title">
          <p className="client-eyebrow">ADD A VEHICLE</p><h2 id="add-vehicle-title">Vehicle details</h2><p className="client-panel-description">Register another vehicle to your customer account. These details will be available when you book a service.</p>
          <form className="client-form" onSubmit={handleSubmit} aria-busy={saving}>
            <label htmlFor="vehicle-number">Vehicle registration number<input id="vehicle-number" name="vehicle_number" value={form.vehicle_number} onChange={(event) => setForm((prev) => ({ ...prev, vehicle_number: event.target.value }))} placeholder="e.g. WP ABC-1234" maxLength="50" autoComplete="off" required disabled={saving} /><small>Use the number shown on your registration plate.</small></label>
            <label htmlFor="vehicle-brand">Brand / make<input id="vehicle-brand" name="brand" value={form.brand} onChange={(event) => setForm((prev) => ({ ...prev, brand: event.target.value }))} placeholder="e.g. Toyota" maxLength="100" autoComplete="off" required disabled={saving} /></label>
            <label htmlFor="vehicle-model">Model<input id="vehicle-model" name="model" value={form.model} onChange={(event) => setForm((prev) => ({ ...prev, model: event.target.value }))} placeholder="e.g. Prius" maxLength="100" autoComplete="off" required disabled={saving} /></label>
            {error && <p className="client-error" role="alert">{error}</p>}
            {message && <p className="client-success" role="status">{message}</p>}
            <button className="client-button" type="submit" disabled={saving}>{saving ? "Saving vehicle..." : "Save vehicle"}<span aria-hidden="true">↗</span></button>
          </form>
        </section>
        <section className="client-panel" aria-labelledby="saved-vehicles-title">
          <div className="client-panel-heading"><div><p className="client-eyebrow">SAVED TO YOUR ACCOUNT</p><h2 id="saved-vehicles-title">Registered vehicles</h2></div><span className="client-count">{vehicles.length} {vehicles.length === 1 ? "vehicle" : "vehicles"}</span></div>
          {loading ? <p className="client-no-updates">Loading your vehicle details...</p> : vehicles.length === 0 ? <p className="client-no-updates">No vehicles registered yet.</p> : <div className="client-vehicle-list">{vehicles.map((vehicle) => <article className="client-vehicle-card" key={vehicle.id}><span className="client-vehicle-icon" aria-hidden="true">▣</span><div className="client-vehicle-card-main"><strong>{vehicle.brand} {vehicle.model}</strong><span className="client-vehicle-registration">{vehicle.vehicle_number}</span><div className="client-vehicle-meta"><span>Vehicle ID: {vehicle.id}</span><span>{serviceCounts[vehicle.vehicle_number] || 0} service requests</span></div></div></article>)}</div>}
        </section>
      </div>
    </main>
  );
}
