import { MongoClient, Db, Collection, Document } from "mongodb";

const uri = process.env.MONGODB_URI!;
if (!uri) throw new Error("Please define MONGODB_URI in .env.local or environment variables");

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // allow hot-reload in dev without creating multiple clients
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

// Helper: get Db
export async function getDb(dbName: string = "visionCare"): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}

// Helper: get Collection
export async function getCollection<T extends Document = Document>(
  name: string,
  dbName: string = "visionCare"
): Promise<Collection<T>> {
  const db = await getDb(dbName);
  return db.collection<T>(name);
}

export default clientPromise;
