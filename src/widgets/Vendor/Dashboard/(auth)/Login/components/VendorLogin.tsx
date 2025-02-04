import CustomButton from "@components/Button";
import CustomLink from "@components/Link";
import Image from "next/image";
import React from "react";

export default function VendorLogin() {
  return (
    <div className="px-[5vw] flex flex-col h-screen">
        <div className="flex items-center justify-between pt-[2rem]">
        <Image
            src={"/logo.svg"}
            alt=""
            width={1000}
            height={1000}
            className="w-[10rem]"
          />
          <div className="">
            <span className="">Facing Issues ? <CustomLink className="text-primary font-semibold" href={''}>Contact</CustomLink></span>
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
            <div className="flex flex-col items-center space-y-5 w-full">
              <input
                type="text"
                className="bg-secondary py-3 px-2 w-full bg-opacity-5 rounded-[14px] outline-none border-none"
                placeholder="Email"
              />
              <input
                type="text"
                className="bg-secondary py-3 px-2 w-full bg-opacity-5 rounded-[14px] outline-none border-none"
                placeholder="Password"
              />
            </div>
            <div className="flex w-full justify-end items-center ">
              <CustomLink href={"/"} className="flex mt-[-13px] text-sm">
                Forgot password?
              </CustomLink>
            </div>
            <div className="w-full flex items-center justify-center mt-0">
              <CustomButton
                className="bg-primary w-full text-secondary font-semibold capitalize px-2 py-2 rounded-[14px]"
                label="Sign in"
              />
            </div>
            <div className="flex flex-row w-full items-center justify-center">
              <div className="h-[1px] w-full bg-gray-400 flex-1"></div>
              <div className="flex-[1.5] flex items-center justify-center">
                <span className="text-sm">New to Easystore?</span>
              </div>
              <div className="h-[1px] flex-1 w-full bg-gray-400"></div>
            </div>
            <div className="w-full flex items-center justify-center mt-0">
              <CustomButton
                className="border border-opacity-20 border-secondary w-full font-medium text-secondary px-2 py-2 rounded-[14px]"
                label="Create account"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
