import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../../common/db/database";
import Product from "../../../../../common/models/Product";

export const POST = async (request: NextRequest) => {
  try {
    await connectToDB(); // Ensure MongoDB connection
    const { subdomain: ownedBy, count } = await request.json();

    // Convert count to a number (default to all if not provided)
    const limit = count ? parseInt(count, 10) : undefined;

    // Fetch products with limit if provided
    const products = limit ? await Product.find({ ownedBy }).limit(limit) : await Product.find({ ownedBy });

    console.log("Products:", products);
    console.log("Owned By:", ownedBy);
    console.log("Product Count:", limit || "All");

    return NextResponse.json(
      { message: "Products fetched successfully!", products },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
};
