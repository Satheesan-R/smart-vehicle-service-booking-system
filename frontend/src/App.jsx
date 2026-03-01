import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import CreateBooking from "./pages/Client/CreateBooking";
import MyBookings from "./pages/Client/MyBookings";
import AllBookings from "./pages/Garage/allbookings";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/create-booking" element={<CreateBooking />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/garage/bookings" element={<AllBookings />} />
          <Route path="*" element={<h2>Welcome to Smart Vehicle Service</h2>} />
        </Routes>
      </div>
    </Router>
  );
}