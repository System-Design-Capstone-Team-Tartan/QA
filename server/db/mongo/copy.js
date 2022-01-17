const path = require('path');
const fs = require('fs');
const db = require('.');

// NOTE: it's best to drop the qa database manually
// before running this script

function promisifiedReadStream(stream, headers) {

  return new Promise((resolve, reject) => {
    let data = [];
    stream.on('data', chunk => {
      let values = chunk.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      let object = values.reduce((obj, value, idx) => ({ ...obj, [headers[idx]]: value }), {})
      data.push(object);
      // console.log(headers);
      // console.log(object);
    });
    stream.on('end', () => resolve(data));
    stream.on('error', error => reject(error));
  });
}

function csvToMongoDB(filepath) {
  const filename = path.parse(filepath).name;
  const readStream = fs.createReadStream(filepath, 'utf8');
  const headers = readStream.toString().split('\n')[0]
  console.log(headers);
  return promisifiedReadStream(readStream, headers)
    .then((data) => {
      if (filename === 'questions') {
        return db.create(data);
      }
      if (filename === 'answers') {
        let { question_id } = data;
        question_id = Number(question_id);
        return db.updateOne({ question_id }, { $addToSet: { answers: data } })
      }
      if (filename === 'answers_photos') {
        let { answer_id } = data;
        return db.updateOne(
          {},
          { $addToSet: { 'answers.$[photos]': data } },
          { arrayFilters: [{ id: { $eq: answer_id } }] },
        );
      }
    })
    .catch(err => console.error(err));
}
const f = ['questions.csv', 'answers.csv', 'answers_photos.csv'];
const fp = f.map((filename) => path.join(__dirname, '..', 'CSV', filename));
csvToMongoDB(fp[0]);
