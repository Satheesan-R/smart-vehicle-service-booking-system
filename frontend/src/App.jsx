import { useState, useEffect } from "react";

function App() {
  // Form state
  const [form, setForm] = useState({
    user_id: "",
    vehicle_id: "",
    service_type: "",
    booking_date: ""
  });

  // Bookings state
  const [bookings, setBookings] = useState([]);

  // Handle form input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Submit booking
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      alert(data.message);
      fetchBookings(); // Refresh booking list
      setForm({ user_id: "", vehicle_id: "", service_type: "", booking_date: "" }); // Reset form
    } catch (err) {
      console.error(err);
      alert("Error creating booking");
    }
  };

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/bookings");
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Update booking status
  const updateStatus = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" })
      });
      fetchBookings(); // Refresh list after update
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  // Fetch bookings on page load
  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Vehicle Service Booking 🚗</h1>

      {/* Booking Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <input
          name="user_id"
          placeholder="User ID"
          value={form.user_id}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="vehicle_id"
          placeholder="Vehicle ID"
          value={form.vehicle_id}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="service_type"
          placeholder="Service Type"
          value={form.service_type}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="date"
          name="booking_date"
          value={form.booking_date}
          onChange={handleChange}
          required
        />
        <br /><br />

        <button type="submit">Book Service</button>
      </form>

      {/* Bookings List */}
      <h2>All Bookings</h2>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id}>
            <strong>{booking.service_type}</strong> - Status: {booking.status} (User ID: {booking.user_id})
            {booking.status !== "completed" && (
              <button onClick={() => updateStatus(booking.id)}>Mark Completed</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;