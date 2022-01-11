// TODO: var models = require('../models');

module.exports = {
  get: (req, res) => {
    res.status(200).json({ status: 'OK' });
  },
  post: (req, res) => {
    res.status(201).json({ status: 'Created' });
  },
  putHelpful: (req, res) => {
    res.status(204).json({ status: 'No content' });
  },
  putReport: (req, res) => {
    res.status(204).json({ status: 'No content' });
  },
};
