import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <Link to="/create-booking" style={{ marginRight: "10px" }}>Create Booking</Link>
      <Link to="/my-bookings" style={{ marginRight: "10px" }}>My Bookings</Link>
      <Link to="/garage/bookings">Garage Dashboard</Link>
    </nav>
  );
}