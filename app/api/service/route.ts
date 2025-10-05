import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Service } from "../../../src/contexts/type";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const body: Service = await req.json();

    // ✅ Validate user input
    if (!body.name || !body.price || !body.description) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, price, or description" },
        { status: 400 }
      );
    }

    // ✅ Connect directly to MongoDB
    const client = await clientPromise;
    const db = client.db("visionCare");
    const collection = db.collection<Service>("services");

    // ✅ Insert new service
    const result = await collection.insertOne({ ...body });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error: unknown) {
    console.error("Error in POST /api/service:", error);
    const message = error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updateFields } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Service ID is required" },
        { status: 400 }
      );
    }

    // ✅ Connect directly to MongoDB
    const client = await clientPromise;
    const db = client.db("visionCare");
    const collection = db.collection<Service>("services");

    // ✅ Update service details
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error in PUT /api/service:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Service ID is required" },
        { status: 400 }
      );
    }

    // ✅ Connect directly to MongoDB
    const client = await clientPromise;
    const db = client.db("visionCare");
    const collection = db.collection<Service>("services");

    // ✅ Delete service
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error in DELETE /api/service:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
