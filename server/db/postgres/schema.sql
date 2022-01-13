-- Connect to tmp database to reinitialize qa
\c tmp
DROP DATABASE IF EXISTS qa;
CREATE DATABASE qa;
-- Connect to qa database
\c qa

DROP TABLE IF EXISTS questions CASCADE;
CREATE TABLE questions (
  question_id SERIAL,
  product_id varchar(20),
  question_body varchar(1000) NOT NULL,
  question_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  asker_name varchar(60) NOT NULL,
  question_helpfulness INT NOT NULL DEFAULT 0,
  reported BOOLEAN NOT NULL DEFAULT FALSE,
  email varchar(60),
  PRIMARY KEY (question_id)
);

-- Create temporary answers & images tables
DROP TABLE IF EXISTS answers_tmp CASCADE;
CREATE TABLE answers_tmp (
  answer_id INT NOT NULL,
  question_id INT NOT NULL,
  body varchar(1000),
  date TIMESTAMP WITH TIME ZONE,
  answerer_name varchar(60),
  email varchar(60),
  reported BOOLEAN NOT NULL DEFAULT FALSE,
  helpfulness INT NOT NULL DEFAULT 0,
  FOREIGN KEY (question_id)
    REFERENCES questions(question_id),
  PRIMARY KEY (answer_id)
);

DROP TABLE IF EXISTS images_tmp CASCADE;
CREATE TABLE images_tmp (
  image_id INT NOT NULL,
  answer_id INT NOT NULL,
  url varchar(3000),
  PRIMARY KEY (image_id)
);

-- Copy data from questions.csv, answers.csv, & answers_photos.csv
copy questions (question_id, product_id, question_body, question_date, asker_name, email, reported, question_helpfulness)
  from '/home/aaron/Documents/hackReactor/git_repo/SDC/server/db/postgres/CSV/questions.csv'
  with (format csv, header true, delimiter ',');
copy answers_tmp (answer_id, question_id, body, date, answerer_name, email, reported, helpfulness)
  from '/home/aaron/Documents/hackReactor/git_repo/SDC/server/db/postgres/CSV/answers.csv'
  with (format csv, header true, delimiter ',');
copy images_tmp (image_id, answer_id, url)
  from '/home/aaron/Documents/hackReactor/git_repo/SDC/server/db/postgres/CSV/answers_photos.csv'
  with (format csv, header true, delimiter ',');

-- Update SERIAL sequence for questions.question_id column
SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"questions"', 'question_id')),
(SELECT (MAX("question_id") + 1) FROM "questions"), FALSE);

  -- Map image_urls (array) as a column w/in new answers table
DROP TABLE IF EXISTS answers CASCADE;
CREATE TABLE answers AS (
  SELECT a.answer_id, a.question_id, a.body, a.date, a.answerer_name, a.email, a.reported, a.helpfulness, i.photos
  FROM answers_tmp a
  LEFT JOIN (SELECT answer_id, array_agg(url) FROM images_tmp GROUP BY answer_id) AS i (answer_id, photos)
  ON a.answer_id=i.answer_id
);
