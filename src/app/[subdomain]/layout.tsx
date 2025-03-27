"use client";
import Header from "@widgets/Customer/components/Header";
import SearchBar from "@widgets/Customer/components/SearchBar";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { subdomain } = useParams();
  console.log(subdomain);
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          "--primaryColor",
          data.store.primaryColor
        );
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [subdomain]);

  console.log(store);
  console.log(store?.storeName, store?.logoUrl);
  return (
    <main>
      <Header storeData={store} />
      {children}
    </main>
  );
}
