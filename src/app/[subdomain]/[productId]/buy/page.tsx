"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import easyToast from "@components/EasyToast";
import UserPreLoader from "@components/UserPreloader";

interface Product {
  _id: string;
  imgUrl: string;
  title: string;
  price: number;
  oldPrice?: number;
  availableSizes?: number[];
}

export default function Page() {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const parts = window.location.hostname.split(".");
      const subdomain = parts[0];
      const pathnameParts = window.location.pathname.split("/");
      const productId = pathnameParts[1];

      fetchProductDetails(subdomain, productId);
    }
  }, []);

  const fetchProductDetails = async (subdomain: string, productId: string) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch("/api/v1/customer/getProductDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subdomain, productId }),
      });

      const data = await response.json();
      if (response.ok) {
        setProduct(data.product);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleBuy = async () => {
    if (!product || !selectedSize) {
      easyToast({
        message: "Please select a size.",
        type: "info",
      });
      return;
    }

    const token = Cookies.get("token");

    const orderData = {
      productId: product._id,
      subdomain: window.location.hostname.split(".")[0],
      address,
      size: selectedSize,
      quantity,
      token,
    };

    try {
      const response = await fetch("/api/v1/customer/placeOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (response.ok) {
        easyToast({
          message: "Order placed successfully!",
          type: "success",
        });
        router.push(`/order-success/${data.orderId}`);
      } else {
        easyToast({
          message: "Failed to place order.",
          desc: "Kindly refresh and try again!",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      {!isLoaded && <UserPreLoader />}
      <div className="max-w-3xl mx-auto p-4">
        {product ? (
          <div className="bg-white rounded-2xl p-6">
            <img
              src={product.imgUrl}
              alt={product.title}
              className="w-full h-64 object-cover rounded-xl mb-4"
            />
            <h2 className="text-2xl font-bold text-black mb-2">
              {product.title}
            </h2>
            <p className="text-xl font-semibold text-blue-600">
              ₹{product.oldPrice}
              {product.price && (
                <span className="ml-2 line-through text-red-500 text-sm">
                  ₹{product.oldPrice}
                </span>
              )}
            </p>

            {/* Size Selector */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Select Size</h3>
              <div className="flex gap-2 flex-wrap">
                {product.availableSizes?.map((size) => (
                  <button
                    key={size}
                    className={`px-4 py-2 rounded-full border ${
                      selectedSize === size
                        ? "dynamicBgDark text-white dynamicBorder"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Quantity</h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-xl font-bold text-gray-700 hover:bg-gray-100"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Number(e.target.value)))
                  }
                  className="w-16 text-center border border-gray-300 rounded-md px-2 py-1"
                />
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-xl font-bold text-gray-700 hover:bg-gray-100"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Address Form */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Delivery Address</h3>
              <div className="grid grid-cols-1 gap-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="border rounded-md px-3 py-2"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  className="border rounded-md px-3 py-2"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="street"
                  placeholder="Street Address"
                  className="border rounded-md px-3 py-2"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  className="border rounded-md px-3 py-2"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  className="border rounded-md px-3 py-2"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <button
              className="dynamicBgDark hover:bg-blue-700 text-white text-lg w-full mt-6 py-3 rounded-xl transition-all duration-200"
              onClick={handleBuy}
            >
              Place Order
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Loading product details...
          </p>
        )}
      </div>
    </main>
  );
}
