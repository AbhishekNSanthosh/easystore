import { connectToDB } from "../../../../../common/db/database";
import CryptoJS from "crypto-js";
import User from "../../../../../common/models/User";
import jwt from "jsonwebtoken";

export const POST = async (request: Request) => {
  console.log("API called: User Login");

  try {
    const { email, password } = await request.json();

    // Validate required fields
    if (![email, password].every(Boolean)) {
      return new Response(JSON.stringify({ message: "All fields are required", desc: "Fill in all details." }), { status: 400 });
    }

    await connectToDB();

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid credentials", desc: "User not found." }), { status: 401 });
    }

    // Ensure secret key is available
    if (!process.env.NEXTAUTH_CRYPTO_SECRET_KEY || !process.env.NEXTAUTH_JWT_SECRET) {
      console.error("Secret keys are missing");
      return new Response(JSON.stringify({ message: "Server error", desc: "Contact support." }), { status: 500 });
    }

    // Decrypt and verify password
    const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.NEXTAUTH_CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8);
    if (decryptedPassword !== password) {
      return new Response(JSON.stringify({ message: "Invalid credentials", desc: "Incorrect password." }), { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.NEXTAUTH_JWT_SECRET, { expiresIn: "7d" });

    return new Response(JSON.stringify({ message: "Login successful", token, desc: "Redirecting..." }), { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ message: "Internal error", desc: "Try again later." }), { status: 500 });
  }
};
