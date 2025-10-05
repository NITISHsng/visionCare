import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("visionCare");

    const [staff, appointments, services, patients] = await Promise.all([
      db.collection("staff")
        .find({}, { projection: { password: 0 } }) // exclude password
        .sort({ createdAt: -1 })
        .toArray(),
      db.collection("appointments")
        .find({})
        .sort({ preferredDate: -1 }) // sort by preferredDate descending
        .toArray(),
      db.collection("services")
        .find({})
        .sort({ createdAt: -1 })
        .toArray(),
      db.collection("patients")
        .find({})
        .sort({ updatedAt: -1 })
        .toArray(),
    ]);

    return NextResponse.json({
      staff,
      appointments,
      services,
      patients,
    });
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
