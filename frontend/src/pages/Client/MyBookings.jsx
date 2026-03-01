import React, { useEffect, useState } from "react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    const res = await fetch("http://localhost:5000/api/bookings");
    const data = await res.json();
    // Filter only bookings for this user (replace 1 with dynamic user_id if needed)
    setBookings(data.filter(b => b.user_id === 1));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div>
      <h2>My Bookings</h2>
      <ul>
        {bookings.map(booking => (
          <li key={booking.id}>
            {booking.service_type} - {booking.status} - {booking.booking_date}
          </li>
        ))}
      </ul>
    </div>
  );
}