import { NextResponse } from "next/server";
import { connectToDB } from "../../../../../common/db/database";
import Product from "../../../../../common/models/Product";

export const POST = async () => {
  try {
    await connectToDB(); // Ensure MongoDB connection

    const products = await Product.find(); // Fetch all products

    return NextResponse.json(
      { message: "Products fetched successfully!", products },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
};
