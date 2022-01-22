module.exports = {
  host: 'localhost',
  port: 1337,
  postgres: {
    // remember to create a postgres user
    // with access to the qa database before running db:init
    user: 'admin',
    password: 'password',
    host: 'localhost', // change this for when separating db from API endpoint
    database: 'qa',
    port: 5432,
  },
};
