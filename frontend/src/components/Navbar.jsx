import React from "react";
import { Link } from "react-router-dom";
import { currentUser } from "../auth";

export default function Navbar() {
  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      {currentUser.role === "client" && (
        <>
          <Link to="/create-booking" style={{ marginRight: "10px" }}>Create Booking</Link>
          <Link to="/my-bookings" style={{ marginRight: "10px" }}>My Bookings</Link>
        </>
      )}
      {currentUser.role === "garage" && (
        <Link to="/garage/bookings">Garage Dashboard</Link>
      )}
    </nav>
  );
}