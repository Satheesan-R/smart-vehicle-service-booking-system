import React, { useState } from "react";

export default function CreateBooking() {
  const [form, setForm] = useState({ user_id: "", vehicle_id: "", service_type: "", booking_date: "" });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    alert(JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Booking</h2>
      <input name="user_id" placeholder="User ID" onChange={handleChange} required />
      <input name="vehicle_id" placeholder="Vehicle ID" onChange={handleChange} required />
      <input name="service_type" placeholder="Service Type" onChange={handleChange} required />
      <input type="date" name="booking_date" onChange={handleChange} required />
      <button type="submit">Book Service</button>
    </form>
  );
}