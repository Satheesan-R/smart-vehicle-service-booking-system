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
    setForm({ user_id: "", vehicle_id: "", service_type: "", booking_date: "" });
  };

  return (
    <div>
      <h2>Create Booking</h2>
      <form onSubmit={handleSubmit}>
        <input name="user_id" placeholder="User ID" value={form.user_id} onChange={handleChange} required />
        <input name="vehicle_id" placeholder="Vehicle ID" value={form.vehicle_id} onChange={handleChange} required />
        <input name="service_type" placeholder="Service Type" value={form.service_type} onChange={handleChange} required />
        <input type="date" name="booking_date" value={form.booking_date} onChange={handleChange} required />
        <button type="submit">Book Service</button>
      </form>
    </div>
  );
}