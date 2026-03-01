import React, { useState, useEffect } from "react";

function App() {
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    user_id: "",
    vehicle_id: "",
    service_type: "",
    booking_date: ""
  });
  const [loading, setLoading] = useState(true);

  // Fetch bookings from backend
  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/bookings");
      const data = await res.json();
      setBookings(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit new booking
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
      fetchBookings(); // Refresh list
    } catch (err) {
      console.error("Failed to create booking:", err);
    }
  };

  // Update booking status
  const updateStatus = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      fetchBookings(); // Refresh list
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Smart Vehicle Service Booking</h1>

      {/* Booking Form */}
      <h2>Create Booking</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="number"
          name="user_id"
          placeholder="User ID"
          value={form.user_id}
          onChange={handleChange}
          required
          style={{ marginRight: "10px" }}
        />
        <input
          type="number"
          name="vehicle_id"
          placeholder="Vehicle ID"
          value={form.vehicle_id}
          onChange={handleChange}
          required
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          name="service_type"
          placeholder="Service Type"
          value={form.service_type}
          onChange={handleChange}
          required
          style={{ marginRight: "10px" }}
        />
        <input
          type="date"
          name="booking_date"
          value={form.booking_date}
          onChange={handleChange}
          required
          style={{ marginRight: "10px" }}
        />
        <button type="submit">Book Service</button>
      </form>

      {/* Booking List */}
      <h2>Booking List</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.id} style={{ marginBottom: "10px" }}>
              <strong>{booking.service_type}</strong> - Status: {booking.status} (User ID: {booking.user_id})
              {booking.status !== "completed" && (
                <button
                  onClick={() => updateStatus(booking.id)}
                  style={{ marginLeft: "10px" }}
                >
                  Mark Completed
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;