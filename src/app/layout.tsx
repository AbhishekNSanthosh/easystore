import React from "react";
import type { Metadata } from "next";
import "@styles/scss/main.scss";

export const metadata: Metadata = {
  title: "Easy Store | Your Customizable E-Commerce Solution",
  description: "Create your personalized online store with Easy Store. Sell, manage, and grow your business effortlessly with our powerful tools and features.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
