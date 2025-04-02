import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "../../../../../common/models/Order";
import { connectToDB } from "../../../../../common/db/database";

export const PATCH = async (req: NextRequest) => {
  try {
    await connectToDB();

    const { orderId, status } = await req.json();

    // Validate orderId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ message: "Invalid order ID" }, { status: 400 });
    }

    // Check if status is valid
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    // Find and update order
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true } // Return updated order
    );

    if (!updatedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
};
