"use client";
import CustomButton from "@components/Button";
import easyToast from "@components/EasyToast";
import CustomLink from "@components/Link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function VendorSignup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.mobileNumber || !formData.password) {
      setError("All fields are required.");
      return;
    }

    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/v1/vendor/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      router.push('/login')
      easyToast({ message: data?.message || "", desc: data?.desc, type: "success" });
    } catch (err: any) {
      setError(err.message);
      easyToast({ message: err?.message || "Registration failed.", desc: err?.desc, type: "error" });
    } finally {
      setLoading(false);
    }
  };


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
        <div>
          <span>
            Facing Issues?{" "}
            <CustomLink className="text-primary font-semibold" href={""}>
              Contact
            </CustomLink>
          </span>
        </div>
      </div>
      <div className="flex h-full flex-row w-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="shadow-sm rounded-[20px] border-[.5px] border-opacity-10 border-secondary p-10 space-y-4 flex flex-col w-[37rem] items-center justify-center">
            <span className="font-semibold">Sign up with Email</span>
            <div className="w-full">
              <p className="text-gray-800 text-sm text-center">
                Create an account to set up your store, manage orders, and
                simplify payments—all in one place.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-5 w-full">
              <div className="flex flex-row gap-3 w-full">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="bg-secondary py-3 px-2 w-full bg-opacity-5 rounded-[14px] outline-none border-none"
                  placeholder="First Name"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="bg-secondary py-3 px-2 w-full bg-opacity-5 rounded-[14px] outline-none border-none"
                  placeholder="Last Name"
                />
              </div>
              <div className="flex flex-row gap-3 w-full">
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-secondary py-3 px-2 w-full bg-opacity-5 rounded-[14px] outline-none border-none"
                  placeholder="Email"
                />
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className="bg-secondary py-3 px-2 w-full bg-opacity-5 rounded-[14px] outline-none border-none"
                  placeholder="Mobile Number"
                />
              </div>
              <div className="flex flex-row gap-3 w-full">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-secondary py-3 px-2 w-full bg-opacity-5 rounded-[14px] outline-none border-none"
                  placeholder="Password"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="bg-secondary py-3 px-2 w-full bg-opacity-5 rounded-[14px] outline-none border-none"
                  placeholder="Confirm Password"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex w-full justify-end items-center">
              <CustomLink href={"/"} className="flex mt-[-13px] text-sm">
                Forgot password?
              </CustomLink>
            </div>

            <div className="w-full flex items-center justify-center mt-0">
              <CustomButton
                className="bg-primary w-full text-secondary font-semibold capitalize px-2 py-2 rounded-[14px]"
                label={loading ? "Signing up..." : "Sign up"}
                onClick={handleSubmit}
                disabled={loading}
              />
            </div>

            <div className="w-full flex items-center justify-center mt-0">
              <span>
                Already have an account?{" "}
                <CustomLink
                  href={"/login"}
                  className="text-primary font-semibold"
                >
                  Login
                </CustomLink>
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Image
            src={"/vendor/signup.svg"}
            alt=""
            width={1000}
            height={1000}
            className="w-[30rem]"
          />
        </div>
      </div>
    </div>
  );
}
