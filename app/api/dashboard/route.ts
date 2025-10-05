import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

export async function GET() {
  try {
    const [staff, appointments, services, patients] = await Promise.all([
      (await getCollection("staff")).find({}).sort({ createdAt: -1 }).toArray(),
      (await getCollection("appointments")).find({}).sort({ createdAt: -1 }).toArray(),
      (await getCollection("services")).find({}).sort({ createdAt: -1 }).toArray(),
      (await getCollection("patients")).find({}).sort({ updatedAt: -1 }).toArray(),
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
