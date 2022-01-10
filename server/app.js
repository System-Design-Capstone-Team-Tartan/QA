const express = require('express');
const path = require('path');
const utils = require('./lib/utils');

const app = express();

// Middleware
const morgan = require('morgan');
const cors = require('cors');

app.use(morgan('dev')); // TODO: update in prod
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('hello world');
});

module.exports = app;
