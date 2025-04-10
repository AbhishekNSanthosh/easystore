import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../../common/db/database";
import Product from "../../../../../common/models/Product";

export const POST = async (request: NextRequest) => {
  try {
    await connectToDB(); // Connect to MongoDB

    const { title, price, oldPrice, imgUrl, ownedBy, sizes: availableSizes } = await request.json();
    console.log(title, price, oldPrice, imgUrl, ownedBy)
    // Validate required fields
    if (!title || !price || !imgUrl || !ownedBy) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    // Create a new product document
    const newProduct = new Product({ title, price, oldPrice, imgUrl, ownedBy, availableSizes });
    await newProduct.save();

    return NextResponse.json(
      { message: "Product created successfully!", product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
};