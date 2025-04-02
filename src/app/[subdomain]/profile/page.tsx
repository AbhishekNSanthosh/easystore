"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";

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
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [token, setToken] = useState<string | undefined>(Cookies.get("token"));
  const [user, setUser] = useState<User | null>(null);

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
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-2xl font-bold text-center mb-4">Profile</h1>

      {user ? (
        <>
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <p>
              <strong>Name:</strong> {user.firstName} {user.lastName}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.mobileNumber}
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold">Orders</h2>
            {orders.length > 0 ? (
              <ul className="space-y-2">
                {orders.map((order) => (
                  <li key={order._id} className="bg-white p-3 rounded shadow flex items-center space-x-4">
                  <div className="w-20 h-20 relative">
                    <Image
                      src={order.productId.imgUrl}
                      alt={order.productId.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                  <div>
                    <p>
                      <strong>Product:</strong> {order.productId.title}
                    </p>
                    <p>
                      <strong>Price:</strong> ₹{order.productId.price}
                    </p>
                    <p>
                      <strong>Status:</strong> {order.status}
                    </p>
                  </div>
                </li>
                ))}
              </ul>
            ) : (
              <p>No orders found.</p>
            )}
          </div>
        </>
      ) : (
        <p className="text-center">Loading profile...</p>
      )}

      <button
        className="w-full dynamicBgDark text-white py-2 rounded-lg hover:bg-red-600"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
