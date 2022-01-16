const models = require('../models');

module.exports = {
  get: (req, res) => {
    let {
      product_id: productId, count = 5, page = 1,
    } = req.query;
    count = Number(count);
    page = Number(page);
    if (count % 1 !== 0 || count <= 0) {
      res.status(400).json({ status: 'Error', msg: 'count must be whole number greater than 0' });
    } else if (page % 1 !== 0 || page <= 0) {
      res.status(400).json({ status: 'Error', msg: 'page must be whole number greater than 0' });
    } else if (!productId || Number.isNaN(parseInt(productId, 10))) {
      res.status(400).json({ status: 'Error', msg: 'product_id is required and must be a number' });
    } else {
      models.questions.query(productId, count, page)
        .then((response) => {
          const { rows: questionsArray } = response;
          if (!questionsArray || questionsArray.length < 1) {
            res.status(400).json({ status: 'Error', msg: 'No results' });
          } else {
            // TODO: move this logic to a utility fn
            // update Copied variables
            const results = questionsArray.map((question) => {
              const questionCopy = question;
              const answersCopy = question.answers.reduce(
                (obj, answer) => {
                  const answerCopy = answer;
                  delete answerCopy.question_id;
                  delete answerCopy.reported;
                  delete answerCopy.email;
                  answerCopy.id = answerCopy.answer_id;
                  delete answerCopy.answer_id;
                  Object.assign(obj, { [answer.id]: answer });
                  return obj;
                },
                {},
              );
              questionCopy.answers = answersCopy;
              delete questionCopy.email;
              delete questionCopy.product_id;
              return questionCopy;
            });
            return res.status(200).json({
              status: 'OK',
              data: {
                product_id: productId,
                results,
              },
            });
          }
        })
        .catch((err) => {
          console.error('Internal database error fetching answers\n', err);
          res.status(500).json({ msg: 'Internal database error fetching questions\n' });
        });
    }
  },
  post: (req, res) => {
    const {
      product_id: productId, body, name, email,
    } = req.body;
    if (!body || typeof body !== 'string' || body.length > 1000) {
      res.status(400).json({ status: 'Error', msg: 'answer body must be string <= 1000 chars in length' });
    } else if (!name || typeof name !== 'string' || name.length > 60) {
      res.status(400).json({ status: 'Error', msg: 'name must be string <= 60 chars in length' });
    } else if (!productId || typeof productId !== 'number' || productId <= 0 || productId % 1 !== 0) {
      res.status(400).json({ status: 'Error', msg: 'product_id must be an integer' });
    } else if (!email || typeof email !== 'string' || email.length > 60) {
      // TODO: use regex for e-mail verification
      res.status(400).json({ status: 'Error', msg: 'email must be string <= 60 chars in length' });
    } else {
      models.questions.insert(productId, body, name, email)
        .then((response) => {
          res.status(201).json({ status: 'CREATED' });
          // TODO: handle duplicate entry gracefully
        })
        .catch((err) => {
          console.error('Internal database error posting answer\n', err);
          res.status(500).json({ msg: 'Internal database error posting answer\n' });
        });
    }
  },
  putHelpful: (req, res) => {
    const { question_id } = req.params;
    const questionId = question_id.toString();
    models.questions.updateHelpful(questionId)
      .then((response) => {
        res.status(204).json({ status: 'NO CONTENT' });
      })
      .catch((err) => {
        console.error('Internal database error updating helpful count\n', err);
        res.status(500).json({ msg: 'Internal database error updating helpful count for question\n' });
      });
  },
  putReport: (req, res) => {
    const { question_id } = req.params;
    const questionId = question_id.toString();
    models.questions.updateReported(questionId)
      .then((response) => {
        res.status(204).json({ status: 'NO CONTENT' });
      })
      .catch((err) => {
        console.error('Internal database error updating helpful count\n', err);
        res.status(500).json({ msg: 'Internal database error updating reported for question\n' });
      });
  },
};
