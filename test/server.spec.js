/* You'll need to have Postgresql running and your Node server running
 * for these tests to pass. */
const axios = require('axios');
const sampleData = require('./sampleData');
const config = require('../config');
const db = require('../db/postgres');

describe.only('Q&A GET endpoints', () => {
  it('Should return payload w/ data shape matching sample data (questions endpoint)', (done) => {
    const productId = 36;
    axios.get(`http://${config.host}:${config.port}/qa/questions?product_id=${productId}`)
      .then((response) => {
        const { data } = response.data;
        data.results.forEach((actualQuestionObject) => {
          // Verify keys match
          expect(Object.keys(actualQuestionObject))
            .toEqual(Object.keys(sampleData.questions.results[0]));
          // Verify values' type matches
          const expectedQuestionObject = sampleData.questions.results[0];
          Object.keys(expectedQuestionObject).forEach((key) => {
            expect(typeof expectedQuestionObject[key]).toEqual(typeof actualQuestionObject[key]);
          });
        });
        done();
      });
  });
  it('Should return payload w/ data shape matching sample data (answers endpoint)', (done) => {
    const questionId = 1;
    axios.get(`http://${config.host}:${config.port}/qa/questions/${questionId}/answers`)
      .then((response) => {
        const { data } = response.data;
        data.results.forEach((actualAnswerObject) => {
          // Verify keys match
          expect(Object.keys(actualAnswerObject))
            .toEqual(Object.keys(sampleData.answers.results[0]));
          // Verify values' type matches
          const expectedAnswerObject = sampleData.answers.results[0];
          Object.keys(expectedAnswerObject).forEach((key) => {
            expect(typeof expectedAnswerObject[key]).toEqual(typeof actualAnswerObject[key]);
          });
        });
        done();
      });
  });
});

describe('Q&A POST endpoints', () => {
  afterAll(() => {
    db.end();
  }); // TODO: end pool afterwards and determine what async fns are not stopped after tests;
  it('Should add question to the questions table of the qa database', (done) => {
    const payload = {
      body: 'Can I wash it?',
      name: 'InquisitiveUser',
      email: 'IAskQuestions@mail.com',
      product_id: 36,
    };
    axios.post(`http://${config.host}:${config.port}/qa/questions`, payload)
      .then(() => {
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
          .then(() => {
            db.query(
              'DELETE FROM questions WHERE product_id=$1 AND email=$2',
              queryParams,
            );
            done();
          })
          .catch((err) => {
            console.error(err);
            done();
          });
      });
  });

  it('Should add an answer to the answers table of the qa database', (done) => {
    const questionId = 1;
    // TODO: make payload unique each time
    // to get around duplicate entry check
    const payload = {
      body: 'Yes you can!',
      name: 'asdfasdfasdf',
      email: 'sdfsdf@mail.com',
      photos: [],
    };
    axios.post(`http://${config.host}:${config.port}/qa/questions/${questionId}/answers`, payload)
      .then(() => {
        // query database for answer manually
        const queryText = `
      SELECT answerer_name AS name, body
      FROM answers
      WHERE question_id=$1
      AND email=$2`;
        const queryParams = [questionId, payload.email];
        return db.query(queryText, queryParams)
          .then((response) => {
            const { name, body } = response.rows[0];
            expect(name).toEqual(payload.name);
            expect(body).toEqual(payload.body);
          })
          // delete posted data manually
          .then(() => {
            db.query(
              'DELETE FROM answers WHERE question_id=$1 AND email=$2',
              queryParams,
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
