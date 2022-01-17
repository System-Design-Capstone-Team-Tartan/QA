const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const db = require('.');

const f = ['questions.csv', 'answers.csv', 'answers_photos.csv'];
const filename = f[1];
const filePath = path.join('..', 'CSV', filename);
console.log(filePath);
fs.createReadStream(filePath)
  .pipe(csv())
  .on('error', () => {
    console.log('Yowzers! We have an error!');
  })
  .on('data', (data) => {
    if (filename === 'questions.csv') {
      db.create(data);
    } else if (filename === 'answers.csv') {
      let { question_id } = data;
      question_id = Number(question_id);
      db.updateOne(
        { question_id },
        { $addToSet: { answers: data } },
      ).exec();
    } else if (filename === 'answers_photos.csv') {
      let { answer_id } = data;
      answer_id = Number(answer_id);
      db.updateOne(
        { answer_id },
        { $addToSet: { answers: data } },
      ).exec();
    }
  })
  .on('end', () => {
    console.log('data loaded');
  });
