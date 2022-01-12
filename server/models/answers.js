const db = require('../db/postgres');

module.exports = {
  // Returns answers for a given question. This list does not include any reported answers.
  // Should sort by helpfulness w/ seller's answers on top
  query: (questionId, count = 5, page = 1) => db.query(
    'SELECT * FROM answers WHERE question_id=$1 AND reported=false ORDER BY helpfulness DESC LIMIT $2 OFFSET $3;',
    [questionId, count, ((page - 1) * count)],
  ),
  // Adds an answer for the given question
  create: (body, name, email, photos) => db.query(
    'INSERT INTO answers (body, answerer_name, email, photos) VALUES ($1, $2, $3, $4)',
    [body, name, email, photos],
  ),
  // Updates an answer to show it was found helpful.
  // Updates an answer to show it has been reported.
  // Note, this action does not delete the answer,
  // but the answer will not be returned in the above GET request.
  update: () => {
  },
};
