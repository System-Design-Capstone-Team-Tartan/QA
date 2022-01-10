const app = require('./app');
const { port } = require('../config');

app.listen(port, () => {
  console.log(`Cart API is listening on ${port}`);
});
