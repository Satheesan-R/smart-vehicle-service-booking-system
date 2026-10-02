const db = require("../config/db");

function normalizeVehicle(body) {
  return {
    user_id: Number(body.user_id),
    vehicle_number: String(body.vehicle_number || "").trim().toUpperCase(),
    model: String(body.model || "").trim(),
    brand: String(body.brand || "").trim()
  };
}

function validVehicle(vehicle) {
  return Number.isInteger(vehicle.user_id) && vehicle.user_id > 0 && vehicle.vehicle_number.length > 0 && vehicle.vehicle_number.length <= 50 && vehicle.model.length > 0 && vehicle.model.length <= 100 && vehicle.brand.length > 0 && vehicle.brand.length <= 100;
}

exports.getVehicles = (req, res) => {
  const userId = Number(req.query.user_id);
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ message: "A valid user_id is required" });
  }

  db.query("SELECT id, user_id, vehicle_number, model, brand FROM vehicles WHERE user_id = ? ORDER BY id DESC", [userId], (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error", error: err.message });
    res.json(rows);
  });
};

exports.createVehicle = (req, res) => {
  const vehicle = normalizeVehicle(req.body);
  if (!validVehicle(vehicle)) {
    return res.status(400).json({ message: "Vehicle number, model and brand are required." });
  }

  db.query("SELECT id FROM users WHERE id = ? AND role = 'client'", [vehicle.user_id], (userErr, users) => {
    if (userErr) return res.status(500).json({ message: "Database error", error: userErr.message });
    if (!users.length) return res.status(400).json({ message: "Invalid client user" });

    db.query("SELECT id FROM vehicles WHERE user_id = ? AND vehicle_number = ?", [vehicle.user_id, vehicle.vehicle_number], (duplicateErr, existing) => {
      if (duplicateErr) return res.status(500).json({ message: "Database error", error: duplicateErr.message });
      if (existing.length) return res.status(409).json({ message: "This vehicle is already registered to your account." });

      db.query("INSERT INTO vehicles (user_id, vehicle_number, model, brand) VALUES (?, ?, ?, ?)", [vehicle.user_id, vehicle.vehicle_number, vehicle.model, vehicle.brand], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error", error: err.message });
        res.status(201).json({ message: "Vehicle added", vehicle: { id: result.insertId, ...vehicle } });
      });
    });
  });
};
