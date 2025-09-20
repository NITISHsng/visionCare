import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { Appointment } from "@/src/contexts/type";

export async function POST(req: Request) {
  try {
    const body: Appointment = await req.json();

    // ✅ Validate user input
    if (!body.ptName || !body.phoneNo) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Get collection
    const collection = await getCollection<Appointment>("appointments");

    const now = new Date().toISOString();

    // ✅ Insert appointment
    const result = await collection.insertOne({
      ...body,
      // createdAt: now,
      // updatedAt: now,
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error: unknown) {
    console.error("Error in api:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
