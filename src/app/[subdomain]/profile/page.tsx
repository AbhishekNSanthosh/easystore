"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import UserPreLoader from "@components/UserPreloader";

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

export default function ProfilePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [token, setToken] = useState<string | undefined>(Cookies.get("token"));
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
        setUser(data.user);
        setOrders(data.orders);
      } catch (error) {
        console.error("Error fetching profile details:", error);
      }
    };

    fetchProfileDetails();
  }, [token, router]);

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/signin");
  };

  return (
    <main>
      {!isLoaded && <UserPreLoader />}

      <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl mt-10">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          My Profile
        </h1>

        {user ? (
          <>
            {/* Personal Info */}
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-6 dynamicBorder rounded-xl mb-8">
              <h2 className="text-xl font-semibold mb-3 text-blue-900">
                Personal Information
              </h2>
              <div className="space-y-2 text-gray-800">
                <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.mobileNumber}</p>
              </div>
            </div>

            {/* Orders */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Orders</h2>
              {orders.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="flex flex-col sm:flex-row bg-gray-50 p-4 rounded-lg dynamicBorder hover:shadow-md transition duration-200"
                    >
                      <div className="relative w-full sm:w-32 h-32 mb-4 sm:mb-0 sm:mr-4">
                        <Image
                          src={order.productId.imgUrl}
                          alt={order.productId.title}
                          fill
                          className="rounded-lg object-cover"
                        />
                      </div>

                      <div className="flex-1 space-y-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {order.productId.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 font-semibold">
                            ₹{order.productId.price}
                          </span>
                        </div>
                        <p className="text-sm">
                          <strong>Status:</strong>{" "}
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              order.status === "Delivered"
                                ? "bg-green-100 text-green-700"
                                : order.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-200 text-gray-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center">No orders found.</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">Loading profile...</p>
        )}

        <button
          className="w-full border border-red-600 text-red-600 hover:text-white py-2 mt-4 rounded-lg hover:bg-red-600 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </main>
  );
}
