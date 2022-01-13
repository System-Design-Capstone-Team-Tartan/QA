const models = require('../models');

module.exports = {
  get: (req, res) => {
    const {
      product_id, count = 5, page = 1,
    } = req.query;
    const productId = product_id.toString();
    if (count % 1 !== 0 || count <= 0) {
      res.status(400).json({ status: 'Error', msg: 'count must be whole number greater than 0' });
    } else if (page % 1 !== 0 || page <= 0) {
      res.status(400).json({ status: 'Error', msg: 'page must be whole number greater than 0' });
    } else {
      models.questions.query(productId, count, page)
        .then((response) => {
          const { rows: questions } = response;
          if (!questions || questions.length < 1) {
            res.status(400).json({ status: 'Error', msg: 'No results' });
          } else {
            const promises = questions.map((question) => models.answers.query(
              question.question_id, 5, 1));
            Promise.all(promises)
              .then(answers => {
                // TODO: map the answers into questions as a new property 'answers that's an object
                // with key=answer_id and all properties contained
                const results = [];
                res.status(200).json({
                  status: 'OK',
                  data: {
                    product_id: productId,
                    results,
                  },
                });
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
    res.status(201).json({ status: 'CREATED' });
  },
  putHelpful: (req, res) => {
    res.status(204).json({ status: 'NO CONTENT' });
  },
  putReport: (req, res) => {
    res.status(204).json({ status: 'NO CONTENT' });
  },
};
