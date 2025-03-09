import { NextRequest, NextResponse } from "next/server";
import Store from "../../../../../common/models/Store";

export const POST = async (request: NextRequest) => {
  try {
    const { storeName, logoUrl, primaryColor, vendorId } = await request.json();

    // Validate required fields
    if (!storeName || !logoUrl || !primaryColor) {
      return NextResponse.json({ message: "All fields are required!" }, { status: 400 });
    }

    // Check if a store with the same name already exists
    const existingStore = await Store.findOne({ storeName });

    if (existingStore) {
      // If store exists, return error and update isNewAccount to false
      existingStore.isNewAccount = false;
      await existingStore.save();

      return NextResponse.json(
        { message: "Store name already exists!", isNewAccount: false },
        { status: 400 }
      );
    }

    // Create a new Store document
    const newStore = new Store({ storeName, logoUrl, primaryColor, vendorId, isNewAccount: true });

    await newStore.save();

    return NextResponse.json(
      { message: "Store saved successfully!", store: newStore },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Error saving store", error }, { status: 500 });
  }
};
