"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Import js-cookie

interface Product {
  _id: string;
  imgUrl: string;
  title: string;
  price: number;
  oldPrice?: number;
}

export default function Page() {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    pincode: "",
  });

  // Extract subdomain and productId from URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const parts = window.location.hostname.split(".");
      const subdomain = parts[0]; // e.g., "milkymist"
      const pathnameParts = window.location.pathname.split("/");
      const productId = pathnameParts[1]; // e.g., "67e51c268d5160544dd7de5c"

      fetchProductDetails(subdomain, productId);
    }
  }, []);

  // Fetch product details from API
  const fetchProductDetails = async (subdomain: string, productId: string) => {
    try {
      // Extract the token from cookies using js-cookie
      const token = Cookies.get("token");

      // Fetch the product details
      const response = await fetch("/api/v1/customer/getProductDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token in the header
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

  // Handle input change in address form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  // Handle Buy action
  const handleBuy = async () => {
    if (!product) return;
    const token = Cookies.get("token");

    const orderData = {
      productId: product._id,
      subdomain: window.location.hostname.split(".")[0], // Extract subdomain
      address,
      token
    };

    try {
      // Extract the token from cookies using js-cookie

      // Send the order data to the backend with the token
      const response = await fetch("/api/v1/customer/placeOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Order placed successfully!");
        router.push(`/order-success/${data.orderId}`);
      } else {
        alert("Failed to place order: " + data.message);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      {product ? (
        <>
          <h2 className="text-xl font-semibold">{product.title}</h2>
          <img src={product.imgUrl} alt={product.title} className="w-full h-48 object-cover" />
          <p className="text-lg text-gray-700">
            Price: ₹{product.price}{" "}
            {product.oldPrice && <span className="line-through text-red-500">₹{product.oldPrice}</span>}
          </p>

          {/* Address Form */}
          <h3 className="mt-4 text-lg font-semibold">Enter Delivery Address</h3>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full border p-2 my-2"
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            className="w-full border p-2 my-2"
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="street"
            placeholder="Street Address"
            className="w-full border p-2 my-2"
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            className="w-full border p-2 my-2"
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            className="w-full border p-2 my-2"
            onChange={handleInputChange}
          />

          {/* Buy Button */}
          <button className="dynamicBgDark text-white py-2 px-4 w-full mt-4" onClick={handleBuy}>
            Place Order
          </button>
        </>
      ) : (
        <p>Loading product details...</p>
      )}
    </div>
  );
}
