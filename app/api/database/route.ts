import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const client = await clientPromise;

    // The database object you are using
    const db = client.db("visionCare"); // <-- replace with your current DB name

    // Optional: fetch some data for verification
    const collections = await db.collections();
    const collectionNames = collections.map(c => c.collectionName);

    return NextResponse.json({
      success: true,
      databaseName: db.databaseName,  // This shows your DB name
      collections: collectionNames,   // This shows all collections
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
