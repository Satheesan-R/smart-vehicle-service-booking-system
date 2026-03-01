const db = require("../config/db");
const bcrypt = require("bcrypt");

// Register new user
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if email already exists
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length > 0) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role],
      (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ user: { id: result.insertId, name, email, role } });
      }
    );
  });
};

// Login user
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.status(400).json({ message: "User not found" });

    const user = result[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect password" });

    // Send user info (without password)
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });
};