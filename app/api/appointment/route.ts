import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { Appointment, PatientFullType, initialPatient } from "@/src/contexts/type";

// Update appointment status
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id) return NextResponse.json({ success: false, error: "Missing appointment ID" }, { status: 400 });
    if (!status) return NextResponse.json({ success: false, error: "Missing status" }, { status: 400 });

    const appointmentsColl = await getCollection<Appointment>("appointments");

    const result = await appointmentsColl.updateOne(
      { id },
      { $set: { status, updatedAt: new Date().toISOString() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "Appointment not found" }, { status: 404 });
    }

    const updatedAppointment = await appointmentsColl.findOne({ id });
    if (!updatedAppointment) return NextResponse.json({ success: false, error: "Failed to fetch updated appointment" }, { status: 500 });

    // Insert patient if status is confirmed or completed
    if (status === "confirmed" || status === "completed") {
      const patientsColl = await getCollection<PatientFullType>("patients");

      const existingPatient = await patientsColl.findOne({ id });
      if (!existingPatient) {
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

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
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// Create new appointment
export async function POST(req: Request) {
  try {
    const body: Appointment = await req.json();

    if (!body.ptName || (!body.phoneNo && !body.email)) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const appointmentsColl = await getCollection<Appointment>("appointments");
    const patientsColl = await getCollection<PatientFullType>("patients");

    const existingPatient = await patientsColl.findOne({
      $or: [
        { ptName: body.ptName, phoneNo: body.phoneNo },
        { ptName: body.ptName, email: body.email },
      ],
    });

    const now = new Date().toISOString();
    const appointmentData: Appointment = {
      ...body,
      repeated: !!existingPatient,
      createdAt: now,
      updatedAt: now,
    };

    const result = await appointmentsColl.insertOne(appointmentData);

    return NextResponse.json({
      success: true,
      id: result.insertedId,
      repeated: !!existingPatient,
    });
  } catch (error: unknown) {
    console.error("Error in POST:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
