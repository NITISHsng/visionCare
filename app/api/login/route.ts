import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Staff } from "@/src/contexts/type"; // your type definition

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // ✅ Validate user input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Missing email or password" },
        { status: 400 }
      );
    }

    // ✅ Connect to MongoDB directly
    const client = await clientPromise;
    const db = client.db("visionCare");
    const collection = db.collection<Staff>("staff");

    // ✅ Find staff by email and password
    const staffMember = await collection.findOne({ email, password });

    if (staffMember) {
      // Exclude sensitive data before returning
      const { password, ...userWithoutPassword } = staffMember;
      return NextResponse.json({ success: true, user: userWithoutPassword });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }
  } catch (error: unknown) {
    console.error("Error in api/staff:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
