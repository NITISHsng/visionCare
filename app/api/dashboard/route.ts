import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// 👇 this line forces Vercel to run this route dynamically every time
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("visionCare"); // optional but recommended

    const [services, patients, staff] = await Promise.all([
      db.collection("services").find({}).sort({ createdAt: -1 }).toArray(),
      db.collection("patients").find({}).sort({ createdAt: -1 }).toArray(),
      db.collection("staff").find({}).sort({ createdAt: -1 }).toArray(),
    ]);

    return NextResponse.json({ staff, services, patients });
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
