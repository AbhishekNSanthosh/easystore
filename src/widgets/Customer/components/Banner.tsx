"use client";
import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Banner() {
  const images = ["/banner.png", "/banner2.png", "/banner1.png"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Auto-scroll every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full px-[5vw] overflow-hidden pb-[2vh]">
      {/* Carousel Container */}
      <div className="relative flex items-center justify-center">
        {/* Image Slider */}
        <div className="w-full h-[80vh] rounded-lg overflow-hidden">
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-700 ease-in-out"
          />
        </div>

        {/* Left Button */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-50 hover:opacity-100 transition"
        >
          <FaChevronLeft size={20} />
        </button>

        {/* Right Button */}
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-50 hover:opacity-100 transition"
        >
          <FaChevronRight size={20} />
        </button>

        {/* Dots Navigation */}
        <div className="absolute bottom-3 flex gap-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
