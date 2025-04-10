"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { StoreData } from "../../../../../../interface";
import Image from "next/image";
import { MdAssignment, MdEventNote } from "react-icons/md";
import dayjs from "dayjs";
import { PhoneCall } from "lucide-react";
import Cookies from "js-cookie";

interface Product {
  _id: string;
  title: string;
  price: number;
  oldPrice?: number;
  imgUrl: string;
}

interface Address {
  name: string;
  phone: string;
  street: string;
  city: string;
  pincode: string;
}

interface Order {
  _id: string;
  productId: string;
  subdomain: string;
  address: Address;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
  product: Product;
  size?: string;
  quantity?: number;
}

export default function Content() {
  const [store, setStore] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  const [subdomain, setSubdomain] = useState(Cookies.get("subdomain") || "");

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
    if (!session?.user?._id) return;

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
        document.documentElement.style.setProperty(
          "--primary-color",
          data.store.primaryColor
        );
        document.documentElement.style.setProperty(
          "--primary-rgb",
          hexToRGB(data.store.primaryColor)
        );
        setIsLoaded(true);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [session]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/v1/vendor/getOrders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subdomain }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [subdomain]);

  const updateStatus = async (newStatus: string, orderId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/vendor/updateStatus`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, orderId }),
      });

      if (response.ok) {
        await fetchOrders();
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  return (
    <div className="w-full h-full">
      {loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <p>Loading...</p>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : store ? (
        <div className="flex flex-col gap-5 w-full h-full">
          <div className="flex flex-row items-center gap-5">
            <div className="flex gap-5 justify-between flex-row w-[18vw] items-center">
              <div className="flex flex-col gap-1">
                <h2 className="font-semibold text-xl">{store.storeName}</h2>
                <p className="text-sm">
                  You’ve {orders.length} orders this month
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Upcoming Orders</h2>
          </div>

          {orders.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center">
              There're no orders yet
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl p-4 flex items-start gap-4"
                >
                  <Image
                    src={order.product.imgUrl}
                    width={1000}
                    height={1000}
                    alt="Product"
                    className="w-44 h-44 rounded-xl object-cover"
                  />
                  <div className="flex-1 flex-col flex justify-start">
                    <h2 className="text-lg font-semibold">
                      {order.product.title}
                    </h2>
                    <p className="text-blue-600 font-semibold my-2">
                      {order.address.name}
                    </p>

                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Quantity:</span>{" "}
                      {order.quantity || 1}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Size:</span>{" "}
                      {order.size || "N/A"}
                    </p>

                    <p className="text-sm text-gray-600">
                      Address: {order.address.city}, {order.address.street},{" "}
                      {order.address.pincode}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <a
                        href={`tel:${order.address.phone}`}
                        className="text-blue-500 flex items-center gap-2"
                      >
                        <PhoneCall size={18} />
                        {order.address.phone}
                      </a>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(e.target.value, order._id)
                        }
                        disabled={loading}
                        className="border rounded-md px-3 py-1 bg-white text-gray-700 focus:outline-none"
                      >
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p>Store not found.</p>
        </div>
      )}
    </div>
  );
}
