// server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const app = express();
app.use(cors());
app.use(bodyParser.json());

let db;
(async () => {
  db = await open({
    filename: "./backend.db",
    driver: sqlite3.Database,
  });

  // Ensure Supplier table exists with your columns
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Supplier (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      SupplierName TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      PhoneNumber TEXT,
      password TEXT NOT NULL
    )
  `);
})();

// Signup endpoint
app.post("/api/signup", async (req, res) => {
  const { SupplierName, email, PhoneNumber, password } = req.body;

  try {
    await db.run(
      "INSERT INTO Supplier (SupplierName, email, PhoneNumber, password) VALUES (?, ?, ?, ?)",
      [SupplierName, email, PhoneNumber, password]
    );
    res.json({ message: "Signup successful!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error signing up", error: err.message });
  }
});

app.listen(5000, () => console.log("✅ Server running at http://localhost:5000"));
