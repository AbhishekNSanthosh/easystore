import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Order from "../../../../../common/models/Order";
import User from "../../../../../common/models/User"; // Assuming user model exists
import { connectToDB } from "../../../../../common/db/database";

export const POST = async (req: NextRequest) => {
    try {
        await connectToDB();

        const { token } = await req.json();
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.NEXTAUTH_JWT_SECRET as string);
        } catch (error) {
            return NextResponse.json({ message: "Invalid token" }, { status: 403 });
        }

        const userId = (decoded as { id: string }).id; // Extract user ID

        // Fetch user details
        const user = await User.findById(userId).select("-password"); // Exclude password field
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Fetch user orders
        const orders = await Order.find({ createdBy: userId }).populate({
            path: "productId",
            model: "Product", // Explicitly reference Product
            select: "title price imgUrl",
          });
        return NextResponse.json({
            success: true,
            user,
            orders,
        });
    } catch (error: any) {
        console.error("Error fetching profile:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
};
