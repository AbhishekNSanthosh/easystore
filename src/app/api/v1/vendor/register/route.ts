import { connectToDB } from "../../../../../common/db/database";
import CryptoJS from "crypto-js";
import Vendor from "../../../../../common/models/Vendor";

export const POST = async (request: Request) => {
  console.log("API called: Vendor Registration");

  try {
    const { firstName, lastName, email, mobileNumber, password,subdomain } = await request.json();

    // Validate required fields
    if (![firstName, lastName, email, mobileNumber, password].every(Boolean)) {
      return new Response(JSON.stringify({ message: "All fields are required", desc: "Fill in all details." }), { status: 400 });
    }

    await connectToDB();

    // Check if the user already exists
    if (await Vendor.findOne({ email })) {
      return new Response(JSON.stringify({ message: "User already exists", desc: "Try another email." }), { status: 409 });
    }

    // Ensure secret key is available
    if (!process.env.NEXTAUTH_CRYPTO_SECRET_KEY) {
      console.error("CRYPTO_SECRET_KEY is missing");
      return new Response(JSON.stringify({ message: "Server error", desc: "Contact support." }), { status: 500 });
    }

    // Encrypt password
    const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.NEXTAUTH_CRYPTO_SECRET_KEY).toString();

    // Save new vendor
    await Vendor.create({ firstName, lastName, email, mobileNumber, password: encryptedPassword,subdomain });

    return new Response(JSON.stringify({ message: "Registered successfully", desc: "Redirecting to login." }), { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    return new Response(JSON.stringify({ message: "Internal error", desc: "Try again later." }), { status: 500 });
  }
};
