const models = require('../models');
const utils = require('../../utils');

module.exports = {
  get: (req, res, next) => {
    try {
      let {
        count = 5, page = 1,
      } = req.query;
      const { product_id: productId } = req.query;
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
            // TODO: move this logic to a utility fn
            // update Copied variables
            const results = questionsArray.map((question) => {
              const questionCopy = question;
              const answersCopy = !question.answers ? [] : question.answers.reduce(
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
              return questionCopy;
            });
            return res.status(200).json({
              status: 'OK',
              data: {
                product_id: productId,
                results,
              },
            });
          })
          .catch(next);
      }
    } catch {
      res.status(500).json({ msg: 'Internal database error fetching questions' });
      next();
    }
  },
  post: (req, res, next) => {
    try {
      const {
        product_id: productId, body, name, email,
      } = req.body;
      if (!body || typeof body !== 'string' || body.length > 1000) {
        res.status(400).json({ status: 'Error', msg: 'answer body must be string <= 1000 chars in length' });
      } else if (!name || typeof name !== 'string' || name.length > 60) {
        res.status(400).json({ status: 'Error', msg: 'name must be string <= 60 chars in length' });
      } else if (!productId || typeof productId !== 'number' || productId <= 0 || productId % 1 !== 0) {
        res.status(400).json({ status: 'Error', msg: 'product_id must be an integer' });
      } else if (!email || typeof email !== 'string' || email.length > 60 || !utils.validateEmail(email)) {
        res.status(400).json({ status: 'Error', msg: 'email must be a valid email string <= 60 chars in length' });
      } else {
        models.questions.insert(productId, body, name, email)
          .then(() => {
            res.status(201).json({ status: 'CREATED' });
          })
          .catch((err) => {
            if (err.code === '23505') {
              res.status(400).json({ status: 'Error', msg: 'Entry already exists' });
            }
            next();
          });
      }
    } catch {
      res.status(500).json({ msg: 'Internal database error posting answer' });
      next();
    }
  },
  putHelpful: (req, res, next) => {
    try {
      const { question_id: questionId } = req.params;
      models.questions.updateHelpful(questionId)
        .then(() => {
          res.status(204).json({ status: 'NO CONTENT' });
        })
        .catch(next);
    } catch {
      res.status(500).json({ msg: 'Internal database error updating helpful count for question' });
      next();
    }
  },
  putReport: (req, res, next) => {
    try {
      const { question_id: questionId } = req.params;
      models.questions.updateReported(questionId)
        .then(() => {
          res.status(204).json({ status: 'NO CONTENT' });
        })
        .catch(next);
    } catch {
      res.status(500).json({ msg: 'Internal database error updating reported for question' });
      next();
    }
  },
};
