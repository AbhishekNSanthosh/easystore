import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../../common/db/database";
import Store from "../../../../../common/models/Store";


export async function POST(req: NextRequest) {
  try {
    await connectToDB(); // Connect to MongoDB
    const { subdomain, primaryColor } = await req.json();

    if (!subdomain || !primaryColor) {
      return NextResponse.json({ success: false, message: "Subdomain and primaryColor are required." }, { status: 400 });
    }

    const store = await Store.findOneAndUpdate(
        { subdomain }, // Find store by subdomain
        { $set: { primaryColor } }, // ✅ Directly update `primaryColor`
        { new: true }
      );
    if (!store) {
      return NextResponse.json({ success: false, message: "Store not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Theme updated successfully.", store }, { status: 200 });
  } catch (error) {
    console.error("Error updating theme:", error);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}
