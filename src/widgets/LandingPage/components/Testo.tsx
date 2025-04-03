'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const testimonials = [
  {
    quote: 'Variant main figma ipsum component layer. Export community move stroke style bullet line.',
    name: 'Sarah Lee',
    store: 'Artisan Alley',
    image: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    quote: 'Figma ipsum component variant main layer. Community move stroke export style bullet line.',
    name: 'Derik Stephen',
    store: 'Artisans Nook',
    image: 'https://randomuser.me/api/portraits/men/2.jpg'
  },
  {
    quote: 'Design prototype selection. Figjam ipsum component flows export community libraries team.',
    name: 'Emma Johnson',
    store: 'Craft Corner',
    image: 'https://randomuser.me/api/portraits/women/3.jpg'
  }
];

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);

  const prevTestimonial = () => {
    setIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };

  const nextTestimonial = () => {
    setIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="bg-gray-100 py-10 px-5">
      <h2 className="text-center text-2xl font-semibold text-green-900 mb-6">People who sell with us.</h2>
      <div className="flex items-center justify-center space-x-4">
        <button onClick={prevTestimonial} className="text-green-800 hover:text-green-600">
          <ChevronLeftIcon size={24} />
        </button>
        <div className="flex space-x-6 overflow-hidden">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className={`p-6 bg-white rounded-lg shadow-md w-80 transition-opacity ${i === index ? 'opacity-100' : 'opacity-50'}`}
            >
              <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              <div className="flex items-center mt-4">
                <img src={testimonial.image} alt={testimonial.name} className="w-10 h-10 rounded-full mr-3" />
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-green-600 text-sm">{testimonial.store}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={nextTestimonial} className="text-green-800 hover:text-green-600">
          <ChevronRightIcon size={24} />
        </button>
      </div>
    </div>
  );
}