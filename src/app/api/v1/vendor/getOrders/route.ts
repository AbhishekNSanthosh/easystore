import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../../common/db/database";
import Order from "../../../../../common/models/Order";
import Product from "../../../../../common/models/Product"; // Ensure this is correctly imported

export const POST = async (request: NextRequest) => {
  try {
    await connectToDB();

    const { subdomain } = await request.json();

    // Fetch orders
    const orders = await Order.find({ subdomain }).lean().exec();

    // Populate product details
    const populatedOrders = await Promise.all(
      orders.map(async (order) => {
        const product = await Product.findById(order.productId)
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
