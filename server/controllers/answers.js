const models = require('../models');

module.exports = {
  get: (req, res, next) => {
    let { count = 5, page = 1 } = req.query;
    let { question_id } = req.params;
    count = Number(count);
    page = Number(page);
    if (count % 1 !== 0 || count <= 0) {
      res.status(400).json({ status: 'Error', msg: 'count must be whole number greater than 0' });
    } else if (page % 1 !== 0 || page <= 0) {
      res.status(400).json({ status: 'Error', msg: 'page must be whole number greater than 0' });
    } else if (!question_id || Number.isNaN(parseInt(question_id, 10))) {
      res.status(400).json({ status: 'Error', msg: 'question_id is required and must be a number' });
    } else {
      models.answers.query(question_id, count, page)
        .then((response) => {
          const { rows: results } = response;
          res.status(200).json({
            status: 'OK',
            data: {
              question: question_id, page, count, results,
            },
          });
        })
        .catch(next);
    }
  },
  post: (req, res, next) => {
    const { question_id } = req.params;
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
      models.answers.create({ question_id, body, answerer_name: name, email, photos })
        .then((response) => {
          res.status(201).json({ status: 'CREATED' });
          // TODO: handle duplicate entry gracefully
        })
        .catch(next);
    }
  },
  putHelpful: (req, res, next) => {
    const { answer_id } = req.params;
    models.answers.update({ answer_id }, { $inc: { helpfulness: 1 } })
      .then((response) => {
        res.status(204).json({ status: 'NO CONTENT' });
      })
      .catch(next);
  },
  putReport: (req, res, next) => {
    const { answer_id } = req.params;
    models.answers.update({ answer_id }, { reported: true })
      .then((response) => {
        res.status(204).json({ status: 'NO CONTENT' });
      })
      .catch(next);
  },
};
