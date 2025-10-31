const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("tasks.db");

const tasks = [
  [
    "Finish project report",
    "Complete and submit the final report.",
    "High",
    "2025-11-02",
  ],
  [
    "Prepare slides",
    "Create slides for client meeting.",
    "Medium",
    "2025-11-01",
  ],
  ["Email manager", "Send weekly progress update.", "Low", "2025-11-03"],
  ["Code review", "Review PRs from frontend team.", "High", "2025-10-31"],
  ["Optimize DB", "Fix slow queries and indexes.", "Medium", "2025-11-05"],
  ["Plan team outing", "Choose venue and date.", "Low", "2025-11-10"],
];

tasks.forEach((t) => {
  db.run(
    "INSERT INTO tasks (title, description, priority, due_date) VALUES (?, ?, ?, ?)",
    t
  );
});

db.close(() => console.log("Sample data inserted."));
