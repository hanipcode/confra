const mongoose = require('mongoose');

export default async function dropMongoDatabase() {
  let connection = await mongoose.connect(
    'mongodb://localhost:27017/testMagicia'
  );
  await connection.connection.db.dropDatabase();
}
