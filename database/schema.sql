
CREATE DATABASE IF NOT EXISTS mock_exam;
USE mock_exam;

CREATE TABLE questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  question_text VARCHAR(255),
  correct_option VARCHAR(255)
);

CREATE TABLE options (
  id INT PRIMARY KEY AUTO_INCREMENT,
  question_id INT,
  option_text VARCHAR(255),
  FOREIGN KEY (question_id) REFERENCES questions(id)
);
