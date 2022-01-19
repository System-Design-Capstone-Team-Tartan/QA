const compression = require('compression');
const express = require('express');

const app = express();

// Middleware
app.use(compression());
const morgan = require('morgan');
const cors = require('cors');

// Router
const router = require('./routes');
const config = require('../config');

// Logging and parsing
app.use(morgan('dev')); // TODO: update in prod
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up our routes
app.use('/qa', router);

app.get('/', (req, res) => {
  res.status(200).json(config.routes || {});
});

// LOADER.IO TESTING RELATED
app.get(`/${config.loaderIO}` || '<- loader_io_verification token', (req, res) => {
  res.status(200).send(config.loaderIO);
});
app.get('/loader-io/test-params', (req, res) => {
  res.status(200).json(testParams);
});

module.exports = app;
