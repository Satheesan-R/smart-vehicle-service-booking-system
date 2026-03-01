import { useState, useEffect } from "react";

function App() {
  const [form, setForm] = useState({
    user_id: "",
    vehicle_id: "",
    service_type: "",
    booking_date: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    alert(data.message);
  };

  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    const res = await fetch("http://localhost:5000/api/bookings");
    const data = await res.json();
    setBookings(data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Vehicle Service Booking 🚗</h1>

      <form onSubmit={handleSubmit}>
        <input name="user_id" placeholder="User ID" onChange={handleChange} required />
        <br /><br />

        <input name="vehicle_id" placeholder="Vehicle ID" onChange={handleChange} required />
        <br /><br />

        <input name="service_type" placeholder="Service Type" onChange={handleChange} required />
        <br /><br />

        <input type="date" name="booking_date" onChange={handleChange} required />
        <br /><br />

        <button type="submit">Book Service</button>
      </form>

      <h2>All Bookings</h2>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id}>
            {booking.service_type} - {booking.status}
            {/* Button to mark completed */}
            {booking.status !== "completed" && (
              <button onClick={() => updateStatus(booking.id)}>
                Mark Completed
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );


}

export default App;