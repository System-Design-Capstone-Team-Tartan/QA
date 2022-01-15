/* You'll need to have Postgresql running and your Node server running
 * for these tests to pass. */
const axios = require('axios');
const sampleData = require('./sampleData');
const config = require('../config');

// const { Pool } = require('pg');
// const config = require('../config');

describe('GET request data shape matches sample data', () => {
  it('Get questions endpoint response data shape must match sample data', (done) => {
    axios.get(`http://${config.host}:${config.port}/qa/questions?product_id=36`)
      .then((response) => {
        const { data } = response.data;
        data.results.forEach((question) => {
          expect(Object.keys(question)).toEqual(Object.keys(sampleData.questions.results[0]));
        });
        done();
      });
  });
});
