import NextAuth from "next-auth";
import CryptoJS from "crypto-js";
import Credentials from "next-auth/providers/credentials";

import User from "@models/User";
import { connectToDB } from "@utils/database";

declare module "next-auth" {
  interface Session {
    user: {
      _id?: string;
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
    };
  }
}

const handler = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDB();

        if (!credentials) {
          throw new Error(JSON.stringify({ message: "Credentials not provided", desc: "Kindly provide both email and password" }));
        }

        try {
          const userExist = await User.findOne({ email: credentials.email });
          if (!userExist) {
            throw new Error(JSON.stringify({ message: "User does not exist", desc: "Kindly check your email and try again" }));
          }

          const bytes = CryptoJS.AES.decrypt(userExist.password, process.env.CRYPTO_SECRET_KEY!);
          const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
          const isMatch = decryptedData === credentials.password;
          if (isMatch) {
            return userExist; // Return user object if authentication is successful
          } else {
            throw new Error(JSON.stringify({ message: "Invalid credentials", desc: "Kindly check your credentials" }));
          }
        } catch (err: any) {
            throw err; // Re-throw custom error
        }
      },
    }),

  ],
  callbacks: {
    async session({ session }) {
      // Ensure `session.user` exists before accessing it
      if (session.user?.email) {
        await connectToDB();
        const sessionUser = await User.findOne({ email: session.user.email });

        if (sessionUser) {
          session.user.firstName = sessionUser?.firstName;
          session.user.lastName = sessionUser?.lastName;
          session.user.email = sessionUser?.email;
          session.user._id = sessionUser._id.toString();
        }
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
