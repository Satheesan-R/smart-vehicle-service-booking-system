const db = require("../config/db");

exports.createBooking = (req, res) => {
  const {
    user_id, 
    vehicle_id,
    service_type,
    booking_date
         } = req.body;

 const sql = `INSERT INTO bookings
   (user_id, vehicle_id, service_type, booking_date, status)
   VALUES (?, ?, ?, ?, 'pending')`;
  
  db.query(sql, [user_id, vehicle_id, service_type, booking_date], (err, result) => {
  if (err) return res.status(500).json({ message: "Database error", error: err.message });

  res.status(201).json({
    message: "Booking created",
    bookingId: result.insertId
  });
 });
};


exports.updateBookingStatus = (req, res) => {
  const bookingId = req.params.id;
  const { status } = req.body;

  const sql = "UPDATE bookings SET status = ? WHERE id = ?";
  db.query(sql, [status, bookingId], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err.message });
    res.json({
       message: "Booking status updated" });
  });
};