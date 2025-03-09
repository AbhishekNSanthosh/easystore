import React from "react";
import type { Metadata } from "next";
import "@styles/scss/main.scss";
import { Toaster } from "react-hot-toast";
import Provider from "@components/Provider";
import { useSession } from "next-auth/react";

export const metadata: Metadata = {
  title: "Easy Store | Your Customizable E-Commerce Solution",
  description:
    "Create your personalized online store with Easy Store. Sell, manage, and grow your business effortlessly with our powerful tools and features.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <Toaster
            position="bottom-center"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
            }}
          />
          {children}
        </Provider>
      </body>
    </html>
  );
}
