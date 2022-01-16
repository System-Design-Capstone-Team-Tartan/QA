const db = require('../db/mongo');

module.exports = {
  // Returns answers for a given question. This list does not include any reported answers.
  // Should sort by helpfulness w/ seller's answers on top
  query: (questionId, count = 5, page = 1) => db
    .find({ question_id: questionId, reported: false })
    // TODO: make sure this is filtering w/in subschema
    .sort({ helpfulness: -1 })
    .skip((page - 1) * count)
    .limit(count),

  // Adds an answer for the given question
  insert: (params) => db
    .create(params),

  // Updates an answer
  // filter by product_id
  // update reported OR helpfulness count
  // {reported: true}
  // {$inc: { helpfulness: 1 }}
  update: (filter, update) => db
    // TODO: make sure this is updating the
    // corresponding entry w/in the answers subschema
    .findOneAndUpdate(filter, update),
};
