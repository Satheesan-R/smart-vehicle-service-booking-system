const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_secret_key"; // later move to .env

function databaseError(res, err) {
  console.error("Authentication database error:", err);
  return res.status(500).json({
    message: "Unable to access the database. Please try again shortly."
  });
}

// ================= REGISTER =================
exports.register = async (req, res) => {
  const { name, email, password, role, phone } = req.body;
  if (![name, email, password, role, phone].every(value => typeof value === "string" && value.trim())) {
    return res.status(400).json({ message: "Name, email, phone, password and role are required." });
  }
  if (!["client", "garage"].includes(role) || password.length < 8 || Buffer.byteLength(password, "utf8") > 72 || name.length > 100 || email.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\+[0-9 ()-]{7,30}$/.test(phone)) {
    return res.status(400).json({ message: "Check your account details. Passwords need at least 8 characters (maximum 72 bytes)." });
  }
  let connection;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    connection = await db.promise().getConnection();
    await connection.beginTransaction();
    const [existing] = await connection.query("SELECT id FROM users WHERE email = ?", [email.trim()]);
    if (existing.length) {
      await connection.rollback();
      return res.status(400).json({ message: "Email already registered" });
    }
    const [result] = await connection.query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [name.trim(), email.trim(), hashedPassword, role]);
    await connection.query("INSERT INTO registration_profiles (user_id, phone) VALUES (?, ?)", [result.insertId, phone.trim()]);
    await connection.commit();
    return res.status(201).json({ message: "User registered successfully", user: { id: result.insertId, name: name.trim(), email: email.trim(), role } });
  } catch (err) {
    if (connection) await connection.rollback().catch(() => {});
    return databaseError(res, err);
  } finally {
    if (connection) connection.release();
  }
};
// ================= LOGIN =================
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return databaseError(res, err);
    if (result.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
};

