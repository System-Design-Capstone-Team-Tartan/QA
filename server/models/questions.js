const db = require('../db/mongo');

module.exports = {
  // GET /qa/questions Retrieves a list of questions
  // for a particular product. This list does not
  // include any reported questions.
  query: (productId, count = 5, page = 1) => db
    .find({ product_id: productId, reported: false })
    .sort({ question_helpfulness: -1 })
    .skip((page - 1) * count)
    .limit(count),
  // Adds a question for the given product
  insert: (params) => db
    .create(params),
  // Updates question
  // filter by product_id
  // update reported OR helpfulness count
  // {reported: true}
  // {$inc: { helpfulness: 1 }}
  update: (filter, update) => db
    .findOneAndUpdate(filter, update),
};
