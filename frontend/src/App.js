
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);

  useEffect(() => {
    axios.get("/api/questions").then(res => setQuestions(res.data));
  }, []);

  const handleChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const submitExam = () => {
    axios.post("/api/submit", { answers }).then(res => setScore(res.data.score));
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Mock Exam</h1>
      {questions.map((q, i) => (
        <div key={i}>
          <p>{i + 1}. {q.question}</p>
          {q.options.map((opt, idx) => (
            <div key={idx}>
              <input
                type="radio"
                name={`q${i}`}
                value={opt}
                onChange={() => handleChange(i, opt)}
              />
              {opt}
            </div>
          ))}
        </div>
      ))}
      <button onClick={submitExam}>Submit</button>
      {score !== null && <h2>Score: {score}</h2>}
    </div>
  );
}

export default App;
