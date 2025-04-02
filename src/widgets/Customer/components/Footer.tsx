import Image from "next/image";
import Link from "next/link";
import React from "react";
interface HeaderProps {
  storeData: {
    name: string;
    logoUrl?: string; // Make it optional to prevent errors
    primaryColor: string;
  };
}
export default function FooterCustomer({ storeData }: HeaderProps) {
  return (
    <div className="dynamicBgDark mt-[5vh] px-[5vw] py-[2vh] w-full text-white">
      <div className="flex items-center justify-between w-full">
        <div className="flex">
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
        <div className="flex items-start justify-start flex-col gap-5 pt-[5vh] text-white">
          <div className="">Contact Info</div>
          <div className="flex flex-col">
            <span className="">7907247909</span>
            <span className="">milkymist@gmail.com</span>
          </div>
        </div>
      </div>
      <div className="w-full h-[1px] bg-white bg-opacity-50 my-[3vh]"></div>
      <div className="flex flex-row items-center justify-center text-xs w-full">
        {/* <div className="flex items-center gap-2">
          <span className="">Privacy Policy</span>
          <span className="">Refund Policy</span>
        </div> */}
        <div className="flex w-full items-center justify-center">
          <span className="">@ 2025, Made with
          EasyStore</span>
        </div>
      </div>
    </div>
  );
}
