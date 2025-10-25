require("dotenv").config();
const app = require("./app");
const { pool } = require("./config/db");

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    // Simple startup check to ensure DB is reachable
    await pool.query("SELECT 1");
    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

start();
