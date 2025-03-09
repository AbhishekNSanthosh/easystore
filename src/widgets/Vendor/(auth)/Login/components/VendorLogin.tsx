"use client";
import CustomButton from "@components/Button";
import CustomLink from "@components/Link";
import Image from "next/image";
import React, { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import easyToast from "@components/EasyToast";

export default function VendorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; desc: string } | null>(
    null
  );
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Attempting login...");

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!res || !res.ok) {
        throw new Error(res?.error || "Invalid credentials");
      }

      easyToast({
        message: "Login Successful",
        desc: "Redirecting to the dashboard",
        type: "success",
      });

      const response = await fetch("/api/v1/vendor/getVendorDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vendorEmail: email }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile details");
      }

      const profileDetails = await response.json();
      console.log(profileDetails);
      if (profileDetails?.vendor?.isNewAccount) {
        router.push(`/onboarding/${profileDetails?.vendor?._id}`);
      } else {
        router.push("/dashboard/home");
      }
    } catch (err: any) {
      console.log("Login error:", err);

      let errorMessage = "An unknown error occurred";
      let errorDesc = "Please try again later.";

      if (err?.message) {
        errorMessage = err.message;
      }

      setError({ message: errorMessage, desc: errorDesc });

      easyToast({
        message: errorMessage,
        desc: errorDesc,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  console.log(session);
  return (
    <div className="px-[5vw] flex flex-col h-screen">
      <div className="flex items-center justify-between pt-[2rem]">
        <CustomLink href={"/"}>
          <Image
            src={"/logo.svg"}
            alt=""
            width={1000}
            height={1000}
            className="w-[10rem]"
          />
        </CustomLink>
        <div className="">
          <span className="">
            Facing Issues ?{" "}
            <CustomLink className="text-primary font-semibold" href={""}>
              Contact
            </CustomLink>
          </span>
        </div>
      </div>
      <div className="flex h-full flex-row w-full">
        <div className="flex-1 flex items-center justify-center">
          <Image
            src={"/vendor/login.svg"}
            alt=""
            width={1000}
            height={1000}
            className="w-[35rem]"
          />
        </div>
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
                className="bg-primary w-full text-secondary font-semibold capitalize px-2 py-2 rounded-[14px]"
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
