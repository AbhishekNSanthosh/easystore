import { NextRequest, NextResponse } from "next/server";
import User from "../../../../../common/models/User"; 
import { connectToDB } from "../../../../../common/db/database";

export const POST = async (req: NextRequest) => {
    try {
        await connectToDB(); // Ensure DB is connected

        const { subdomain } = await req.json();
        if (!subdomain) {
            return NextResponse.json({ message: "Subdomain is required" }, { status: 400 });
        }

        // Find users by subdomain
        const users = await User.find({ subdomain });

        return NextResponse.json({
            success: true,
            users,
        });
    } catch (error: any) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
};
