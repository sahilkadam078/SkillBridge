const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "SAHIL@2006", // 🔥 put your real password
  database: "skillbridge",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;