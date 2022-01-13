const router = require('express').Router();
const controller = require('./controllers');

// Connect controller methods to corresponding routes

// Answers List:
// GET /qa/questions/:question_id/answers
// status: 200
router.get('/questions/:question_id/answers', controller.answers.get);

// List Questions:
// GET /qa/questions
// status 200 OK
router.get('/questions', controller.questions.get);

// Add a Question:
// POST /qa/questions
// status: 201 CREATED
router.post('/questions', controller.questions.post);

// Add an answer
// POST /qa/questions/:question_id/answers
// status: 201 CREATED
router.post('/questions/:question_id/answers', controller.answers.post);

// Mark questions as helpful:
// PUT /qa/questions/:question_id/helpful
// Status: 204 NO CONTENT
router.put('/questions/:question_id/helpful', controller.questions.putHelpful);

// Report question:
// PUT /qa/questions/:question_id/report
// Status: 204 NO CONTENT
router.put('/questions/:question_id/report', controller.questions.putReport);

// Mark answer as helpful:
// PUT /qa/answers/:answer_id/helpful
// Status: 204 NO CONTENT
router.put('/answers/:answer_id/helpful', controller.answers.putHelpful);

// Report answer:
// PUT /qa/answers/:answer_id/report
// status: 204 NO CONTENT
router.put('/answers/:answer_id/report', controller.answers.putHelpful);

module.exports = router;
