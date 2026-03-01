import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [view, setView] = useState("client"); // client or garage
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({ user_id: "", vehicle_id: "", service_type: "", booking_date: "" });
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/bookings");
      const data = await res.json();
      setBookings(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      alert(`Booking created! ID: ${data.bookingId}`);
      setForm({ user_id: "", vehicle_id: "", service_type: "", booking_date: "" });
      fetchBookings();
    } catch (err) { console.error(err); }
  };

  const updateStatus = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      fetchBookings();
    } catch (err) { console.error(err); }
  };

  if (loading) return <p className="container">Loading bookings...</p>;

  return (
    <div className="container">
      <h1>Smart Vehicle Service Booking</h1>

      {/* View Switch */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => setView("client")} style={{ backgroundColor: view === "client" ? "#007bff" : "#ccc", color: view === "client" ? "#fff" : "#000" }}>Client</button>
        <button onClick={() => setView("garage")} style={{ backgroundColor: view === "garage" ? "#28a745" : "#ccc", color: view === "garage" ? "#fff" : "#000" }}>Garage</button>
      </div>

      {/* Client View */}
      {view === "client" && (
        <>
          <h2>Create Booking</h2>
          <form onSubmit={handleSubmit}>
            <input type="number" name="user_id" placeholder="User ID" value={form.user_id} onChange={handleChange} required />
            <input type="number" name="vehicle_id" placeholder="Vehicle ID" value={form.vehicle_id} onChange={handleChange} required />
            <input type="text" name="service_type" placeholder="Service Type" value={form.service_type} onChange={handleChange} required />
            <input type="date" name="booking_date" value={form.booking_date} onChange={handleChange} required />
            <button type="submit">Book Service</button>
          </form>

          <h2>All Bookings</h2>
          <ul>
            {bookings.map(b => (
              <li key={b.id}>
                <span>{b.service_type} - {b.status} (User ID: {b.user_id})</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Garage View */}
      {view === "garage" && (
        <>
          <h2>Update Booking Status</h2>
          <ul>
            {bookings.map(b => (
              <li key={b.id}>
                <span>{b.service_type} - Status: {b.status} (User ID: {b.user_id})</span>
                {b.status !== "completed" && <button onClick={() => updateStatus(b.id)}>Mark Completed</button>}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;