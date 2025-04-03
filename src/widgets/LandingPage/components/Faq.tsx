"use client"
import React, { useState } from "react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  
  const toggleFAQ = (index:any) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    { question: "How long does it take to build a store?", answer: "It usually takes a few minutes to set up a store." },
    { question: "Can I customize products and settings?", answer: "Yes, you can customize your store's products and settings." },
    { question: "What are the costs involved?", answer: "The pricing depends on the plan you choose." },
    { question: "How can WhatsApp be used?", answer: "You can integrate WhatsApp for customer support and orders." },
  ];

  return (
    <div className="flex flex-col md:flex-row justify-between items-start p-8">
      <div className="bg-orange-100 p-8 flex flex-col items-center w-full md:w-1/2">
        <div className="text-orange-600 text-6xl">💬</div>
        <p className="mt-4 text-center">Get our assistance for all your queries</p>
        <a
          href="https://wa.me/917907247909"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-orange-600 font-semibold hover:underline"
        >
          Contact support &gt;
        </a>
      </div>
      <div className="w-full md:w-1/2 mt-6 md:mt-0">
        <h2 className="text-lg font-semibold mb-4">Frequently asked questions</h2>
        {faqs.map((faq, index) => (
          <div key={index} className="border-b py-2">
            <button
              className="w-full text-left flex justify-between items-center py-2"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <span className="text-gray-500">{openIndex === index ? "▲" : "▼"}</span>
            </button>
            {openIndex === index && <p className="text-gray-600 mt-2">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;