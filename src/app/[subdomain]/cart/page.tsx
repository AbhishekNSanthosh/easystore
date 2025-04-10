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
  const [cartItems, setCartItems] = useState<Product[]>([]);

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

  // Load cart from cookies based on user ID
  useEffect(() => {
    if (!user?._id) return;

    const cartKey = `cart_${user._id}`;
    const cart = Cookies.get(cartKey);
    setCartItems(cart ? JSON.parse(cart) : []);
  }, [user]);

  // Remove item from cart
  const handleRemoveFromCart = (productId: string) => {
    const updatedCart = cartItems.filter((item) => item._id !== productId);
    setCartItems(updatedCart);
    Cookies.set(`cart_${user?._id}`, JSON.stringify(updatedCart), { expires: 7 });

    // Dispatch event for cart update
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Handle Buy Now
  const handleBuyNow = (product: Product) => {
    console.log("Buying product:", product);
    // Navigate to checkout with the selected product
    router.push(`/${product._id}/buy`);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/signin");
  };

  return (
    <div className="max-w-4xl min-h-[90vh] mx-auto p-6 bg-white  mt-10">
      <h2 className="text-2xl font-semibold mb-4">My Cart</h2>
      {cartItems.length > 0 ? (
        <div className="space-y-4">
          {cartItems.map((product) => (
            <div key={product._id} className="flex items-center gap-4 p-4 border rounded-md">
              <Image src={product.imgUrl} alt={product.title} width={80} height={80} className="rounded-md"/>
              <div className="flex-1">
  <h3 className="text-lg font-medium">{product.title}</h3>
  <p className="text-gray-600">
    <span className="line-through text-red-500">₹{product.oldPrice}</span>
  </p>
  <p className="text-gray-600">₹{product.price}</p>
</div>

              <button
                onClick={() => handleBuyNow(product)}
                className="dynamicBgDark text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Buy Now
              </button>
              <button
                onClick={() => handleRemoveFromCart(product._id)}
                className="dynamicBorder dynamicTextColor px-4 py-2 rounded-md "
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Your cart is empty.</p>
      )}
    </div>
  );
}
