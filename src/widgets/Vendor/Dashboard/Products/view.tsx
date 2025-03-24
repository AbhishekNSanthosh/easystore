"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Cropper from "react-easy-crop";
import { CiBoxList } from "react-icons/ci";
import { IoGridOutline } from "react-icons/io5";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import Image from "next/image";

interface Product {
  id: number;
  title: string;
  image: string;
  actualPrice: number;
  offerPrice: number;
  available: boolean;
}

export default function Products() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      title: "Chocolate Cake",
      image: "/cake.jpg",
      actualPrice: 500,
      offerPrice: 450,
      available: true,
    },
    {
      id: 2,
      title: "Vanilla Delight",
      image: "/cake.jpg",
      actualPrice: 400,
      offerPrice: 350,
      available: false,
    },
    {
      id: 3,
      title: "Strawberry Bliss",
      image: "/cake.jpg",
      actualPrice: 600,
      offerPrice: 550,
      available: true,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    title: "",
    actualPrice: 0,
    offerPrice: 0,
  });
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const toggleAvailability = (id: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? { ...product, available: !product.available }
          : product
      )
    );
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: name.includes("Price") ? Number(value) : value,
    }));
  };

  const handleAddProduct = () => {
    if (
      !newProduct.title ||
      !imageSrc ||
      !newProduct.actualPrice ||
      !newProduct.offerPrice
    ) {
      alert("Please fill all fields.");
      return;
    }
    setProducts((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        available: true,
        image: imageSrc,
        ...newProduct,
      } as Product,
    ]);
    setIsModalOpen(false);
    setNewProduct({ title: "", actualPrice: 0, offerPrice: 0 });
    setImageSrc(null);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Cakes</h2>
        <div className="flex gap-2">
          {/* Toggle View Buttons */}
          <button
            onClick={() => setView("grid")}
            className={`px-3 py-1 border rounded ${view === "grid" ? "dynamicBgDark text-white dynamicBorder" : "bg-white dynamicBorder dynamicTextColor"}`}
          >
            <IoGridOutline className="text-xl" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1 border rounded ${view === "list" ? "dynamicBgDark text-white dynamicBorder" : "bg-white dynamicBorder dynamicTextColor"}`}
          >
            <CiBoxList className="text-xl" />
          </button>

          {/* Add Product Button */}
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
            key={product.id}
            className="border p-4 rounded flex gap-4 bg-white"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-24 h-24 object-cover rounded"
            />
            <div>
              <h3 className="font-semibold">{product.title}</h3>
              <p className="text-gray-500">
                <span className="line-through text-red-500">
                  ₹{product.actualPrice}
                </span>{" "}
                ₹{product.offerPrice}
              </p>
              <button
                onClick={() => toggleAvailability(product.id)}
                className={`mt-2 px-3 py-1 text-sm rounded ${
                  product.available
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {product.available ? "Available" : "Unavailable"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="absolute inset-0 backdrop-blur-md bg-opacity-40 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg w-[30rem] flex flex-col relative items-center justify-center">
          <div className="flex justify-between items-center mb-4 ">
            <h2 className="text-xl font-semibold dynamicTextColor">Add Product</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-600 absolute right-7"
            >
              <AiOutlineClose className="text-2xl" />
            </button>
          </div>
      
          <label className="w-full max-w-lg h-[20vh] justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white flex flex-col items-center">
            <input type="file" accept="image/*" className="hidden" />
            {preview ? (
              <Image
                src={preview}
                alt="Shop Logo"
                width={120}
                height={120}
                className="rounded-full shadow-lg"
              />
            ) : (
              <span className="text-gray-500 text-center">
                Drag & Drop or Click to Upload Logo
              </span>
            )}
          </label>
      
          {/* Product Name */}
          <input
            type="text"
            name="title"
            value={newProduct.title}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-md mt-4 dynamicOutline"
            placeholder="Product Name"
          />
      
          {/* Old Price */}
          <input
            type="number"
            name="oldPrice"
            // value={newProduct.oldPrice}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-md mt-4 dynamicOutline"
            placeholder="Old Price"
          />
      
          {/* New Price */}
          <input
            type="number"
            name="newPrice"
            // value={newProduct.newPrice}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-md mt-4 dynamicOutline"
            placeholder="New Price"
          />
      
          <button
            onClick={handleAddProduct}
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
