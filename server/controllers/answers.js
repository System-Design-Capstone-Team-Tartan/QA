const models = require('../models');

module.exports = {
  get: (req, res) => {
    const { count = 5, page = 1 } = req.query;
    const { question_id } = req.params;
    const questionId = question_id.toString();
    if (count % 1 !== 0 || count <= 0) {
      res.status(400).json({ status: 'Error', msg: 'count must be whole number greater than 0' });
    } else if (page % 1 !== 0 || page <= 0) {
      res.status(400).json({ status: 'Error', msg: 'page must be whole number greater than 0' });
    } else {
      models.answers.query(questionId, count, page)
        .then((response) => {
          const { rows: results } = response;
          if (!results || results.length < 1) {
            res.status(400).json({ status: 'Error', msg: 'No results' });
          } else {
            res.status(200).json({
              status: 'OK',
              data: {
                question: questionId, page, count, results,
              },
            });
          }
        })
        .catch((err) => {
          console.error('Internal database error fetching answers\n', err);
          res.status(500).json({ msg: 'Internal database error fetching answers\n' });
        });
    }
  },
  post: (req, res) => {
    const { question_id } = req.params;
    const questionId = question_id.toString();
    const {
      body, name, email, photos,
    } = req.body;
    if (!body || typeof body !== 'string' || body.length > 1000) {
      res.status(400).json({ status: 'Error', msg: 'answer body must be string <= 1000 chars in length' });
    } else if (!name || typeof name !== 'string' || name.length > 60) {
      res.status(400).json({ status: 'Error', msg: 'name must be string <= 60 chars in length' });
    } else if (!email || typeof email !== 'string' || email.length > 60) {
      res.status(400).json({ status: 'Error', msg: 'email must be string <= 60 chars in length' });
    } else if (!Array.isArray(photos) || photos.some((photo) => typeof photo !== 'string')) {
      res.status(400).json({ status: 'Error', msg: 'photos must be array of strings' });
    } else {
      models.answers.create(questionId, body, name, email, photos)
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
    const { answer_id } = req.params;
    const answerId = answer_id.toString();
    return models.answers.updateHelpful(answerId)
      .then((response) => {
        res.status(204).json({ status: 'NO CONTENT' });
      })
      .catch((err) => {
        console.error('Internal database error updating helpful count\n', err);
        res.status(500).json({ msg: 'Internal database error updating helpful count\n' });
      });
  },
  putReport: (req, res) => {
    const { answer_id } = req.params;
    const answerId = answer_id.toString();
    return models.answers.updateReported(answerId)
      .then((response) => {
        res.status(204).json({ status: 'NO CONTENT' });
      })
      .catch((err) => {
        console.error('Internal database error updating reported\n', err);
        res.status(500).json({ msg: 'Internal database error updating reported\n' });
      });
  },
};
