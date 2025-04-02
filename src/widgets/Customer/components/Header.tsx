"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";
import { FiLogIn } from "react-icons/fi";
import Link from "next/link";
import Cookies from "js-cookie";
import { CgProfile } from "react-icons/cg";

interface HeaderProps {
  storeData: {
    name: string;
    logoUrl?: string; // Make it optional to prevent errors
  };
}

export default function Header({ storeData }: HeaderProps) {
  const [user, setUser] = useState<boolean | null>(null);

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      setUser(true); // User is authenticated
    } else {
      setUser(false); // No token found, user is not authenticated
    }
  }, []);
  return (
    <div className="w-full px-[5vw] h-[10vh] flex items-center border-b border-gray-200 bg-white">
      {/* Logo Section */}
      <div className="flex-1">
        <div>
          {storeData?.logoUrl ? (
            <Link href={"/"}>
              <Image
                src={storeData.logoUrl}
                alt={storeData.name || "Store Logo"}
                width={1000}
                height={1000}
                className="w-[8rem]"
              />
            </Link>
          ) : (
            <span>No Logo Available</span>
          )}
        </div>
      </div>

      {/* Search Box Section */}

      {/* Icons and Links Section */}
      <div className="flex-1 flex items-center justify-end">
        <div className="flex items-center gap-8 justify-end text-2xl">
          {/* <div className="flex flex-row items-center gap-7 text-base">
            <span className="hover:text-blue-500 cursor-pointer">About</span>
            <span className="hover:text-blue-500 cursor-pointer">Faqs</span>
          </div> */}
          <div className="hover:text-red-500 cursor-pointer">
            <IoMdHeartEmpty />
          </div>
          <div className="hover:text-blue-500 cursor-pointer">
            <IoCartOutline />
          </div>
          <div className="hover:text-blue-500 cursor-pointer">
            {user ? (
              <Link href={"/profile"}>
              {" "}
              <CgProfile />
            </Link>
            ) : (
              <Link href={"/signin"}>
                {" "}
                <FiLogIn />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
