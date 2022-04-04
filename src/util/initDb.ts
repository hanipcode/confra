import mongoose from 'mongoose';

const uriByEnv = {
  test: 'mongodb://localhost:27017/testMagicia',
  local: process.env.MONGODB_URI || 'mongodb://localhost:27017/magicia',
};

const { ENV } = process.env;
const uri = ENV === 'test' ? uriByEnv.test : uriByEnv.local;

const initDB = () => {
  return mongoose.connect(uri, (err) => {
    if (err) {
      console.log(err.message);
      throw new Error('Error Connecting to Database');
    }
  });
};

export default initDB;
