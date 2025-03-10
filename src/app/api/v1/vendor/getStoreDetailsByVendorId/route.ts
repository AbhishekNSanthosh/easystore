import { NextRequest, NextResponse } from "next/server";
import Store from "../../../../../common/models/Store";

export const POST = async (request: NextRequest) => {
  try {
    const { vendorId } = await request.json();

    // Validate input
    if (!vendorId) {
      return NextResponse.json({ message: "Store name is required!" }, { status: 400 });
    }

    // Find the store by name
    const store = await Store.findOne({ vendorId });

    if (!store) {
      return NextResponse.json({ message: "Store not found!" }, { status: 404 });
    }

    return NextResponse.json({ message: "Store found!", store }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching store details", error }, { status: 500 });
  }
};
