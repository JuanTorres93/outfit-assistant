import mongoose from 'mongoose';

import './models/ClosetMongo';
import './models/OutfitMongo';
// TODO IMPORTANT: import Mongo models
import './models/EventMongo';
import './models/UserMongo';

// Prevent multiple connections in development on hot reload
// Use global so the promise persists across recompilations
declare global {
  var mongooseConnectionPromise: Promise<void> | undefined;
}

export async function startMongooseConnection(uri: string) {
  // If a connection promise already exists in global, reuse it
  if (global.mongooseConnectionPromise) {
    return global.mongooseConnectionPromise;
  }

  // Create a new promise and store it in global
  global.mongooseConnectionPromise = (async () => {
    await mongoose.connect(uri);

    // Init mongo models to avoid errors of creating collection in transactions
    await initMongoModels();
  })();

  return global.mongooseConnectionPromise;
}

export async function initMongoModels() {
  const models = [
    mongoose.model('User'),
    mongoose.model('Event'),
    mongoose.model('Closet'),
    mongoose.model('Outfit'),
    // TODO IMPORTANT: import Mongo models
  ];

  for (const model of models) {
    await model.init();
  }
}
