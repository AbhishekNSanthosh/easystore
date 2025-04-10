"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import CustomButton from "@components/Button";
import { Heart } from "lucide-react";
import SearchBar from "../components/SearchBar";
import easyToast from "@components/EasyToast";

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

export default function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [liked, setLiked] = useState(-1);
  const router = useRouter();

  const { subdomain } = useParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [token, setToken] = useState<string | undefined>(Cookies.get("token"));
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, products]);

  useEffect(() => {
    if (!token) {
      console.error("No token found! Redirecting to login...");
      router.push("/signin");
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
      } catch (error) {
        console.error("Error fetching profile details:", error);
      }
    };

    fetchProfileDetails();
  }, [token, router]);

  useEffect(() => {
    if (!subdomain) return;

    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/v1/vendor/getProductList", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ subdomain, count: 0 }), // Send subdomain in body
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.status}`);
        }

        const data = await res.json();
        setProducts(data?.products || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [subdomain]); // Re-run when subdomain changes

  const handleAddToCart = (product: Product, userId: string | undefined) => {
    if (!userId) {
      easyToast({
        message: "Please log in to add items to the cart.",
        type: "error",
      });
      return;
    }

    const cartKey = `cart_${userId}`; // Store user-specific cart
    const existingCart = Cookies.get(cartKey);
    const cart = existingCart ? JSON.parse(existingCart) : [];

    // Check if product is already in the cart
    const isAlreadyInCart = cart.some(
      (item: Product) => item._id === product._id
    );

    if (!isAlreadyInCart) {
      cart.push(product);
      Cookies.set(cartKey, JSON.stringify(cart), { expires: 7 }); // Store for 7 days

      // Dispatch event to update header cart count
      window.dispatchEvent(new Event("cartUpdated"));

      easyToast({ message: "Added to cart", type: "success" });
    } else {
      easyToast({ message: "Product is already in the cart!", type: "info" });
    }
  };

  if (loading) return <p className="text-center">Loading products...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="px-[5vw]">
      <div className="py-[2vh]">
        <SearchBar setSearchQuery={setSearchQuery} />
      </div>
      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={product._id}
              className="border rounded-lg p-3 transition relative"
            >
              {/* Like Icon */}
              {/* <button
                onClick={() => setLiked(index)}
                className="absolute top-5 right-5 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <Heart
                  className={`w-5 h-5 ${
                    liked === index
                      ? "text-red-500 fill-red-500"
                      : "text-gray-400"
                  }`}
                />
              </button> */}

              {/* Product Image */}
              {product.imgUrl ? (
                <Image
                  src={product.imgUrl}
                  alt={product.title}
                  width={1000}
                  height={1000}
                  className="w-[300px] h-[300px] object-cover rounded-md"
                  unoptimized
                />
              ) : (
                <span>No Image Available</span>
              )}

              {/* Product Title */}
              <h3 className="text-lg font-semibold mt-2">{product.title}</h3>

              {/* Product Price */}
              <p className="text-gray-700">
                <span className="text-red+-500 font-bold">${product.price}</span>
                {product.oldPrice && (
                  <span className="text-gray-500 line-through ml-2">
                    ${product.oldPrice}
                  </span>
                )}
              </p>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-2">
                <button className="w-1/2  text-white dynamicBgDark py-2 rounded-md hover:bg-blue-600 transition">
                  Buy Now
                </button>
                <button
                  onClick={() => {
                    handleAddToCart(product, user?._id);
                  }}
                  className="w-1/2 dynamicTextColor py-2 rounded-md transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
