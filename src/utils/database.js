import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoMemoryServer } from 'mongodb-memory-server';
import logger from '../logger';
import dotenv from 'dotenv';
dotenv.config();

const mongoServer = new MongoMemoryServer();

const opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

export const connectToDatabase = async (url = process.env.MONGODB_URI) => {
  const testDbUri = await mongoServer.getUri();
  await mongoose.connect(
    process.env.NODE_ENV === 'test' ? testDbUri : url,
    opts,
    err => {
      if (err) {
        logger.error(err);
      }
    },
  );
  logger.info('MongoDB is connected!');
  /* eslint-disable no-console */
};

export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

export const clearDatabase = async () => {
  const { collections } = mongoose.connection;
  Object.keys(collections).forEach((collection) => {
    mongoose.connection.collection(collection).deleteMany({});
  });
};
