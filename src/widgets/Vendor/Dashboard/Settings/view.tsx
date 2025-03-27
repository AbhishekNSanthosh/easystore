"use client";
import React, { useState } from "react";
import { SketchPicker } from "react-color";

export default function Settings() {
  const [color, setColor] = useState("#1F75FE");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [bannerImages, setBannerImages] = useState<string[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const newImages = files.map((file) => URL.createObjectURL(file));
      setBannerImages([...bannerImages, ...newImages]);
    }
  };

  return (
    <div className="p-6">
      {/* Change Theme Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Change Theme</h2>
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="flex items-center gap-3 border border-dashed rounded-lg py-2 px-4 text-gray-700"
          >
            <span>Current Theme:</span>
            <div
              className="h-6 w-6 rounded-full border"
              style={{ backgroundColor: color }}
            ></div>
          </button>

          {showColorPicker && (
            <div className="absolute top-full left-0 z-50 mt-2">
              <SketchPicker
                color={color}
                onChangeComplete={(newColor) => setColor(newColor.hex)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Add Banner Images Section */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Add Banner Images</h2>
        <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer flex flex-col items-center">
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
          <span className="text-gray-500">Click or Drag & Drop to Upload Banners</span>
        </label>

        {/* Preview Uploaded Banners */}
        {bannerImages.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            {bannerImages.map((image, index) => (
              <img key={index} src={image} alt={`Banner ${index}`} className="w-full h-32 object-cover rounded-lg" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
