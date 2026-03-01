import React, { useEffect, useState } from "react";

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    const res = await fetch("http://localhost:5000/api/bookings");
    const data = await res.json();
    setBookings(data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id) => {
    await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "completed" })
    });
    fetchBookings();
  };

  return (
    <div>
      <h2>Garage Dashboard</h2>
      <ul>
        {bookings.map(booking => (
          <li key={booking.id}>
            {booking.service_type} - {booking.status} - {booking.booking_date}
            {booking.status !== "completed" && (
              <button onClick={() => updateStatus(booking.id)}>Mark Completed</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}