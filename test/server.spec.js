/* You'll need to have Postgresql running and your Node server running
 * for these tests to pass. */
const axios = require('axios');
const sampleData = require('./sampleData');
const config = require('../config');

describe('Q&A GET endpoints', () => {
  it('Should return payload w/ data shape matching sample data (questions endpoint)', (done) => {
    const productId = 36;
    axios.get(`http://${config.host}:${config.port}/qa/questions?product_id=${productId}`)
      .then((response) => {
        const { data } = response.data;
        data.results.forEach((question) => {
          expect(Object.keys(question)).toEqual(Object.keys(sampleData.questions.results[0]));
        });
        done();
      });
  });
  it('Should return payload w/ data shape matching sample data (answers endpoint)', (done) => {
    const questionId = 1;
    axios.get(`http://${config.host}:${config.port}/qa/questions/${questionId}/answers`)
      .then((response) => {
        const { data } = response.data;
        data.results.forEach((answer) => {
          expect(Object.keys(answer)).toEqual(Object.keys(sampleData.answers.results[0]));
        });
        done();
      });
  });
});

describe('Q&A POST endpoints', () => {
  it('Should add a question to the database (questions endpoint)', (done) => {
    const payload = {};
    axios.post(`http://${config.host}:${config.port}/qa/questions`, payload)
      .then((response) => {
        // query database for question manually
        // expect().toEqual();
        // manually remove entry from database
        done();
      });
  });
  it('Should add an answer to the database (answers endpoint)', (done) => {
    const questionId = 1;
    const payload = {}; //TODO: send
    axios.get(`http://${config.host}:${config.port}/qa/questions/${questionId}/answers`, payload)
      .then((response) => {
        // query database for answer manually
        // expect().toEqual();
        // manually remove entry from database
        done();
      });
  });
});
