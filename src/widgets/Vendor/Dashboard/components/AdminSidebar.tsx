"use client";
import Image from "next/image";
import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import Link from "next/link";
import { IoMdSettings } from "react-icons/io";
import { usePathname } from "next/navigation";
import { SketchPicker } from "react-color";
import CustomButton from "@components/Button";

export default function AdminSidebar() {
  const [color, setColor] = useState("#1F75FE");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const location = usePathname();
  const menuItems = [
    {
      title: "Home",
      link: "/dashboard/home",
      icon: <FaHome className="text-[22px]" />,
    },
    {
      title: "Settings",
      link: "/dashboard/settings",
      icon: <IoMdSettings className="text-[22px]" />,
    },
  ];

  const changeColor = () => {
    document.documentElement.style.setProperty("--primary-color", color);
  };
  
  return (
    <div className="w-[15vw] fixed left-0 bg-white h-full flex-col flex py-2">
      <div className="w-full items-center justify-center flex mt-[2vh]">
        <span className="font-semibold text-3xl text-dashcolor-500">
          myntra
        </span>
      </div>
      <div className="mt-[8vh] w-full flex flex-col gap-1">
        {menuItems?.map((menuItem, index) => (
          <Link
            className={`flex text-gray-700 flex-row items-center gap-2 text-2xl py-2 relative w-full px-[2vw] ${
              location === menuItem?.link &&
              "text-red-600 bg-red-50 bg-opacity-90"
            }`}
            key={index}
            href={menuItem?.link}
          >
            {location === menuItem?.link && (
              <div className="h-full w-2 rounded-r-[20px] absolute left-0 top-0 bg-red-600"></div>
            )}
            <div className="flex mt-[-3px]">{menuItem?.icon}</div>
            <span className="text-[1.1rem]">{menuItem?.title}</span>
          </Link>
        ))}
      </div>
      <div className="relative mt-5 px-[1vw]">
        <button
          onClick={() => {
            setShowColorPicker(!showColorPicker);
          }}
          className="flex items-center justify-center gap-3 w-full border border-dashcolor-500 rounded-[15px] py-2 text-gray-700"
        >
          {" "}
          Select theme:{" "}
          <div
            className="h-[20px] w-[20px] rounded-full border"
            style={{ backgroundColor: color }}
          ></div>
        </button>
        <button className="" onClick={changeColor}>change</button>

        {showColorPicker && (
          <div className="absolute top-full z-[100] pt-[10px]">
            <SketchPicker
              color={color}
              onChangeComplete={(newColor) => {
                setColor(newColor.hex);
                console.log(newColor.hex);
              }}
            /> 
          </div>
        )}
      </div>
      <div className="px-[1vw] mt-5 absolute bottom-[10vh] w-full">
        <CustomButton className="bg-red-50 py-2 rounded-[15px]  z-[50] text-red-600 w-full" label="Logout" color="secondary"/>
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
