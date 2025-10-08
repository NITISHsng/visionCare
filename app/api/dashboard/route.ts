import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
if (!uri) throw new Error("Please define MONGODB_URI in .env.local or environment variables");

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!globalThis._mongoClientPromise) {
  client = new MongoClient(uri);
  globalThis._mongoClientPromise = client.connect();
}
clientPromise = globalThis._mongoClientPromise;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("visionCare"); // specify your database name

    const [staff, services, patients] = await Promise.all([
      db.collection("staff").find({}).sort({ createdAt: -1 }).toArray(),
      db.collection("services").find({}).sort({ createdAt: -1 }).toArray(),
      db.collection("patients").find({}).sort({ updatedAt: -1 }).toArray(),
    ]);

    return NextResponse.json({
      staff,
      services,
      patients,
    });
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
