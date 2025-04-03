import { FaGlobe, FaEye, FaShareAlt } from "react-icons/fa";

const QuickAndEasy = () => {
  return (
    <section className="bg-gray-50 py-16 px-6 text-center">
      <h2 className="text-2xl font-semibold text-black mb-8">It’s Quick and Easy</h2>
      <div className="flex justify-center items-center gap-12 max-w-5xl mx-auto">
        {/* Step 1 */}
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="bg-gray-400 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">1</span>
          </div>
          <h3 className="text-lg font-semibold">Create Your Store</h3>
          <p className="text-gray-600 text-sm">Add your logo, brand story, and color theme to craft a truly custom store.</p>
          <div className="flex justify-center items-center gap-2 mt-4">
            <FaGlobe className="text-gray-600" />
            <span className="border rounded-lg px-2 py-1 text-sm">shopname.easystore.com</span>
          </div>
          <div className="flex justify-center gap-1 mt-3">
            {["bg-red-500", "bg-green-500", "bg-yellow-500", "bg-blue-500", "bg-brown-500", "bg-black"].map((color, index) => (
              <span key={index} className={`w-5 h-5 rounded-full border ${color}`}></span>
            ))}
          </div>
        </div>
        
        {/* Step 2 */}
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="bg-gray-400 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">2</span>
          </div>
          <h3 className="text-lg font-semibold">Add Your Products</h3>
          <p className="text-gray-600 text-sm">Add your product details, variants (color, size), quantity, and other details.</p>
          <div className="flex justify-center items-center gap-2 mt-4">
            <FaEye className="text-gray-600" />
            <span className="border rounded-lg px-2 py-1 text-sm">Product Availability</span>
          </div>
          <button className="mt-3 border px-3 py-1 rounded-lg text-sm">Add product images</button>
        </div>
        
        {/* Step 3 */}
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="bg-gray-400 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">3</span>
          </div>
          <h3 className="text-lg font-semibold">Publish Your Store</h3>
          <p className="text-gray-600 text-sm">Publish your link through your socials, start getting orders.</p>
          <div className="flex justify-center items-center gap-2 mt-4">
            <FaShareAlt className="text-gray-600" />
            <span className="border rounded-lg px-2 py-1 text-sm">Share your store</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickAndEasy;
