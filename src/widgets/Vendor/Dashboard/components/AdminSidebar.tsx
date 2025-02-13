"use client"
import Image from "next/image";
import React from "react";
import { HiUserAdd } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import { IoMdListBox } from "react-icons/io";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { MdSpaceDashboard } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const location = usePathname();
  const menuItems = [
    {
      title: "Home",
      link: "/dashboard/home",
      icon: <FaHome className="text-[22px]" />,
    },
  ];
  return (
    <div className="w-[15vw] fixed left-0 bg-white h-full py-2">
      <div className="w-full items-center justify-center flex mt-[2vh]">
        <span className="font-semibold text-3xl text-dashcolor-500">myntra</span>
      </div>
      <div className="mt-[8vh] w-full flex flex-col gap-1">
        {menuItems?.map((menuItem, index) => (
          <Link
            className={`flex text-gray-700 flex-row items-center gap-2 text-2xl py-2 relative w-full px-[2vw] ${
              location === menuItem?.link && "text-red-600 bg-red-50"
            }`}
            key={index}
            href={menuItem?.link}
          >
            {location === menuItem?.link && (
              <div className="h-full w-2 rounded-r-[20px] absolute left-0 top-0 bg-red-600"></div>
            )}
            <div className="flex mt-[-3px]">
            {menuItem?.icon}
            </div>
            <span className="text-[1.1rem]">{menuItem?.title}</span>
          </Link>
        ))}
      </div>
      <div className="flex flex-col absolute bottom-4 w-full items-center justify-center gap-1 text-xs text-gray-700">
        <span className="text-[9px]">Powered by</span>
        <Image
          src={"/logo.svg"}
          alt=""
          width={1000}
          height={1000}
          className="w-[6rem]"
        />
      </div>
    </div>
  );
}
