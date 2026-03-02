
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.get('/api/questions', async (req, res) => {
  const [questions] = await db.query("SELECT id, question_text FROM questions");
  const result = [];

  for (let q of questions) {
    const [options] = await db.query(
      "SELECT option_text FROM options WHERE question_id = ?",
      [q.id]
    );
    result.push({
      id: q.id,
      question: q.question_text,
      options: options.map(o => o.option_text)
    });
  }

  res.json(result);
});

app.post('/api/submit', async (req, res) => {
  const answers = req.body.answers;
  let score = 0;

  for (let i = 0; i < answers.length; i++) {
    const [rows] = await db.query(
      "SELECT correct_option FROM questions WHERE id = ?",
      [i + 1]
    );
    if (rows[0] && rows[0].correct_option === answers[i]) {
      score++;
    }
  }

  res.json({ score });
});

// Serve React build
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
