-- connect to tmp database to reinitialize qa
\c tmp

DROP DATABASE IF EXISTS qa;
CREATE DATABASE qa;
\c qa

DROP TABLE IF EXISTS questions CASCADE;
CREATE TABLE questions (
  question_id INT NOT NULL,
  product_id varchar(20),
  question_body varchar(1000),
  question_date TIMESTAMP WITH TIME ZONE,
  asker_name varchar(60),
  question_helpfulnes INT NOT NULL,
  reported BOOLEAN NOT NULL DEFAULT FALSE,
  email varchar(60),
  PRIMARY KEY (question_id)
);

DROP TABLE IF EXISTS answers CASCADE;
CREATE TABLE answers (
  answer_id INT NOT NULL,
  question_id INT NOT NULL,
  body varchar(1000),
  date TIMESTAMP WITH TIME ZONE,
  answerer_name varchar(60),
  email varchar(60),
  reported BOOLEAN NOT NULL DEFAULT FALSE,
  helpfulness INT NOT NULL DEFAULT 0,
  image_urls text[],
  FOREIGN KEY (question_id)
    REFERENCES questions(question_id),
  PRIMARY KEY (answer_id)
);

-- [] Questions headers updated
-- id	 product_id	 body	 date_written	 asker_name	 asker_email	 reported	 helpful
-- \COPY questions (id, product_id, body, date_written, asker_name, asker_email, reported, helpful)
--   FROM './CSV/questions.csv'
--   with (format csv,header true, delimiter ',');

-- [x] Answers headers updated
COPY answers (answer_id, question_id, body, date, answerer_name, email, reported, helpfulness)
  FROM '/CSV/answers.csv'
  with (format csv, header true, delimiter ',');

-- Photos headers
-- id, answer_id, url
