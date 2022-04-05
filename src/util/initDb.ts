import mongoose from 'mongoose';

const uriByEnv = {
  test: 'mongodb://localhost:27017/testMagicia',
  local: process.env.MONGODB_URI || 'mongodb://localhost:27017/magicia',
};

const { ENV } = process.env;
const uri = ENV === 'test' ? uriByEnv.test : uriByEnv.local;

let connection: typeof mongoose.connection;
const initDB = async () => {
  connection = (await mongoose.connect(uri)).connection;
  connection.dropDatabase();
  return connection;
};

export function getConnection() {
  if (!connection) {
    throw new Error('getConnection used before connection exist');
  }

  return connection;
}

export default initDB;
