const models = require('../models');

module.exports = {
  get: (req, res, next) => {
    try {
      let { count = 5, page = 1 } = req.query;
      const { question_id: questionId } = req.params;
      count = Number(count);
      page = Number(page);
      if (count % 1 !== 0 || count <= 0) {
        res.status(400).json({ status: 'Error', msg: 'count must be whole number greater than 0' });
      } else if (page % 1 !== 0 || page <= 0) {
        res.status(400).json({ status: 'Error', msg: 'page must be whole number greater than 0' });
      } else if (!questionId || Number.isNaN(parseInt(questionId, 10))) {
        res.status(400).json({ status: 'Error', msg: 'question_id is required and must be a number' });
      } else {
        models.answers.query(questionId, count, page)
          .then((response) => {
            const { rows: results } = response;
            res.status(200).json({
              status: 'OK',
              data: {
                question: questionId, page, count, results,
              },
            });
          })
          .catch(next);
      }
    } catch {
      res.status(500).json({ msg: 'Internal database error gettings answers' });
      next();
    }
  },
  post: (req, res, next) => {
    try {
      const { question_id: questionId } = req.params;
      const {
        body, name, email, photos,
      } = req.body;
      if (!body || typeof body !== 'string' || body.length > 1000) {
        res.status(400).json({ status: 'Error', msg: 'answer body must be string <= 1000 chars in length' });
      } else if (!name || typeof name !== 'string' || name.length > 60) {
        res.status(400).json({ status: 'Error', msg: 'name must be string <= 60 chars in length' });
      } else if (!email || typeof email !== 'string' || email.length > 60) {
        // TODO: use regex for e-mail verification
        res.status(400).json({ status: 'Error', msg: 'email must be string <= 60 chars in length' });
      } else if (!Array.isArray(photos) || photos.some((photo) => typeof photo !== 'string')) {
        res.status(400).json({ status: 'Error', msg: 'photos must be array of strings' });
      } else {
        models.answers.create(questionId, body, name, email, photos)
          .then(() => {
            res.status(201).json({ status: 'CREATED' });
            // TODO: handle duplicate entry gracefully
          })
          .catch(next);
      }
    } catch {
      res.status(500).json({ msg: 'Internal database error posting new answer' });
      next();
    }
  },
  putHelpful: (req, res, next) => {
    try {
      const { answer_id: answerId } = req.params;
      models.answers.updateHelpful(answerId)
        .then(() => {
          res.status(204).json({ status: 'NO CONTENT' });
        })
        .catch(next);
    } catch {
      res.status(500).json({ msg: 'Internal database error updating helpful count for answer' });
      next();
    }
  },
  putReport: (req, res, next) => {
    try {
      const { answer_id: answerId } = req.params;
      models.answers.updateReported(answerId)
        .then(() => {
          res.status(204).json({ status: 'NO CONTENT' });
        })
        .catch(next);
    } catch {
      res.status(500).json({ msg: 'Internal database error updating reported for answer' });
      next();
    }
  },
};
