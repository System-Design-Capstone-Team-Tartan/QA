const app = require('./app');
const { port } = require('../config');

app.listen(port, () => {
  console.log(`QA API is listening on ${port}`);
});
