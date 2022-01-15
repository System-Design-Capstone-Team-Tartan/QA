/* You'll need to have Postgresql running and your Node server running
 * for these tests to pass. */
const axios = require('axios');
const sampleData = require('./sampleData');
const config = require('../config');
const db = require('../server/db/postgres');

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
  afterAll(() => {
    db.end();
  }); // TODO: end pool afterwards and determine what async fns are not stopped after tests;
  it('Should add a question to the database (questions endpoint)', (done) => {
    const payload = {
      body: 'Can I wash it?',
      name: 'InquisitiveUser',
      email: 'IAskQuestions@mail.com',
      product_id: 36,
    };
    axios.post(`http://${config.host}:${config.port}/qa/questions`, payload)
      .then((data) => {
        // query database for question manually
        const queryText = `
        SELECT asker_name AS name, question_body AS body
        FROM questions
        WHERE product_id=$1
        AND email=$2`;
        const queryParams = [payload.product_id, payload.email];
        return db.query(queryText, queryParams)
          .then((response) => {
            const { name, body } = response.rows[0];
            expect(name).toEqual(payload.name);
            expect(body).toEqual(payload.body);
          })
          // delete posted data manually
          .then((response) => {
            db.query(
              'DELETE FROM questions WHERE product_id=$1 AND email=$2',
              [payload.product_id, payload.email],
            );
            done();
          })
          .catch((err) => {
            console.error(err);
            done();
          });
      });
  });
});
