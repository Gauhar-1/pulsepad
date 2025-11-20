import mongoose from 'mongoose';

const DEFAULT_MONGODB_URI =
  'mongodb+srv://eeshalteluri:7io0Q60Xqpasdazi@cluster0.epz3zuf.mongodb.net/?appName=Cluster0';

const mongoUri = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

if (!mongoUri) {
  throw new Error('Please define the MONGODB_URI environment variable.');
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const cached = global.mongooseConnection ?? {
  conn: null as typeof mongoose | null,
  promise: null as Promise<typeof mongoose> | null,
};

if (!global.mongooseConnection) {
  global.mongooseConnection = cached;
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUri, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

