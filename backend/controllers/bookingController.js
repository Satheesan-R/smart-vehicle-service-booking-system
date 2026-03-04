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

  exports.getBookings = (req, res) => {
    const { user_id } = req.query;

    const baseSql = `
      SELECT
        b.id,
        b.user_id,
        b.vehicle_id,
        b.service_type,
        b.booking_date,
        b.status,
        u.name AS client_name,
        u.email AS client_email
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
    `;

    const sql = user_id ? `${baseSql} WHERE b.user_id = ? ORDER BY b.id DESC` : `${baseSql} ORDER BY b.id DESC`;
    const params = user_id ? [user_id] : [];

    db.query(sql, params, (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err.message });
      }
      res.json(rows);
    });
  };


exports.updateBookingStatus = (req, res) => {
  const bookingId = req.params.id;
  const { status } = req.body;

    const allowedStatus = ["pending", "in-progress", "completed"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

  const sql = "UPDATE bookings SET status = ? WHERE id = ?";
  db.query(sql, [status, bookingId], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Booking not found" });
      }
    res.json({
       message: "Booking status updated" });
  });
};

exports.createBookingUpdate = (req, res) => {
  const bookingId = req.params.id;
  const { garage_id, message, eta_value, eta_unit, status } = req.body;

  if (!garage_id || !message) {
    return res.status(400).json({ message: "garage_id and message are required" });
  }

  const normalizedEtaValue = eta_value === "" || eta_value === null || eta_value === undefined ? null : Number(eta_value);
  const normalizedEtaUnit = eta_unit || null;

  if (normalizedEtaValue !== null) {
    if (Number.isNaN(normalizedEtaValue) || normalizedEtaValue <= 0) {
      return res.status(400).json({ message: "eta_value must be a positive number" });
    }

    const validEtaUnits = ["hours", "days"];
    if (!validEtaUnits.includes(normalizedEtaUnit)) {
      return res.status(400).json({ message: "eta_unit must be either hours or days" });
    }
  }

  const allowedStatus = ["pending", "in-progress", "completed"];
  if (status && !allowedStatus.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  db.query("SELECT id FROM bookings WHERE id = ?", [bookingId], (bookingErr, bookingRows) => {
    if (bookingErr) {
      return res.status(500).json({ message: "Database error", error: bookingErr.message });
    }

    if (bookingRows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    db.query(
      "SELECT id FROM users WHERE id = ? AND role = 'garage'",
      [garage_id],
      (garageErr, garageRows) => {
        if (garageErr) {
          return res.status(500).json({ message: "Database error", error: garageErr.message });
        }

        if (garageRows.length === 0) {
          return res.status(400).json({ message: "Invalid garage user" });
        }

        const insertSql = `
          INSERT INTO booking_updates (booking_id, garage_id, message, eta_value, eta_unit)
          VALUES (?, ?, ?, ?, ?)
        `;

        db.query(
          insertSql,
          [bookingId, garage_id, message, normalizedEtaValue, normalizedEtaUnit],
          (insertErr, result) => {
            if (insertErr) {
              return res.status(500).json({ message: "Database error", error: insertErr.message });
            }

            if (!status) {
              return res.status(201).json({
                message: "Service update added",
                updateId: result.insertId
              });
            }

            db.query(
              "UPDATE bookings SET status = ? WHERE id = ?",
              [status, bookingId],
              (statusErr) => {
                if (statusErr) {
                  return res.status(500).json({ message: "Database error", error: statusErr.message });
                }

                res.status(201).json({
                  message: "Service update added and booking status updated",
                  updateId: result.insertId
                });
              }
            );
          }
        );
      }
    );
  });
};

exports.getBookingUpdates = (req, res) => {
  const bookingId = req.params.id;

  const sql = `
    SELECT
      bu.id,
      bu.booking_id,
      bu.garage_id,
      bu.message,
      bu.eta_value,
      bu.eta_unit,
      bu.created_at,
      u.name AS garage_name
    FROM booking_updates bu
    LEFT JOIN users u ON bu.garage_id = u.id
    WHERE bu.booking_id = ?
    ORDER BY bu.created_at DESC, bu.id DESC
  `;

  db.query(sql, [bookingId], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err.message });
    }

    res.json(rows);
  });
};