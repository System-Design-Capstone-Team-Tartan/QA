const mongoose = require('mongoose');
const config = require('../../../config');

mongoose.connect(
  encodeURI(config.mongo.devURI),
  {
    useNewURLParser: true,
    useUnifiedTopology: true,
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
  asker_email: {
    type: String,
    required: 'questioner email is required',
    maxLength: 60,
  },
  answers: [answerSchema],
});

module.exports = mongoose.model('Questions', questionSchema);
