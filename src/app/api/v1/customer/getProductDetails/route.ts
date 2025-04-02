import { NextRequest, NextResponse } from "next/server";
import Store from "../../../../../common/models/Store";
import Product from "../../../../../common/models/Product";
import { connectToDB } from "../../../../../common/db/database";

export const POST = async (request: NextRequest) => {
    try {
        // Connect to DB
        await connectToDB();

        // Extract subdomain & productId from request body
        const { subdomain, productId } = await request.json();

        if (!subdomain || !productId) {
            return NextResponse.json({ message: "Subdomain and Product ID are required!" }, { status: 400 });
        }

        // // Check if store exists
        // const store = await Store.findOne({ subdomain });

        // if (!store) {
        //   return NextResponse.json({ message: "Store not found!" }, { status: 404 });
        // }

        // Find product in the store
        const product = await Product.findOne({ _id: productId, ownedBy: subdomain });

        if (!product) {
            return NextResponse.json({ message: "Product not found!" }, { status: 404 });
        }

        return NextResponse.json({ message: "Product found!", product }, { status: 200 });

    } catch (error: any) {
        console.error("Error fetching product:", error);
        return NextResponse.json({ message: "Error fetching product details", error: error.message }, { status: 500 });
    }
};
