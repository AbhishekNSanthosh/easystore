"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import Banner from "../components/Banner";
import ProductList from "../components/ProductList";
import { useParams } from "next/navigation";

export default function CustomerLandingPage() {
  const { subdomain } = useParams();
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!subdomain) return;

    const fetchStore = async () => {
      try {
        const response = await fetch("/api/v1/customer/getStoreDetails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subdomain }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch store");

        setStore(data.store);
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
    <main>
      <SearchBar setSearchQuery={setSearchQuery} />
      {!searchQuery && store?.bannerImg?.length > 0 && <Banner storeData={store} />}
      <ProductList searchQuery={searchQuery} />
    </main>
  );
}
