import Image from "next/image";
import React from "react";
import { IoCartOutline } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";
import { FiSearch } from "react-icons/fi"; // Import search icon

interface HeaderProps {
  storeData: {
    name: string;
    logoUrl?: string; // Make it optional to prevent errors
  };
}

export default function Header({ storeData }: HeaderProps) {
  return (
    <div className="w-full px-[5vw] h-[10vh] flex items-center border-b border-gray-200 bg-white">
      {/* Logo Section */}
      <div className="flex-1">
        <div>
          {storeData?.logoUrl ? (
            <Image
              src={storeData.logoUrl}
              alt={storeData.name || "Store Logo"}
              width={1000}
              height={1000}
              className="w-[8rem]"
            />
          ) : (
            <span>No Logo Available</span>
          )}
        </div>
      </div>

      {/* Search Box Section */}
     

      {/* Icons and Links Section */}
      <div className="flex-1 flex items-center justify-end">
        <div className="flex items-center gap-8 justify-end text-2xl">
          <div className="flex flex-row items-center gap-7 text-base">
            <span className="hover:text-blue-500 cursor-pointer">About</span>
            <span className="hover:text-blue-500 cursor-pointer">Faqs</span>
          </div>
          <div className="hover:text-red-500 cursor-pointer">
            <IoMdHeartEmpty />
          </div>
          <div className="hover:text-blue-500 cursor-pointer">
            <IoCartOutline />
          </div>
        </div>
      </div>
    </div>
  );
}
