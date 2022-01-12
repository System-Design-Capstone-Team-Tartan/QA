const models = require('../models');

module.exports = {
  get: (req, res) => {
    const { question_id, count = 5, page = 1 } = req.params;
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
            res.status(400).json({ status: 'Error', msg: 'No results for question_id' });
          } else {
            res.status(200).json({
              status: 'OK',
              data: {
                question: questionId, page, count, results,
              },
            });
          }
        })
        .catch((err) => res.status(500).json({ msg: 'Internal database error', err }));
    }
  },
  post: (req, res) => {
    const { question_id: questionId } = req.params;
    const { body, name, email, photos } = req.body;
    res.status(201).json({ status: 'CREATED' });
  },
  putHelpful: (req, res) => {
    res.status(204).json({ status: 'NO CONTENT' });
  },
  putReport: (req, res) => {
    res.status(204).json({ status: 'NO CONTENT' });
  },
};
