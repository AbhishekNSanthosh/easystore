"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const { subdomain } = useParams();
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
          body: JSON.stringify({ storeName: subdomain }),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Failed to fetch store");

        setStore(data.store);

        // Set CSS variable for primary color
        document.documentElement.style.setProperty("--primaryColor", data.store.primaryColor);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [subdomain]);

  return (
    <div
      className="w-full text-white p-4 min-h-screen"
      style={{ backgroundColor: "var(--primaryColor)" }} // Uses CSS variable
    >
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : store ? (
        <div>
          <h1 className="text-2xl font-bold">{store.storeName}</h1>
          <img
            src={store.logoUrl}
            alt={store.storeName}
            className="w-20 h-20 rounded-full mt-2"
          />
          <p className="mt-2">
            Primary Color: <span style={{ color: "var(--primaryColor)" }}>{store.primaryColor}</span>
          </p>
        </div>
      ) : (
        <p>Store not found.</p>
      )}
    </div>
  );
}
