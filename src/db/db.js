const monk = require('monk');

const dbName = process.env.NODE_ENV === 'test' ? process.env.TEST_DB : process.env.DEV_DB;
const db = monk(`mongodb://localhost/${dbName}`);

// const products = db.get('products');

module.exports = {
  db
};
