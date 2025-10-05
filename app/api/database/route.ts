import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb("visionCare");
    const collections = await db.collections();
    const collectionNames = collections.map(c => c.collectionName);

    return NextResponse.json({
      success: true,
      databaseName: db.databaseName,
      collections: collectionNames,
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
