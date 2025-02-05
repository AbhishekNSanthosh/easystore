import CustomButton from "@components/Button";
import CustomLink from "@components/Link";
import Image from "next/image";
import React from "react";

export default function VendorSignup() {
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
          <div className="shadow-sm rounded-[20px] border-[.5px] border-opacity-10 border-secondary p-10 space-y-4 flex flex-col w-[37rem] items-center justify-center">
          <span className="font-semibold">Sign up with Email</span>
<div className="w-full">
  <p className="text-gray-800 text-sm text-center">
    Create an account to set up your store, manage orders, and simplify payments—all in one place.
  </p>
</div>

            <div className="flex flex-col items-center space-y-5 w-full">
              <div className="flex flex-row gap-3 w-full">
                <input
                  type="text"
                  className="bg-secondary py-3 px-2 w-full bg-opacity-5 rounded-[14px] outline-none border-none"
                  placeholder="First Name"
                />
                <input
                  type="text"
                  className="bg-secondary py-3 px-2 w-full bg-opacity-5 rounded-[14px] outline-none border-none"
                  placeholder="Last Name"
                />
              </div>
              <div className="flex flex-row gap-3 w-full">
                <input
                  type="text"
                  className="bg-secondary py-3 px-2 w-full bg-opacity-5 rounded-[14px] outline-none border-none"
                  placeholder="Email"
                />
                <input
                  type="text"
                  className="bg-secondary py-3 px-2 w-full bg-opacity-5 rounded-[14px] outline-none border-none"
                  placeholder="Mobile Number"
                />
              </div>
              <div className="flex flex-row gap-3 w-full">
                <input
                  type="text"
                  className="bg-secondary py-3 px-2 w-full bg-opacity-5 rounded-[14px] outline-none border-none"
                  placeholder="Password"
                />
                <input
                  type="text"
                  className="bg-secondary py-3 px-2 w-full bg-opacity-5 rounded-[14px] outline-none border-none"
                  placeholder="Password"
                />
              </div>
            </div>
            <div className="flex w-full justify-end items-center ">
              <CustomLink href={"/"} className="flex mt-[-13px] text-sm">
                Forgot password?
              </CustomLink>
            </div>
            <div className="w-full flex items-center justify-center mt-0">
              <CustomButton
                className="bg-primary w-full text-secondary font-semibold capitalize px-2 py-2 rounded-[14px]"
                label="Sign up"
              />
            </div>
            <div className="w-full flex items-center justify-center mt-0">
              <span className="">
                Already have an account?{" "}
                <CustomLink href={"/login"} className="text-primary font-semibold">Login</CustomLink>
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
