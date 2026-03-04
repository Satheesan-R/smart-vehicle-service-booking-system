import React, { useEffect, useState } from "react";

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    const res = await fetch("http://localhost:5000/api/bookings");
    const data = await res.json();
    setBookings(data);
  };

  const updateStatus = async (id) => {
    await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "completed" })
    });
    fetchBookings();
  };

  useEffect(() => { fetchBookings(); }, []);

  return (
    <div>
      <h2>Garage Dashboard</h2>
      <ul>
        {bookings.map(b => (
          <li key={b.id}>
            {b.service_type} - {b.status} 
            {b.status !== "completed" && (
              <button onClick={() => updateStatus(b.id)}>Mark Completed</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}