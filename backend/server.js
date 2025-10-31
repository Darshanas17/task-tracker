const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "tasks.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT CHECK(priority IN ('Low', 'Medium', 'High')) NOT NULL,
    due_date TEXT NOT NULL,
    status TEXT CHECK(status IN ('Open', 'In Progress', 'Done')) DEFAULT 'Open',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// --- API Routes ---

app.post("/tasks", (req, res) => {
  const { title, description, priority, due_date } = req.body;

  if (!title || !priority || !due_date) {
    return res
      .status(400)
      .json({ message: "Title, priority, and due date are required." });
  }

  const query = `
    INSERT INTO tasks (title, description, priority, due_date)
    VALUES (?, ?, ?, ?)
  `;
  db.run(query, [title, description, priority, due_date], function (err) {
    if (err) {
      console.error("Error adding task:", err.message);
      return res.status(500).json({ message: "Failed to create task." });
    }
    res
      .status(201)
      .json({ id: this.lastID, message: "Task added successfully." });
  });
});

app.get("/tasks", (req, res) => {
  const { status, priority, sort } = req.query;

  let query = "SELECT * FROM tasks WHERE 1=1";
  const params = [];

  if (status) {
    query += " AND status = ?";
    params.push(status);
  }

  if (priority) {
    query += " AND priority = ?";
    params.push(priority);
  }

  if (sort === "due_date") {
    query += " ORDER BY due_date ASC";
  } else if (sort === "priority") {
    query +=
      " ORDER BY CASE priority WHEN 'High' THEN 1 WHEN 'Medium' THEN 2 ELSE 3 END";
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error("Error fetching tasks:", err.message);
      return res.status(500).json({ message: "Failed to fetch tasks." });
    }
    res.json(rows);
  });
});

app.patch("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { status, priority } = req.body;

  if (!status && !priority) {
    return res.status(400).json({
      message: "At least one field (status or priority) must be provided.",
    });
  }

  let query = "UPDATE tasks SET";
  const fields = [];
  const params = [];

  if (status) {
    fields.push("status = ?");
    params.push(status);
  }

  if (priority) {
    fields.push("priority = ?");
    params.push(priority);
  }

  query += " " + fields.join(", ") + " WHERE id = ?";
  params.push(id);

  db.run(query, params, function (err) {
    if (err) {
      console.error("Error updating task:", err.message);
      return res.status(500).json({ message: "Failed to update task." });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.json({ message: "Task updated successfully." });
  });
});

app.get("/insights", (req, res) => {
  const insights = {};

  const queries = [
    {
      key: "openTasks",
      sql: "SELECT COUNT(*) AS count FROM tasks WHERE status = 'Open'",
    },
    {
      key: "priorityCount",
      sql: "SELECT priority, COUNT(*) AS count FROM tasks GROUP BY priority",
    },
    {
      key: "dueSoon",
      sql: "SELECT COUNT(*) AS count FROM tasks WHERE julianday(due_date) - julianday('now') <= 3 AND status != 'Done'",
    },
  ];

  let completed = 0;

  queries.forEach((q) => {
    db.all(q.sql, [], (err, rows) => {
      completed++;
      if (err) {
        console.error(`Error fetching ${q.key}:`, err.message);
      } else {
        insights[q.key] = rows;
      }

      if (completed === queries.length) {
        const totalOpen = insights.openTasks?.[0]?.count || 0;
        const highPriority =
          insights.priorityCount?.find((p) => p.priority === "High")?.count ||
          0;
        const dueSoon = insights.dueSoon?.[0]?.count || 0;

        let summary = `You currently have ${totalOpen} open tasks. `;
        if (highPriority > 0)
          summary += `${highPriority} of them are high priority. `;
        if (dueSoon > 0)
          summary += `${dueSoon} tasks are due within the next 3 days.`;
        if (summary.trim() === "") summary = "No tasks found.";

        res.json({ insights, summary });
      }
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
