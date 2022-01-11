// TODO: var models = require('../models');
const db = require('../db/postgres/');

module.exports = {
  get: (req, res) => {
    db.query();
    res.status(200).json({ status: 'OK' });
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
