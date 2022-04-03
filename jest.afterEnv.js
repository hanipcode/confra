const mongoose = require('mongoose');

module.exports = async function () {
  let connection = await mongoose.connect(
    'mongodb://localhost:27017/testMagicia'
  );
  await connection.connection.db.dropDatabase();
  await mongoose.disconnect();
  console.log('finish');
};
