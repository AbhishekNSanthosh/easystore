"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState({
    name: "Abhishek S",
    email: "abhishek@example.com",
    phone: "07907247909",
    address: {
      street: "NALPATHIL CHIRA (H)",
      city: "Alappuzha",
      pincode: "686534",
    },
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        const data = await response.json();
        setOrders(data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleLogout = () => {
    // Clear session/cookie logic
    router.push("/login");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-2xl font-bold text-center mb-4">Profile</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold">Personal Information</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold">Address</h2>
        <p>{user.address.street}, {user.address.city} - {user.address.pincode}</p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold">Orders</h2>
        {orders.length > 0 ? (
          <ul className="space-y-2">
            {orders.map((order) => (
              <li className="bg-white p-3 rounded shadow">
                {/* <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Product:</strong> {order.product.title}</p>
                <p><strong>Price:</strong> ₹{order.product.price}</p>
                <p><strong>Status:</strong> {order.status}</p> */}
              </li>
            ))}
          </ul>
        ) : (
          <p>No orders found.</p>
        )}
      </div>

      <button 
        className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
