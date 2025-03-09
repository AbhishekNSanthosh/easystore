import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import CryptoJS from "crypto-js";
import { connectToDB } from "../../../../common/db/database";
import Vendor from "../../../../common/models/Vendor";

declare module "next-auth" {
  interface Session {
    user: {
      _id?: string;
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      isNewAccount?:boolean | false;
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

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credentials not provided");
        }

        const userExist = await Vendor.findOne({ email: credentials.email });

        if (!userExist) {
          throw new Error("User does not exist");
        }

        const bytes = CryptoJS.AES.decrypt(userExist.password, process.env.NEXTAUTH_CRYPTO_SECRET_KEY!);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

        if (decryptedData !== credentials.password) {
          throw new Error("Invalid credentials");
        }

        return {
          id: userExist._id.toString(),
          firstName: userExist.firstName,
          lastName: userExist.lastName,
          email: userExist.email,
          isNewAccount:userExist.isNewAccount
        };
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (session.user?.email) {
        await connectToDB();
        const sessionUser = await Vendor.findOne({ email: session.user.email });

        if (sessionUser) {
          session.user = {
            _id: sessionUser._id.toString(),
            firstName: sessionUser.firstName,
            lastName: sessionUser.lastName,
            email: sessionUser.email,
            isNewAccount:sessionUser.isNewAccount
          };
        }
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
