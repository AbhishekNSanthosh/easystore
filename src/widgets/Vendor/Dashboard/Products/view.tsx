"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"; // Ensure Firebase is initialized
import { IoGridOutline } from "react-icons/io5";
import { CiBoxList } from "react-icons/ci";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import Image from "next/image";
import { storage } from "../../../../common/config/firebaseConfig";
import { useSession } from "next-auth/react";
import Cookies from "js-cookie";

interface Product {
  _id: string;
  title: string;
  imgUrl: string;
  price: number;
  oldPrice: number;
  available: boolean;
}

export default function Products() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<Product[]>([]);
  const [subdomain, setSubdomain] = useState(Cookies.get("subdomain") || ""); // Get subdomain from cookies

  const { data: session } = useSession();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    title: "",
    price: 0,
    oldPrice: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: name.includes("Price") ? Number(value) : value,
    }));
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    const file = acceptedFiles[0];
    console.log("File received:", file);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);
  

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
  });

  const uploadImageAndSubmit = async () => {
    if (!imageFile) {
      alert("Please upload an image.");
      return;
    }

    const storageRef = ref(storage, `products/${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        submitProduct(downloadURL);
      }
    );
  };

  const submitProduct = async (imageURL: string) => {
    try {
      const productData = {
        title: newProduct.title,
        price: newProduct.price,
        oldPrice: newProduct.oldPrice,
        imgUrl: imageURL,
        available: true,
        ownedBy: subdomain,
      };

      const response = await fetch("/api/v1/vendor/createNewProduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const addedProduct = await response.json();
        console.log(addedProduct.product);
        setProducts((prev) => [
          ...prev,
          { id: prev.length + 1, ...addedProduct?.product },
        ]);
        setIsModalOpen(false);
        setNewProduct({
          title: addedProduct?.product?.title,
          price: addedProduct?.product?.price,
          oldPrice: addedProduct?.product?.oldPrice,
          imgUrl: addedProduct?.product?.imgUrl,
        });
        setImagePreview(null);
        setUploadProgress(null);
      } else {
        console.error("Failed to add product");
      }
    } catch (error) {
      console.log(error);
    }
  };
console.log(subdomain)
  const getProductList = async () => {
    try {
      const productData = {
        subdomain,
      };
  
      const res = await fetch("/api/v1/vendor/getProductList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData), // Wrap subdomain inside an object
      });
  
      console.log(res);
  
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
  
      const data = await res.json();
      console.log(data?.products);
      setProducts(data?.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  

  useEffect(() => {
    getProductList();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Cakes</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setView("grid")}
            className={`px-3 py-1 border rounded ${
              view === "grid"
                ? "dynamicBgDark text-white dynamicBorder"
                : "bg-white dynamicBorder dynamicTextColor"
            }`}
          >
            <IoGridOutline className="text-xl" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1 border rounded ${
              view === "list"
                ? "dynamicBgDark text-white dynamicBorder"
                : "bg-white dynamicBorder dynamicTextColor"
            }`}
          >
            <CiBoxList className="text-xl" />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="dynamicBorder bg-white dynamicTextColor px-4 flex items-center justify-center gap-2 py-2 rounded"
          >
            Add Product <MdOutlineAddCircleOutline className="text-xl" />
          </button>
        </div>
      </div>

      <div
        className={
          view === "grid" ? "grid grid-cols-3 gap-4" : "flex flex-col gap-4"
        }
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="border p-4 rounded flex gap-4 bg-white"
          >
            <img
              src={product.imgUrl}
              alt={product.title}
              className="w-24 h-24 object-cover rounded"
            />
            <div>
              <h3 className="font-semibold">{product.title}</h3>
              <p className="text-gray-500">
                <span className="line-through text-red-500">
                  ₹{product.price}
                </span>{" "}
                ₹{product.oldPrice}
              </p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="absolute inset-0 backdrop-blur-md bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[30rem] flex flex-col relative items-center justify-center">
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-600 absolute right-7"
            >
              <AiOutlineClose className="text-2xl" />
            </button>

            <h2 className="text-xl font-semibold dynamicTextColor">
              Add Product
            </h2>

            <div
              {...getRootProps()}
              className="w-full h-[20vh] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer flex flex-col items-center justify-center p-6 bg-white"
            >
              <input {...getInputProps()} />
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={120}
                  height={120}
                  className="rounded shadow-lg"
                />
              ) : (
                <span className="text-gray-500 text-center">
                  Drag & Drop or Click to Upload Image
                </span>
              )}
            </div>

            {uploadProgress !== null && (
              <p className="mt-2 text-sm text-blue-500">
                Uploading: {uploadProgress}%
              </p>
            )}

            <input
              type="text"
              name="title"
              value={newProduct.title}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-md mt-4 dynamicOutline"
              placeholder="Product Name"
            />
            <input
              type="number"
              name="price"
              value={newProduct.price || ""}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-md mt-4 dynamicOutline"
              placeholder="Actual Price"
            />
            <input
              type="number"
              name="oldPrice"
              value={newProduct.oldPrice || ""}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-md mt-4 dynamicOutline"
              placeholder="Offer Price"
            />

            <button
              onClick={uploadImageAndSubmit}
              className="mt-4 bg-blue-600 text-white w-full py-2 rounded-md dynamicBgDark"
            >
              Add Product
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
