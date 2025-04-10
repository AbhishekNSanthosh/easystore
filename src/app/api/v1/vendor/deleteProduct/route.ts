import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../../common/db/database";
import Order from "../../../../../common/models/Order";
import Product from "../../../../../common/models/Product";

export const POST = async (request: NextRequest) => {
  try {
    await connectToDB();

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json({ message: "Order ID is required" }, { status: 400 });
    }

    const deletedOrder = await Product.findByIdAndDelete(productId);

    if (!deletedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order deleted successfully", deletedOrder }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting order:", error);
    return NextResponse.json({ message: "Failed to delete order", error: error.message }, { status: 500 });
  }
};
