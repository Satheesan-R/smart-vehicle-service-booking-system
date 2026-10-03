require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const { createBookingUpdatesTable, createVehiclesTable } = require("./models/queries");

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/booking");
const vehicleRoutes = require("./routes/vehicles");

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/vehicles", vehicleRoutes);

db.query(createBookingUpdatesTable, (err) => {
  if (err) {
    console.error("Failed to ensure booking_updates table:", err.message);
  }
});

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

db.query(createVehiclesTable, (err) => {
  if (err) {
    console.error("Failed to ensure vehicles table:", err.message);
  }
});