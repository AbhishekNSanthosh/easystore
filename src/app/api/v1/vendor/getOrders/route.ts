import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../../common/db/database";
import Order from "../../../../../common/models/Order";
import mongoose from "mongoose";

export const POST = async (request: NextRequest) => {
  try {
    await connectToDB();

    const { subdomain } = await request.json();

    // Fetch orders and manually convert productId to ObjectId for population
    const orders = await Order.find({ subdomain })
      .lean()
      .exec(); // Convert documents to plain objects for manipulation

    // Convert productId string to ObjectId and fetch related product details
    const populatedOrders = await Promise.all(
      orders.map(async (order) => {
        const product = await mongoose.model("Product").findById(new mongoose.Types.ObjectId(order.productId))
          .select("title imgUrl price oldPrice"); // Fetch only necessary fields

        return { ...order, product };
      })
    );

    return NextResponse.json({ message: "Orders fetched successfully", orders: populatedOrders }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: "Failed to fetch orders", error: error.message }, { status: 500 });
  }
};
