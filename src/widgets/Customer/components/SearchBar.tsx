import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

export default function SearchBar({
  setSearchQuery,
}: {
  setSearchQuery: (query: string) => void;
}) {
  const [inputValue, setInputValue] = useState("");

  // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter") {
  //     setSearchQuery(inputValue);
  //   }
  // };

  return (
    <div className="py-[2vh] w-full px-[5vw] flex items-center justify-center gap-10">
      {/* Search Box */}
      <div className="flex justify-center">
        <div className="relative w-[400px]">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setInputValue(e.target.value);
            }}
            // onKeyDown={handleKeyDown}
            placeholder="Search for cakes..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-100 shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}
