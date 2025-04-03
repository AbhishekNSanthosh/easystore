"use client";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { StoreData } from "../../../../../../interface";
import Image from "next/image";
import { MdAssignment, MdEventNote } from "react-icons/md";
import dayjs from "dayjs";
import { PhoneCall, CheckCircle, XCircle } from "lucide-react";
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
}

export default function Content() {
  const [store, setStore] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState("pending");
  const [orderStatuses, setOrderStatuses] = useState<{ [key: string]: string }>(
    {}
  );

  const [error, setError] = useState("");
  const { data: session } = useSession();

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
  const [subdomain, setSubdomain] = useState(Cookies.get("subdomain") || ""); // Get subdomain from cookies

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

        // Set CSS variables for primary color
        document.documentElement.style.setProperty(
          "--primary-color",
          data.store.primaryColor
        );
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

  const days = Array.from({ length: 4 }, (_, i) =>
    dayjs()
      .add(i, "day")
      .format(i === 0 ? "[Today,] ddd DD MMM" : "ddd")
  );

  const cards = [
    {
      id: 1,
      icon: (
        <MdAssignment
          className="text-green-700 bg-green-100 p-2 rounded-full"
          size={40}
        />
      ),
      title: "Orders today",
      count: 4,
    },
    {
      id: 2,
      icon: (
        <MdEventNote
          className="text-blue-700 bg-red-100 p-2 rounded-full"
          size={40}
        />
      ),
      title: "Upcoming",
      count: 18,
    },
  ];

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
        // Fetch the latest orders to ensure real-time updates
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
        <div className="w-full h-full justify-center flex items-center">
          <p>Loading...</p>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : store ? (
        <div className="flex flex-col justify-start gap-5 w-full h-full">
          <div className="flex flex-row items-center gap-5">
            <Image
              src={store.logoUrl}
              width={1000}
              height={1000}
              alt={store.storeName}
              className="w-16 h-16 rounded-full mt-2"
            />
            <div className="flex gap-5 justify-between flex-row w-[18vw] items-center">
              <div className="flex flex-col gap-1">
                <h2 className="font-semibold text-xl">{store?.storeName}</h2>
                <p className="text-sm">
                  You’ve {orders?.length} orders this month
                </p>
              </div>
            </div>
          </div>
          {/* <div className="flex gap-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-white p-[14px] rounded-xl flex flex-col items-start gap-[16px] w-40"
              >
                {card.icon}
                <div className="">
                  <p className="text-gray-500 mt-2 text-sm">{card.title}</p>
                  <p className="text-lg font-bold">{card.count} Orders</p>
                </div>
              </div>
            ))}
          </div> */}

          <div className="">
            <h2 className="text-lg font-semibold mb-2">Upcomming Orders</h2>
            {/* <div className="flex gap-4">
              {days.map((day, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-full text-sm ${
                    selectedDay === index
                      ? "bg-white font-semibold"
                      : "text-gray-500"
                  }`}
                  onClick={() => setSelectedDay(index)}
                >
                  {day}
                </button>
              ))}
            </div> */}
          </div>

            {orders?.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center">There're no orders yet</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <>
                {orders.map((order) => (
                  <div
                    key={order?._id}
                    className="bg-white rounded-2xl p-4 flex items-start gap-4"
                  >
                    <Image
                      src={order?.product?.imgUrl}
                      width={1000}
                      height={1000}
                      alt="Product"
                      className="w-36 h-full rounded-xl object-cover"
                    />
                    <div className="flex-1 flex-col flex justify-start">
                      <h2 className="text-lg font-semibold">
                        {order?.product?.title}
                      </h2>
                      <p className="text-blue-600 font-semibold my-2">
                        {order?.address?.name}
                      </p>
                      <p className="text-sm text-gray-600">Order Count: 1</p>
                      {/* <p className="text-sm text-gray-600">
                    Delivery Date: {order.deliveryDate}
                  </p> */}
                      <p className="text-sm text-gray-600">
                        Address: {order?.address?.city}
                        {order?.address?.street}
                        {order?.address?.pincode}
                      </p>
                      {/* <p className="text-sm text-gray-600">Note: {order.note}</p> */}
                      <div className="flex items-center justify-between mt-2">
                        <a
                          href={`tel:${order?.address?.phone}`}
                          className="text-blue-500 flex items-center gap-2"
                        >
                          <PhoneCall size={18} />
                          {order?.address?.phone}
                        </a>
                        <select
                          value={order.status} // Use order-specific status
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
              </>
          </div>
            )}
        </div>
      ) : (
        <div className="w-full h-full items-center flex justify-center">
          <p>Store not found.</p>
        </div>
      )}
    </div>
  );
}
