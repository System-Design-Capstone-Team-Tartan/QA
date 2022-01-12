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
  question_helpfulness INT NOT NULL,
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

-- [x] Questions headers updated
copy questions (question_id, product_id, question_body, question_date, asker_name, email, reported, question_helpfulness)
  from '/home/aaron/Documents/hackReactor/git_repo/SDC/server/db/postgres/CSV/questions.csv'
  with (format csv, header true, delimiter ',');

-- [x] Answers headers updated
copy answers (answer_id, question_id, body, date, answerer_name, email, reported, helpfulness)
  from '/home/aaron/Documents/hackReactor/git_repo/SDC/server/db/postgres/CSV/answers.csv'
  with (format csv, header true, delimiter ',');

DROP TABLE IF EXISTS images CASCADE;
CREATE TABLE images (
  image_id INT NOT NULL,
  answer_id INT NOT NULL,
  url varchar(3000),
  FOREIGN KEY (answer_id)
    REFERENCES answers(answer_id),
  PRIMARY KEY (image_id)
);

-- [x] Photos headers updated
copy images (image_id, answer_id, url)
  from '/home/aaron/Documents/hackReactor/git_repo/SDC/server/db/postgres/CSV/answers_photos.csv'
  with (format csv, header true, delimiter ',');

  -- TODO: map urls to answers table and store in a single column as an array
