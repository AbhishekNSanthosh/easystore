"use client";
import PreLoader from "@components/PreLoader";
import AdminHeader from "@widgets/Vendor/Dashboard/components/AdminHeader";
import AdminSidebar from "@widgets/Vendor/Dashboard/components/AdminSidebar";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

interface StoreData {
  _id: string;
  vendorId: string;
  storeName: string;
  primaryColor: string;
  subdomain:string;
  logoUrl: string;
  bannerImg: string[]; // Assuming it's an array of image URLs
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store, setStore] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState("");
  const { data: session, status } = useSession();
  console.log(session);
  const { subdomain } = useParams();
  const router = useRouter();
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
  if (!session?.user?._id) return; // Ensure session and user ID exist

  const fetchStore = async () => {
    try {
      const response = await fetch(
        "/api/v1/vendor/getStoreDetailsByVendorId",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ vendorId: session.user._id }),
        }
      );

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to fetch store");

      setStore(data.store);

      // Set storeName in cookies
      Cookies.set("storeName", data?.store?.storeName, { expires: 7 }); // Expires in 7 days
      Cookies.set("subdomain", data?.store?.subdomain, { expires: 7 }); // Expires in 7 days

      // Set CSS variables for primary color
      document.documentElement.style.setProperty("--primary-color", data.store.primaryColor);
      document.documentElement.style.setProperty(
        "--primary-rgb",
        hexToRGB(data.store.primaryColor)
      );

      // API success, mark as loaded
      setIsLoaded(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchStore();
}, [session]);


  return (
    <main>
      {!isLoaded && <PreLoader/>}
      <div className="flex items-center flex-row w-screen">
      <AdminSidebar storeData={store} />
      <div className="flex flex-col w-full">
        <AdminHeader storeData={store}/>
        <main className="min-h-[100vh] h-auto rounded-[5px] pt-[15vh] pl-[17vw] pr-[0] pb-[1vw] w-[99.5vw] flex dynamicBg">
          <div className="w-full h-[82vh] relative overflow-auto pr-4">
            {children}
          </div>
        </main>
      </div>
    </div>
    </main>
  );
}
