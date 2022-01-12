\c qa

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

CREATE TABLE answers (
  answer_id INT NOT NULL,
  question_id INT NOT NULL,
  body varchar(1000),
  date TIMESTAMP WITH TIME ZONE,
  answerer_name varchar(60),
  helpfulness INT NOT NULL DEFAULT 0,
  reported BOOLEAN NOT NULL DEFAULT FALSE,
  email varchar(60),
  image_urls text[],
  FOREIGN KEY (question_id)
    REFERENCES questions(question_id),
  PRIMARY KEY (answer_id)
);
