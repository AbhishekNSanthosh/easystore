"use client";
import CustomLink from "@components/Link";
import Image from "next/image";
import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../common/config/firebaseConfig";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function OnboardingContent() {
  const [shopName, setShopName] = useState("");
  const [subdomain, setSubdomain] = useState(""); // New field for subdomain
  const [shopLogo, setShopLogo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#1F75FE"); // Default Color
  const { vendorId } = useParams();
  const router = useRouter()

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setShopLogo(file);
      setPreview(URL.createObjectURL(file)); // Set preview URL
    }
  };

  const handleContinue = async () => {
    if (!shopLogo) return alert("Please upload a shop logo first!");
    if (!subdomain) return alert("Please enter a subdomain!");

    const storageRef = ref(storage, `logos/${shopLogo.name}`);
    const uploadTask = uploadBytesResumable(storageRef, shopLogo);

    setUploading(true);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progressPercentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progressPercentage);
      },
      (error) => {
        console.error("Upload failed:", error);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setUploadedUrl(downloadURL);
        setUploading(false);

        // Call API to store shop details
        saveShopDetails(downloadURL);
      }
    );
  };

  const saveShopDetails = async (logoUrl: string) => {
    try {
      const response = await fetch("/api/v1/vendor/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeName: shopName, subdomain, logoUrl, primaryColor, vendorId }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Shop created successfully!");
        router.push('/dashboard/home')
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error saving shop:", error);
    }
  };

  return (
    <div className="px-[5vw] flex flex-col h-screen bg-gray-50">
      {/* Header Section */}
      <div className="flex items-center justify-between pt-[2rem]">
        <CustomLink href={"/"}>
          <Image
            src={"/logo.svg"}
            alt="Logo"
            width={1000}
            height={1000}
            className="w-[10rem]"
          />
        </CustomLink>
        <div>
          <span>
            Facing Issues?{" "}
            <CustomLink className="text-primary font-semibold" href={""}>
              Contact
            </CustomLink>
          </span>
        </div>
      </div>

      {/* Onboarding Form */}
      <div className="flex flex-col items-center justify-center flex-grow space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Setup Your Shop</h2>

        {/* Shop Name Input */}
        <input
          type="text"
          placeholder="Enter your shop name"
          className="w-full max-w-md p-3 border rounded-lg focus:outline-primary"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
        />

        {/* Subdomain Input */}
        <div className="w-full max-w-md flex items-center border rounded-lg p-3">
          <input
            type="text"
            placeholder="Enter subdomain"
            className="flex-1 outline-none"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)}
          />
          <span className="ml-2 text-gray-600">.easystore.in</span>
        </div>

        {/* Drag and Drop Logo Upload */}
        <label className="w-full max-w-md p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white flex flex-col items-center">
          <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
          {preview ? (
            <Image
              src={preview}
              alt="Shop Logo"
              width={120}
              height={120}
              className="rounded-full shadow-lg"
            />
          ) : (
            <span className="text-gray-500">Drag & Drop or Click to Upload Logo</span>
          )}
        </label>

        {/* Color Picker */}
        <div className="flex items-center space-x-4">
          <label className="text-gray-700 font-semibold">Choose Primary Color:</label>
          <input
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer"
          />
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-primary h-2.5 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleContinue}
          className="w-full max-w-md p-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          disabled={uploading}
        >
          {uploading ? `Uploading ${Math.round(progress)}%...` : "Continue"}
        </button>

        {/* Uploaded Image URL */}
        {uploadedUrl && (
          <p className="text-sm text-green-600 mt-2">✅ Logo Uploaded Successfully!</p>
        )}
      </div>
    </div>
  );
}
