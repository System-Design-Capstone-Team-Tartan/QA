const models = require('../models');

module.exports = {
  get: (req, res) => {
    let {
      product_id: productId, count = 5, page = 1,
    } = req.query;
    count = Number(count);
    page = Number(page);
    productId = productId.toString();
    if (count % 1 !== 0 || count <= 0) {
      res.status(400).json({ status: 'Error', msg: 'count must be whole number greater than 0' });
    } else if (page % 1 !== 0 || page <= 0) {
      res.status(400).json({ status: 'Error', msg: 'page must be whole number greater than 0' });
    } else {
      models.questions.query(productId, count, page)
        .then((response) => {
          const { rows: questionsArray } = response;
          if (!questionsArray || questionsArray.length < 1) {
            res.status(400).json({ status: 'Error', msg: 'No results' });
          } else {
            const queryAnswers = questionsArray.map((question) => models.answers.query(
              question.question_id,
            ));
            Promise.all(queryAnswers)
              .then((queryAnswersResponseArray) => {
                // Map the answersResponseArray into questionsArray as
                // a new property 'answers that's an object
                // with key=answer_id and all properties contained
                const results = questionsArray.map((question, idx) => {
                  const answersObj = queryAnswersResponseArray[idx].rows.reduce(
                    (obj, answer) => {
                      const ans = answer;
                      ans.id = answer.answer_id;
                      delete ans.answer_id;
                      return Object.assign(obj, { [ans.id]: ans });
                    },
                    {},
                  );
                  const q = question;
                  q.answers = answersObj;
                  return q;
                });
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
