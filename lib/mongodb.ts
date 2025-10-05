import { MongoClient, Db, Collection, Document } from "mongodb";

const uri = process.env.MONGODB_URI!;
if (!uri) throw new Error("Please define MONGODB_URI in .env.local");

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // allow global variable for hot-reload in dev
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect(); // connect once
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect(); // connect once
}

// helper function to get collection
export async function getCollection<T extends Document = Document>(
  name: string
): Promise<Collection<T>> {
  const client = await clientPromise;
  const db: Db = client.db(process.env.MONGODB_DB);
  return db.collection<T>(name);
}

export default clientPromise;