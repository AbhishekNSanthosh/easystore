import { NextRequest, NextResponse } from "next/server";
import Store from "../../../../../common/models/Store";
import { connectToDB } from "../../../../../common/db/database";

export const POST = async (request: NextRequest) => {
  try {
    // Ensure database connection
    await connectToDB();

    const { subdomain } = await request.json();
    console.log(subdomain);

    if (!subdomain) {
      return NextResponse.json({ message: "Store name is required!" }, { status: 400 });
    }

    const store = await Store.findOne({ subdomain });

    if (!store) {
      return NextResponse.json({ message: "Store not found!" }, { status: 404 });
    }

    return NextResponse.json({ message: "Store found!", store }, { status: 200 });
  } catch (error:any) {
    console.log(error);
    return NextResponse.json({ message: "Error fetching store details", error: error.message }, { status: 500 });
  }
};
