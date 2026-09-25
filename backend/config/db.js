const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",      
  user: "root",
  password: "",
  database: "vehicle_service_db"
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    connection.release();
    console.log("Database connected successfully");
  }
});

module.exports = db;
