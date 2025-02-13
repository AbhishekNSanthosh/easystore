import Image from "next/image";
import React from "react";

export default function AdminSidebar() {
  return (
    <div className="w-[15vw] fixed left-0 bg-white h-full py-2">
      <div className="w-full items-center justify-center flex mt-[2vh]">
        <span className="font-semibold text-3xl text-dashcolor-500">myntra</span>
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
