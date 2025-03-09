import { MongoClient } from 'mongodb';
import  { CONFIG } from '../config';

if (!CONFIG.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = CONFIG.MONGODB_URI;
const options = {};

let client;
let clientPromise;

  // In development, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;


// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;