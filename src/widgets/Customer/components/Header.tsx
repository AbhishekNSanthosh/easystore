"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";
import { FiLogIn } from "react-icons/fi";
import Link from "next/link";
import Cookies from "js-cookie";
import { CgProfile } from "react-icons/cg";
import { useRouter } from "next/navigation";

interface HeaderProps {
  storeData: {
    name: string;
    logoUrl?: string;
  };
}

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type Address = {
  name: string;
  phone: string;
  street: string;
  city: string;
  pincode: string;
};

type Product = {
  _id: string;
  title: string;
  price: number;
  oldPrice: number;
  ownedBy: string;
  imgUrl: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type Order = {
  address: Address;
  _id: string;
  productId: Product;
  subdomain: string;
  createdBy: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type ProfileResponse = {
  success: boolean;
  user: User;
  orders: Order[];
};

export default function Header({ storeData }: HeaderProps) {
  const [user, setUser] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [userData, setUserData] = useState<User | null>(null);
  const [token, setToken] = useState<string | undefined>(Cookies.get("token"));
  const router = useRouter();
  useEffect(() => {
    if (!token) {
      console.error("No token found! Redirecting to login...");
      router.push("/login");
      return;
    }

    const fetchProfileDetails = async () => {
      try {
        const response = await fetch("/api/v1/customer/getProfileDetails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) throw new Error("Failed to fetch profile details");

        const data: ProfileResponse = await response.json();
        setUserData(data.user);
        setUser(true)
      } catch (error) {
        console.error("Error fetching profile details:", error);
      }
    };

    fetchProfileDetails();
  }, [token, router]);
  useEffect(() => {
    if (!userData?._id) return; // Ensure userData is available before running
  
    const cartKey = `cart_${userData._id}`;
    const storedCartKey = Object.keys(Cookies.get()).find(key => key === cartKey);
  
    if (!storedCartKey) {
      setCartCount(0); // No cart found for this user
      return;
    }
  
    // Function to update cart count based on userId
    const updateCartCount = () => {
      const cart = Cookies.get(cartKey);
      setCartCount(cart ? JSON.parse(cart).length : 0);
    };
  
    updateCartCount(); // Initial count
  
    // Listen for custom "cartUpdated" event
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener("cartUpdated", handleCartUpdate);
  
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [userData]); // Depend on userData to rerun when it's available
  

  return (
    <div className="w-full px-[5vw] h-[10vh] flex items-center border-b border-gray-200 bg-white">
      {/* Logo Section */}
      <div className="flex-1">
        <div>
          {storeData?.logoUrl ? (
            <Link href={"/"}>
              <Image
                src={storeData.logoUrl}
                alt={storeData.name || "Store Logo"}
                width={1000}
                height={1000}
                className="w-[8rem]"
              />
            </Link>
          ) : (
            <span>No Logo Available</span>
          )}
        </div>
      </div>

      {/* Icons and Links Section */}
      <div className="flex-1 flex items-center justify-end">
        <div className="flex items-center gap-8 justify-end text-2xl">
          {/* <div className="hover:text-red-500 cursor-pointer">
            <IoMdHeartEmpty />
          </div> */}

          {/* Cart Icon with Count */}
          <div className="relative hover:text-blue-500 cursor-pointer">
            <Link href="/cart">
              <IoCartOutline />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-[2px]">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          <div className="hover:text-blue-500 cursor-pointer">
            {user ? (
              <Link href={"/profile"}>
                <CgProfile />
              </Link>
            ) : (
              <Link href={"/signin"}>
                <FiLogIn />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
