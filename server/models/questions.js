const db = require('../db/postgres');

module.exports = {
  // GET /qa/questions Retrieves a list of questions
  // for a particular product. This list does not
  // include any reported questions.
  query: (productId, count, page) => db.query(
    `SELECT question_id, question_body, question_date, asker_name,
             question_helpfulness, reported
     FROM questions
     WHERE product_id=$1
     ORDER BY question_helpfulness DESC
     LIMIT $2 OFFSET $3;`,
    [productId, count, ((page - 1) * count)],
  ),
  // Adds a question for the given product
  insert: () => {
  },
  // Updates a question to show it was found helpful.
  updateHelpful: () => {
  },
  // Updates a question to show it was reported.
  // Note, this action does not delete the question,
  // but the question will not be returned in the above GET request.
  updateReported: () => {

  },
};
