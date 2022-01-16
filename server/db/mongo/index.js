const mongoose = require('mongoose');
const config = require('../../../config');

mongoose.connect(
  encodeURI(config.mongo.devURI),
  {
    useNewURLParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
);

const answerSchema = mongoose.Schema({
  id: {
    type: Number,
    index: true,
  },
  body: {
    type: String,
    maxLength: 1000,
    required: 'answer body is required',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  answerer_name: {
    type: String,
    required: 'answerer_name is required',
    maxLength: 60,
  },
  email: {
    type: String,
    required: 'answerer email is required',
    maxLength: 60,
  },
  reported: {
    type: Boolean,
    default: false,
  },
  helpfulness: {
    type: Number,
    default: 0,
  },
  photos: {
    type: Array,
  },
});

const questionSchema = mongoose.Schema({
  product_id: {
    type: Number,
  },
  question_id: {
    type: Number,
    unique: true,
    index: true,
  },
  question_body: {
    type: String,
    required: 'question_body is required',
    maxLength: 1000,
  },
  question_date: {
    type: Date,
    default: Date.now,
  },
  asker_name: {
    type: String,
    required: 'asker_name is required',
    maxLength: 60,
  },
  question_helpfulness: {
    type: Number,
    default: 0,
  },
  reported: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    required: 'questioner email is required',
    maxLength: 60,
  },
  answers: [answerSchema],
});

const Question = mongoose.model('Question', questionSchema);

// TODO: move code below to controllers
// and just export Question

// for querying an answer by question_id quickly
// [] exclude reported answers
// [] sort by helpfulness
// [] return object with keys set to answer_id
module.exports.findAnswers = (questionId) => Question
  .find(questionId)
  // TODO: filter/sort results
  .sort({ helpfulness: -1 });

// for querying by product_id
// [x] exclude reported answers
// [x] limit
// [x] sort by helpfulness descending
// [x] offset
module.exports.findQuestions = (productId, limit, offset) => Question
  .find({ product_id: productId, reported: false })
  .sort({ question_helpfulness: -1 })
  .skip(offset)
  .limit(limit);

// questions: productId, body, name, email
// answers: questionId, body, name, email, photos
  module.exports.insertEntry = (params) => Question
  .create(params);

// query by question_id or product_id
// update reported OR helpfulness count
// {reported: true}
// {$inc: { helpfulness: 1 }}
module.exports.update = (filter, update) => Question
  .findOneAndUpdate(filter, update);

