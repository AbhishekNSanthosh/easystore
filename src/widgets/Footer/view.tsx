"use client"
import ScrollToTopButton from "@components/ScrollToTop";
import Image from "next/image";
import React from "react";
import { IoMdSend } from "react-icons/io";

export default function Footer() {
    
  return (
    <div className="px-6 lg:px-12 py-8 lg:py-16 w-full flex flex-col lg:flex-row relative pb-[200px] lg:pb-[300px]">
      {/* Left Section */}
      <div className="flex-1 mb-8 lg:mb-0 lg:pr-8">
        <span className="font-medium text-secondary text-base lg:text-lg leading-relaxed">
        Empowering businesses with <br /> customizable stores to reach more customers.
        </span>
        <div className="lg:absolute lg:bottom-[80px] mt-6 lg:mt-10 bg-gray-200 w-full max-w-md flex items-center rounded-full pl-4 pr-2 py-2">
          <input
            type="text"
            className="flex-1 bg-transparent px-2 bg-gray-200 py-1 text-sm lg:text-base outline-none placeholder:text-gray-600"
            placeholder="youremail@gmail.com"
          />
          <div className="bg-[#200F33] p-3 rounded-full flex items-center justify-center cursor-pointer">
            <IoMdSend className="text-xl lg:text-2xl text-white" />
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="flex-1 flex flex-wrap gap-y-6 lg:gap-y-0 lg:gap-x-16 relative">
        <div className="flex flex-col gap-2 w-1/2 lg:w-auto">
          <span className="text-gray-700 font-medium text-sm lg:text-base">Home</span>
          <span className="text-gray-700 font-medium text-sm lg:text-base">Service</span>
          <span className="text-gray-700 font-medium text-sm lg:text-base">About</span>
          <span className="text-gray-700 font-medium text-sm lg:text-base">Product</span>
        </div>
        <div className="flex flex-col gap-2 w-1/2 lg:w-auto">
          <span className="text-gray-700 font-medium text-sm lg:text-base">Home</span>
          <span className="text-gray-700 font-medium text-sm lg:text-base">Service</span>
          <span className="text-gray-700 font-medium text-sm lg:text-base">About</span>
          <span className="text-gray-700 font-medium text-sm lg:text-base">Product</span>
        </div>

        {/* Scroll to Top Button */}
        <div className="absolute right-[-2.5rem] bottom-[-30px] lg:top-0 lg:right-[-40px]">
          <ScrollToTopButton />
        </div>
      </div>

      {/* Background Image */}
      <Image
        src="/Easystore.svg"
        alt="Background Illustration"
        width={1000}
        height={1000}
        className="w-[40rem] lg:w-[60rem] absolute bottom-0 right-0 opacity-80"
      />
    </div>
  );
}