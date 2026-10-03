// Expense Tracker - backend (Express API + PostgreSQL)
//
// PHASE 1
// Setup:
//   1. Create a database named expense_tracker and run schema.sql on it.
//   2. Copy .env.example to a new file named .env and write your PostgreSQL password.
//   3. npm install express cors pg dotenv
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const port = 3000;

// Run:    node server.js   (restart it every time you change this file)
//
// Endpoints you need to build:
//   GET    /api/expenses        return all expenses
app.get("/api/expenses", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, title, amount::float8 AS amount, category, to_char(date, 'YYYY-MM-DD') AS date FROM expenses ORDER BY id",
    );
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//   GET    /api/expenses/:id    return one expense (404 if not found)
app.get("/api/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(404).json({ error: "Invalid ID format" });
    }
    const result = await pool.query(
      "SELECT id, title, amount::float8 AS amount, category, to_char(date, 'YYYY-MM-DD') AS date FROM expenses WHERE id=$1",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);

    res.status(500).json({ error: "Server Error" });
  }
});

//   POST   /api/expenses        add an expense (201, or 400 if the data is invalid)
app.post("/api/expenses", async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    const allowedCategories = [
      "Food",
      "Transport",
      "Bills",
      "Entertainment",
      "Other",
    ];
    if (
      !title ||
      title.trim() === "" ||
      !category ||
      !allowedCategories.includes(category.trim()) ||
      !date ||
      date.trim() === "" ||
      !amount ||
      isNaN(amount) ||
      amount <= 0
    ) {
      return res.status(400).json({ error: "Data is missing or wrong" });
    }

    const result = await pool.query(
      "INSERT INTO expenses(title, amount, category, date) VALUES($1,$2,$3,$4) RETURNING *",
      [title, amount, category, date],
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);

    res.status(500).json({ error: "Server Error" });
  }
});

//   PUT    /api/expenses/:id    update an expense (200, 400, or 404)
app.put("/api/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(404).json({ error: "Invalid ID format" });
    }

    const checkExist = await pool.query(
      "SELECT id FROM expenses WHERE id = $1",
      [id],
    );
    if (checkExist.rows.length === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }

    const { title, amount, category, date } = req.body;
    const allowedCategories = [
      "Food",
      "Transport",
      "Bills",
      "Entertainment",
      "Other",
    ];
    if (
      !title ||
      title.trim() === "" ||
      !category ||
      !allowedCategories.includes(category.trim()) ||
      !date ||
      date.trim() === "" ||
      !amount ||
      isNaN(amount) ||
      amount <= 0
    ) {
      return res.status(400).json({ error: "Data is missing or wrong" });
    }

    const result = await pool.query(
      "UPDATE expenses SET title = $2, amount = $3, category = $4, date = $5 WHERE id=$1 RETURNING *",
      [id, title, amount, category, date],
    );

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);

    res.status(500).json({ error: "Server Error" });
  }
});
//   DELETE /api/expenses/:id    delete an expense (200, or 404)
app.delete("/api/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(404).json({ error: "Invalid ID format" });
    }

    const checkExist = await pool.query(
      "SELECT id FROM expenses WHERE id = $1",
      [id],
    );
    if (checkExist.rows.length === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }
    const result = await pool.query(
      "DELETE FROM expenses WHERE id=$1 Returning *",
      [id],
    );
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);

    res.status(500).json({ error: "Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
//
// Tips:
//   - Create one Pool (from the "pg" library) with the values from .env,
//     and use pool.query(...) in every route.
//   - ALWAYS send the values as parameters: pool.query("... WHERE id = $1", [id]).
//     NEVER build the SQL text by joining strings with data from the user.
//   - Use RETURNING to get the new (or updated) row back from INSERT and UPDATE.
//   - The database creates the id. The client never sends one.
//   - pg returns NUMERIC as text and DATE as a JavaScript Date, so fix both in your SELECT.
//     Hint: amount::float8 and to_char(date, 'YYYY-MM-DD').
//   - Validate the data before the query, and answer 400 with a message that explains the problem.
//   - Check the id before the query. A text like "abc" makes PostgreSQL throw an error.
//   - Enable CORS so the frontend can talk to the server.
//   - Test every endpoint with Thunder Client BEFORE you connect the frontend.
