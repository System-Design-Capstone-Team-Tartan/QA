const db = require('../../db/postgres');

module.exports = {
  // GET /qa/questions Retrieves a list of questions
  // for a particular product. This list does not
  // include any reported questions.
  query: (productId, count = 5, page = 1) => db.query(
    `SELECT q.question_id, question_body, question_date, asker_name, question_helpfulness, reported, answers_array.answers
     FROM questions q
     LEFT JOIN
      (SELECT question_id, json_agg(ans) AS answers
        FROM (SELECT answer_id AS id, body, date, answerer_name, helpfulness, photos, question_id
                FROM answers WHERE question_id
                  IN (SELECT question_id FROM questions WHERE product_id=$1))
            AS ans GROUP BY question_id) AS answers_array
    ON answers_array.question_id=q.question_id
    WHERE q.product_id=$1
    ORDER BY q.question_helpfulness DESC
    LIMIT $2 OFFSET $3;`,
    [productId, count, ((page - 1) * count)],
  ),
  // Adds a question for the given product
  insert: (productId, body, name, email) => db.query(
    `INSERT INTO questions (product_id, question_body, asker_name, email)
     VALUES ($1, $2, $3, $4);`,
    [productId, body, name, email],
  ),
  // Updates a question to show it was found helpful.
  updateHelpful: (questionId) => db.query(
    `UPDATE questions
    SET question_helpfulness=question_helpfulness+1
    WHERE question_id=$1;`,
    [questionId],
  ),
  // Updates a question to show it was reported.
  // Note, this action does not delete the question,
  // but the question will not be returned in the above GET request.
  updateReported: (questionId) => db.query(
    `UPDATE questions
     SET reported=true
     WHERE question_id=$1;`,
    [questionId],
  ),
};
