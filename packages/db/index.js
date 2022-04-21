import { MongoClient } from 'mongodb';

const uri =
  "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
export const client = new MongoClient(uri);

export const connect = async () => {
  try {
    await client.connect();
  } catch (error) {
    console.log("Could not connect to database.");
  }
}

export const db = () => client.db('underwater');
export const close = () => client.close();
