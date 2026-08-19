import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

// Preserve connection across hot-reloads in dev and warm function invocations in serverless
const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      maxPoolSize: 5,                  // Prevents breaching Atlas M0's 50-connection cap across concurrent Vercel lambdas
      serverSelectionTimeoutMS: 5000, // Timeout fast after 5s if Atlas is unreachable (prevents long hanging requests)
      socketTimeoutMS: 45000,         // Automatically close sockets idle for 45 seconds
      bufferCommands: true,            // Keep buffering enabled to prevent cold-start timing errors
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset promise on error so subsequent requests can attempt to reconnect
    throw e;
  }

  return cached.conn;
}