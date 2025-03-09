import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../../common/db/database";
import Vendor from "../../../../../common/models/Vendor";

export const POST = async (request: NextRequest) => {
  try {
    const { vendorEmail } = await request.json();

    if (!vendorEmail) {
      return NextResponse.json(
        { error: "Vendor ID is required" },
        { status: 400 }
      );
    }

    await connectToDB(); // Connect to the database

    const vendor = await Vendor.findOne({ email: vendorEmail });
    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, vendor }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
