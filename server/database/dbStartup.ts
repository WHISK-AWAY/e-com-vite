import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './index';
dotenv.config({ path: '../.env' });

const MONGO_DB_URL = process.env.MONGO_DB_URL;

export default async function mongoInit() {
  if (!MONGO_DB_URL)
    throw new Error(
      'Failed to connect to MongoDB. Double-check that MONGO_DB_URL is defined as an environment variable, and that mongod is running.'
    );

  const connection = await mongoose.connect(MONGO_DB_URL);
  // const connection = mongoose.createConnection(MONGO_DB_URL);
  console.log('connected to MongoDB @', MONGO_DB_URL);

  const msPerDay = 1000 * 60 * 60 * 24;
  setInterval(() => {
    User.purgeInactiveCart();
  }, msPerDay);

  return connection;
}
