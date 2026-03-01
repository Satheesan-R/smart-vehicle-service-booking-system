import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

import CreateBooking from "./pages/Client/CreateBooking";
import MyBookings from "./pages/Client/MyBookings";
import AllBookings from "./pages/Garage/allbookings";

import { currentUser } from "./auth";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <Routes>
          {/* Client routes */}
          {currentUser.role === "client" && (
            <>
              <Route path="/create-booking" element={<CreateBooking />} />
              <Route path="/my-bookings" element={<MyBookings />} />
            </>
          )}

          {/* Garage route */}
          {currentUser.role === "garage" && (
            <Route path="/garage/bookings" element={<AllBookings />} />
          )}

          {/* Default redirect */}
          <Route path="*" element={
            currentUser.role === "client" ? 
              <Navigate to="/create-booking" /> : 
              <Navigate to="/garage/bookings" />
          } />
        </Routes>
      </div>
    </Router>
  );
}