"use client";
import UserPreLoader from "@components/UserPreloader";
import CustomerLandingPage from "@widgets/Customer/LandingPage";
import React, { useEffect, useState } from "react";

export default function page() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main>
       {!isLoaded && <UserPreLoader />}
      <CustomerLandingPage />;
    </main>
  );
}
