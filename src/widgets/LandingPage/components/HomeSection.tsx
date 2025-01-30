import CustomButton from "@components/Button";
import React from "react";

export default function HomeSection() {
  return (
    <div className="h-[90vh]">
      <div className="w-full h-full flex items-center justify-center flex-col">
        <p className="text-lg text-center mb-5">Sell Smarter, Not Harder!</p>
        <div className="w-full flex flex-col items-center justify-center">
          <span className="text-[70px] font-bold text-secondary leading-tight">
            Bring Your Ideas to Life,
          </span>
          <span className="text-[70px] font-bold text-secondary">
            Sell with Ease
          </span>
        </div>
        <div className="w-[40rem] flex items-center justify-center text-justify">
          <p className="text-lg text-center">
            Create. Customize. Sell. Manage effortlessly. Your online store,
            made simple and successful.
          </p>
        </div>
        <div className="mt-5">
          <CustomButton
            className="bg-primary rounded-full capitalize text-2xl font-semibold px-7 py-3"
            label="Create your store"
          />
        </div>
        <p className="text-lg text-center mt-5">
        Start for free in under a minute—your store, your way!
          </p>
      </div>
    </div>
  );
}
