"use client";
import CustomButton from "@components/Button";
import CustomLink from "@components/Link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import easyToast from "@components/EasyToast";
import Link from "next/link";
import Cookies from "js-cookie";

export default function CustomerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; desc: string } | null>(
    null
  );
  const router = useRouter();
  const { data: session, status } = useSession();

  const { subdomain } = useParams();
  const location = usePathname();
  console.log(location);
  console.log(subdomain);
  const [store, setStore] = useState<any>(null);

  const authRoutes = ["/signin", "/signup"];

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
    if (!subdomain) return;

    const fetchStore = async () => {
      try {
        const response = await fetch("/api/v1/customer/getStoreDetails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ subdomain }),
        });

        const data = await response.json();

        if (!response.ok)
          throw new Error(data.message || "Failed to fetch store");

        setStore(data.store);
        // Set CSS variable for primary color
        document.documentElement.style.setProperty(
          "--primary-color",
          data.store.primaryColor
        );
        document.documentElement.style.setProperty(
          "--primary-rgb",
          hexToRGB(data.store.primaryColor)
        );
        console.log(data.store.primaryColor);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [subdomain]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      const response = await fetch("/api/v1/customer/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token in cookies (secure & HTTP-only for production)
        Cookies.set("token", data.token, {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        });
        easyToast({
          message: data.message || "Login Success",
          type: "success",
        });

       router.push('/')
      } else {
        easyToast({
          message: data.message || "Login failed",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  console.log("logo", store);
  return (
    <div className="px-[5vw] flex flex-col h-screen">
      <div className="flex items-center justify-between pt-[2rem]">
        <CustomLink href={"/"}>
          {store?.logoUrl ? (
            <Image
              src={store.logoUrl}
              alt={store.name || "Store Logo"}
              width={1000}
              height={1000}
              className="w-[8rem]"
            />
          ) : (
            <span>No Logo Available</span>
          )}
        </CustomLink>
        <div className="">
          <span className="">
            Facing Issues ?{" "}
            <CustomLink className="dynamicTextColor font-semibold" href={""}>
              Contact
            </CustomLink>
          </span>
        </div>
      </div>
      <div className="flex h-full flex-row w-full">
        {/* <div className="flex-1 flex items-center justify-center">
          <Image
            src={"https://firebasestorage.googleapis.com/v0/b/informatyka-4b6e6.appspot.com/o/login.svg?alt=media&token=c5d91046-ffd8-42c0-87a3-6160e1b34019"}
            alt=""
            width={1000}
            height={1000}
            className="w-[35rem]"
          />
        </div> */}
        <div className="flex-1 flex items-center justify-center">
          <div className="shadow-sm rounded-[20px] border-[.5px] border-opacity-10 border-secondary p-10 space-y-4 flex flex-col w-[27rem] items-center justify-center">
            <span className="font-semibold">Sign in with Email</span>
            <div className="">
              <p className="text-gray-800 text-sm text-center">
                Sign in to manage your store, track orders, and streamline
                payments—all in one place.
              </p>
            </div>
            <form
              className="flex flex-col items-center space-y-5 w-full"
              onSubmit={handleLogin}
            >
              <input
                type="email"
                className="bg-secondary py-3 px-2 w-full bg-opacity-5 rounded-[14px] outline-none border-none"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                className="bg-secondary py-3 px-2 w-full bg-opacity-5 rounded-[14px] outline-none border-none"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex w-full justify-end items-center">
                <CustomLink href={"/"} className="flex mt-[-13px] text-sm">
                  Forgot password?
                </CustomLink>
              </div>
              <CustomButton
                type="submit"
                className="dynamicBgDark text-white w-full font-semibold capitalize px-2 py-2 rounded-[14px]"
                label={loading ? "Signing in..." : "Sign in"}
                disabled={loading}
              />
            </form>
            {error && (
              <p className="text-red-500 text-sm text-center">
                {error.message}
              </p>
            )}
            <div className="flex flex-row w-full items-center justify-center">
              <div className="h-[1px] w-full bg-gray-400 flex-1"></div>
              <div className="flex-[1.5] flex items-center justify-center">
                <span className="text-sm">New to Easystore?</span>
              </div>
              <div className="h-[1px] flex-1 w-full bg-gray-400"></div>
            </div>
            <div className="w-full flex items-center justify-center mt-0">
              <CustomLink href={"/signup"} className="w-full">
                <CustomButton
                  className="border border-opacity-20 border-secondary w-full font-medium text-secondary px-2 py-2 rounded-[14px]"
                  label="Create account"
                />
              </CustomLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
