"use client";
import FooterCustomer from "@widgets/Customer/components/Footer";
import Header from "@widgets/Customer/components/Header";
import SearchBar from "@widgets/Customer/components/SearchBar";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { subdomain } = useParams();
  const location = usePathname();
  console.log(location);
  console.log(subdomain);
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const authRoutes = ["/signin", "/signup"];

  const hexToRGB = (hex: string) => {
    let r = 0,
      g = 0,
      b = 0;

    if (hex.length === 7) {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    }

    return `${r}, ${g}, ${b}`;
  };

  useEffect(() => {
    if (!subdomain) return;

    const fetchStore = async () => {
      try {
        const response = await fetch("/api/v1/customer/getStoreDetails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ subdomain }),
        });

        const data = await response.json();

        if (!response.ok)
          throw new Error(data.message || "Failed to fetch store");

        setStore(data.store);
        // Set CSS variable for primary color
        document.documentElement.style.setProperty(
          "--primary-color",
          data.store.primaryColor
        );
        document.documentElement.style.setProperty(
          "--primary-rgb",
          hexToRGB(data.store.primaryColor)
        );
        console.log(data.store.primaryColor);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [subdomain]);

  return (
    <main>
      {!authRoutes.includes(location) && <Header storeData={store} />}

      {children}
      {!authRoutes.includes(location) && <FooterCustomer storeData={store} />}
    </main>
  );
}
