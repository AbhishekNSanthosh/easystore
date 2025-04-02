import { NextRequest, NextResponse } from "next/server";
import Order from "../../../../../common/models/Order";
import { connectToDB } from "../../../../../common/db/database";
import jwt, { JwtPayload } from "jsonwebtoken";  // Import JwtPayload

export const POST = async (request: NextRequest) => {
  try {
    await connectToDB();

    // Extract the body data from the request
    const { productId, subdomain, address, token } = await request.json();

    // Check if the necessary fields are provided
    if (!productId || !subdomain || !address || !token) {
      return NextResponse.json({ message: "All fields are required!" }, { status: 400 });
    }

    // Verify the token and extract the user ID
    let decoded: JwtPayload | string;
    try {
      decoded = jwt.verify(token, process.env.NEXTAUTH_JWT_SECRET as string);  // Make sure to specify the secret key

      if (typeof decoded === "string") {
        return NextResponse.json({ message: "Invalid token", error: "Token is invalid or expired" }, { status: 401 });
      }

      const createdBy = decoded.id;  // Assuming the token contains a `userId` field
      if (!createdBy) {
        return NextResponse.json({ message: "Invalid token payload" }, { status: 401 });
      }

      // Create the order
      const newOrder = await Order.create({
        productId,
        subdomain,
        address,
        createdBy,  // Store the createdBy field as the user's ID
      });
      console.log(newOrder)

      return NextResponse.json({ message: "Order placed successfully!", orderId: newOrder._id }, { status: 201 });

    } catch (err:any) {
      console.error("JWT Error:", err);
      return NextResponse.json({ message: "Invalid or expired token", error: err.message }, { status: 401 });
    }

  } catch (error: any) {
    console.error("Order error:", error);
    return NextResponse.json({ message: "Error placing order", error: error.message }, { status: 500 });
  }
};
