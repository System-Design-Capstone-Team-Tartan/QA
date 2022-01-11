var db = require('../db/postgres');

module.exports = {
  queryOne: () => {
  // Returns answers for a given question. This list does not include any reported answers.
  },
  create: () => {
  // Adds an answer for the given question
  },
  update: () => {
  // Updates an answer to show it was found helpful.
  // Updates an answer to show it has been reported.
  // Note, this action does not delete the answer,
  // but the answer will not be returned in the above GET request.
  },
};
