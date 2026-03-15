const mysql = require("mysql2/promise");
require("dotenv").config();

const requiredEnv = ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME"];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

let connection;

async function connectDB() {
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 10000
    });

    console.log("✅ MySQL connected");

  } catch (err) {
    console.error("❌ MySQL connection failed. Retrying...");
    setTimeout(connectDB, 5000);
  }
}

async function query(sql, params) {
  try {
    const [rows] = await connection.execute(sql, params);
    return rows;
  } catch (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.log("⚠️ Connection lost. Reconnecting...");
      await connectDB();
      const [rows] = await connection.execute(sql, params);
      return rows;
    }
    throw err;
  }
}

connectDB();

module.exports = { query };