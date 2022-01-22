const compression = require('compression');
const express = require('express');

const app = express();

// Middleware
app.use(compression());
const morgan = require('morgan');

// Router
const router = require('./routes');
const config = require('../config');

// Logging and parsing
app.use(morgan('dev')); // TODO: update in prod
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up our routes
app.use('/qa', router);

app.get('/', (req, res) => {
  res.status(200).json(config.routes || {});
});

module.exports = app;
