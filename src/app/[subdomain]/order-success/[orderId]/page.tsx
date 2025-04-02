
"use client"
import { useParams, useRouter } from "next/navigation";

export default function OrderSuccessPage() {
  const router = useRouter();
  const { orderId } = useParams()

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50">
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 className="text-2xl font-semibold text-green-600 mb-4">Order Placed Successfully!</h1>
      <p className="text-xl text-gray-700 mb-6">Your order ID: <span className="font-semibold text-blue-600">{orderId}</span></p>
      
      <div className="flex justify-center mb-6">
        <button
          onClick={() => router.push("/")}
          className="dynamicBgDark text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          Go to Home
        </button>
      </div>

      <div className="text-center">
        <p className="text-gray-500 text-sm">Thank you for shopping with us!</p>
      </div>
    </div>
  </div>
  );
}
