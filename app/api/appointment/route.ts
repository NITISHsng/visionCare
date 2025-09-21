import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { Appointment, PatientFullType, initialPatient } from "@/src/contexts/type";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing appointment ID" },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { success: false, error: "Missing status" },
        { status: 400 }
      );
    }

    const appointmentsColl = await getCollection<Appointment>("appointments");

    // Update the appointment status
    const result = await appointmentsColl.updateOne(
      { id },
      { $set: { status, updatedAt: new Date().toISOString() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Fetch the updated appointment
    const updatedAppointment = await appointmentsColl.findOne({ id });
    if (!updatedAppointment) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch updated appointment" },
        { status: 500 }
      );
    }

    // Only insert into patients if status is confirmed or completed
if (status === "confirmed" || status === "completed") {
  const patientsColl = await getCollection<PatientFullType>("patients");

  // Check if patient already exists
  const existingPatient = await patientsColl.findOne({ id });
  if (!existingPatient) {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2,'0')}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getFullYear()).slice(-2)}`;

    const patientToInsert: PatientFullType = {
      ...initialPatient,
      ...updatedAppointment,
      orderDate: formattedDate,
    };

    await patientsColl.insertOne(patientToInsert);
  }
}


    return NextResponse.json({ success: true, data: updatedAppointment });
  } catch (error: unknown) {
    console.error("Error in PUT:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}



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
