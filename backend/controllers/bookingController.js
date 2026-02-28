const db = require("../config/db");

exports.createBooking = (req, res) => {
  const { user_id, vehicle_id, service_type, booking_date } = req.body;
  const sql = "INSERT INTO bookings (user_id, vehicle_id, service_type, booking_date, status) VALUES (?, ?, ?, ?, 'pending')";
  
  db.query(sql, [user_id, vehicle_id, service_type, booking_date], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ message: "Booking created", bookingId: result.insertId });
  });
};