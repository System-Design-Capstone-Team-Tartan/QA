var db = require('../db/postgres');

module.exports = {
  getAll: () => {
  // GET /qa/questions Retrieves a list of questions
  // for a particular product. This list does not
  // include any reported questions.
  },
  create: () => {
  // Adds a question for the given product
  },
  update: () => {
  // Updates a question to show it was found helpful.
  // Updates a question to show it was reported.
  // Note, this action does not delete the question,
  // but the question will not be returned in the above GET request.
  },
};
