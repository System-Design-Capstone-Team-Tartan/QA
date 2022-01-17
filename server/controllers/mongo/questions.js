const models = require('../../models/mongo');

module.exports = {
  get: (req, res, next) => {
    const { product_id: productId } = req.query;
    let { count = 5, page = 1 } = req.query;
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
        .then((results) => {
          res.status(200).json({
            status: 'OK',
            data: {
              product_id: productId,
              results,
            },
          });
        })
        .catch(next);
    }
  },
  post: (req, res, next) => {
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
        .catch(next);
    }
  },
  putHelpful: (req, res, next) => {
    const { question_id } = req.params;
    models.questions.update({ question_id }, { $inc: { helpfulness: 1 } })
      .then((response) => {
        res.status(204).json({ status: 'NO CONTENT' });
      })
      .catch(next);
  },
  putReport: (req, res, next) => {
    const { question_id } = req.params;
    models.questions.update({ question_id }, { reported: true })
      .then((response) => {
        res.status(204).json({ status: 'NO CONTENT' });
      })
      .catch(next);
  },
};
