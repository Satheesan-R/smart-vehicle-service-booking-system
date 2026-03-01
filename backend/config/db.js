const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",      
  user: "root",
  password: "",
  database: "vehicle_service_db"
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Database connected successfully");
  }
});

module.exports = db;