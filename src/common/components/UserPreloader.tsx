import Image from "next/image";
import React from "react";

export default function UserPreLoader() {
  return (
    <div className="fixed inset-0 z-[1000] bg-white flex items-center justify-center">
      <div className="">
        <div className="flex items-center justify-center flex-col gap-3 px-5vw">
          <div className="flex flex-col justify-center items-center">
            {/* <Image
              src={"/logo.svg"}
              width={1000}
              height={1000}
              className="object-cover w-[10rem]"
              alt="Carmel College of Engineering & Technology Logo"
            /> */}
            Loading...
          </div>
          <span className="loader"></span>
        </div>
      </div>
    </div>
  );
}
