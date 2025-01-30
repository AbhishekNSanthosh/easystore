import React from "react";
import { IoMdArrowRoundUp } from "react-icons/io";

const ScrollToTopButton: React.FC = () => {
  // Function to scroll to the top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling effect
    });
  };

  return (
    <button
      className="absolute right-[40px] top-[0px] rounded-full border-2 border-gray-400 p-3 shadow-md bg-white hover:bg-gray-100 transition-all duration-300"
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <IoMdArrowRoundUp className="text-3xl text-gray-700" />
    </button>
  );
};

export default ScrollToTopButton;
