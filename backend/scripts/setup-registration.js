const db = require('../config/db');
const sql = `CREATE TABLE IF NOT EXISTS registration_profiles (
  user_id INT PRIMARY KEY,
  phone VARCHAR(40) NOT NULL,
  vehicle JSON NULL
)`;
db.query(sql, (err) => {
  if (err) { console.error(err.message); process.exitCode = 1; }
  else console.log('Registration profile table ready.');
  db.end();
});
