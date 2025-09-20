import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { Staff } from "../../../src/contexts/type";

export async function POST(req: Request) {
  try {
    const body: Staff = await req.json();

    // ✅ Validate user input
    if (!body.name || !body.phone || !body.role) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: patient name or phone number" },
        { status: 400 }
      );
    }

    // ✅ Get collection
    const collection = await getCollection<Staff>("staff");


    const result = await collection.insertOne({
      ...body,
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error: unknown) {
    console.error("Error in api:", error);

    const message = error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
