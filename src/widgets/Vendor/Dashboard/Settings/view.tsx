"use client";
import easyToast from "@components/EasyToast";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { SketchPicker } from "react-color";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../../common/config/firebaseConfig";

export default function Settings() {
  const [color, setColor] = useState("#1F75FE");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [bannerImages, setBannerImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const subdomain = Cookies.get("subdomain");

  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files);
    const newFiles = files.filter(
      (file) => !selectedImages.some((img) => img.name === file.name)
    );

    if (newFiles.length === 0) {
      easyToast({ message: "Image already selected!", type: "info" });
      return;
    }

    setSelectedImages((prev) => [...prev, ...newFiles]);
  };

  const handleImageUpload = async () => {
    if (selectedImages.length === 0) {
      easyToast({ message: "No images selected!", type: "info" });
      return;
    }
    setUploading(true);

    try {
      const uploadedUrls = await Promise.all(
        selectedImages.map(async (file) => {
          const storageRef = ref(storage, `banners/${subdomain}/${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          return new Promise<string>((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress((prev) => ({
                  ...prev,
                  [file.name]: progress,
                }));
              },
              (error) => {
                console.error("Upload error:", error);
                reject(error);
              },
              async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadURL);
              }
            );
          });
        })
      );

      setBannerImages((prev) => [...prev, ...uploadedUrls]);
      setSelectedImages([]); // Clear selection after upload
      setUploadProgress({});
      easyToast({ message: "Images uploaded successfully!", type: "success" });

      await handleUpdateBanners(uploadedUrls);
    } catch (error) {
      console.error("Error uploading images:", error);
      easyToast({ message: "Image upload failed!", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  const hexToRGB = (hex: string) => {
    let r = 0,
      g = 0,
      b = 0;

    if (hex.length === 7) {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    }

    return `${r}, ${g}, ${b}`;
  };

  const handleUpdateBanners = async (uploadedUrls: string[]) => {
    if (!subdomain) {
      alert("Subdomain not found!");
      return;
    }

    try {
      const response = await fetch("/api/v1/vendor/updateBanner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subdomain, bannerImgs: uploadedUrls }),
      });

      const data = await response.json();
      if (data.success) {
        easyToast({ message: "Banners updated successfully!", type: "success" });
      } else {
        easyToast({ message: "Failed to update banners!", type: "error" });
      }
    } catch (error) {
      console.error("Error updating banners:", error);
      alert("An error occurred while updating banners.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateTheme = async () => {
    if (!subdomain) {
      alert("Subdomain not found!");
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch("/api/v1/vendor/updateTheme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subdomain, primaryColor: color }),
      });

      const data = await response.json();
      if (data.success) {
        easyToast({ message: "Theme updated successfully", type: "success" });
        document.documentElement.style.setProperty("--primary-color", color);
        document.documentElement.style.setProperty(
          "--primary-rgb",
          hexToRGB(data.store.primaryColor)
        );
      } else {
        easyToast({ message: "Failed to update", type: "error" });
      }
    } catch (error) {
      console.error("Error updating theme:", error);
      alert("An error occurred while updating the theme.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6">
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
            <div className="absolute z-50 mt-2 shadow-lg bg-white p-2 rounded-lg">
              <SketchPicker
                color={color}
                onChangeComplete={(newColor) => setColor(newColor.hex)}
              />
            </div>
          )}

          <button
            onClick={handleUpdateTheme}
            className="ml-4 dynamicBgDark text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={uploading}
          >
            {uploading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Add Banner Images</h2>
        <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageSelection}
          />
          <span className="text-gray-500">Click or Drag & Drop to Select Images</span>
        </label>

        {selectedImages.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Selected Images</h3>
            <div className="grid grid-cols-3 gap-3">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Selected ${index}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  {/* {uploading && (
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-300 rounded-b-lg overflow-hidden">
                      <div
                        className="h-full dynamicBgDark transition-all duration-200 ease-in-out"
                        style={{ width: `${uploadProgress[image.name] || 0}%` }}
                      />
                    </div>
                  )} */}
                </div>
              ))}
            </div>
            <button
  onClick={handleImageUpload}
  className="mt-4 dynamicBgDark text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
  disabled={uploading}
>
  {uploading
    ? `Uploading ${Math.round(
        Object.values(uploadProgress).reduce((a, b) => a + b, 0) / selectedImages.length || 0
      )}%...`
    : "Upload"}
</button>
          </div>
        )}

        {bannerImages.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Uploaded Images</h3>
            <div className="grid grid-cols-3 gap-3">
              {bannerImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Banner ${index}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
