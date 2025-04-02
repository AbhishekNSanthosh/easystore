import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../../common/db/database";
import Store from "../../../../../common/models/Store";

export async function POST(req: NextRequest) {
  try {
    await connectToDB(); // Connect to MongoDB
    const { subdomain, bannerImgs } = await req.json();

    if (!subdomain || !bannerImgs || !Array.isArray(bannerImgs)) {
      return NextResponse.json({ success: false, message: "Subdomain and valid bannerImgs array are required." }, { status: 400 });
    }

    const store = await Store.findOneAndUpdate(
      { subdomain }, // Find store by subdomain
      { $set: { bannerImg: bannerImgs } }, // ✅ Update only `bannerImg`
      { new: true }
    );

    if (!store) {
      return NextResponse.json({ success: false, message: "Store not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Banner images updated successfully.", store }, { status: 200 });
  } catch (error) {
    console.error("Error updating banners:", error);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}
