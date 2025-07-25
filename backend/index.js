const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('./database.db');

db.run(`CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  day TEXT
)`);

app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) return res.status(500).send(err);
    res.json(rows);
  });
});

app.post('/tasks', (req, res) => {
  const { title, day } = req.body;
  db.run('INSERT INTO tasks (title, day) VALUES (?, ?)', [title, day], function (err) {
    if (err) return res.status(500).send(err);
    res.json({ id: this.lastID, title, day });
  });
});

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, day } = req.body;
  db.run('UPDATE tasks SET title = ?, day = ? WHERE id = ?', [title, day, id], function (err) {
    if (err) return res.status(500).send(err);
    res.json({ id, title, day });
  });
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM tasks WHERE id = ?', id, function (err) {
    if (err) return res.status(500).send(err);
    res.json({ deleted: id });
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
