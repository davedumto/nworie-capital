'use client'
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Types
interface TestimonialProps {
  quote: string;
  name: string;
  location: string;
  rating: number;
}

// Testimonials data
const testimonials = [
  {
    quote: "It was great working with Reggie. As a first time investor, he was patient and thorough when explaining concepts and processes required to get a deal done. He always asks 'what else can I help you with' because he never wanted me to feel like I didn't understand what was going on during my purchase. I recommend...",
    name: "Jaren K.",
    location: "MD",
    rating: 5
  },
  {
    quote: "Reggie goes above and beyond for his clients. He always makes time to answer any question. His commitment to getting his clients the best deal and his patience and willingness to guide clients through the process is unmatched. You will not be disappointed. He is my go to person now.",
    name: "Jonae M.",
    location: "MI",
    rating: 5
  },
  {
    quote: "Nworie Capital kept in contact throughout the entire process. They know what they're doing and everything went smoothly so far. Can't find any complaints, everything's going on.",
    name: "Jason G.",
    location: "TX",
    rating: 5
  },
  {
    quote: "Working with Nworie Capital was a game-changer for my business. Their flexible terms and quick approval process helped me close deals I wouldn't have been able to otherwise. Highly professional team.",
    name: "Maria L.",
    location: "CA",
    rating: 5
  },
  {
    quote: "The team at Nworie Capital made the entire lending process seamless. From application to funding, everything was handled professionally and efficiently. I highly recommend their services.",
    name: "David R.",
    location: "FL",
    rating: 5
  }
];

// Components
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex gap-1 mb-6">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className={`w-6 h-6 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const TestimonialCard: React.FC<TestimonialProps> = ({ quote, name, location, rating }) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full flex flex-col">
      {/* Quote Icon */}
      <div className="text-6xl text-gray-300 mb-4 leading-none">"</div>
      
      {/* Star Rating */}
      <StarRating rating={rating} />
      
      {/* Quote Text */}
      <p className="text-gray-700 mb-8 leading-relaxed flex-grow">
        {quote}
      </p>
      
      {/* Client Info */}
      <div className="mt-auto">
        <h4 className="font-bold text-neutral text-lg mb-1">{name}</h4>
        <p className="text-gray-500 text-sm">{location}</p>
      </div>
    </div>
  );
};

const NavigationButton: React.FC<{ 
  direction: 'left' | 'right';
  onClick: () => void;
  disabled?: boolean;
}> = ({ direction, onClick, disabled }) => {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
        direction === 'right' 
          ? 'bg-primary border-primary text-white hover:bg-primary-600' 
          : 'bg-white border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
    >
      <Icon size={20} />
    </button>
  );
};

export default function ClientTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const cardsToShow = 3; // Show 3 cards at a time
  const maxIndex = testimonials.length - cardsToShow; // 5 - 3 = 2 (positions: 0, 1, 2)

  // Auto-scroll effect for desktop
  useEffect(() => {
    const isDesktop = window.innerWidth > 1024;
    
    if (!isDesktop || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1;
        return nextIndex > maxIndex ? 0 : nextIndex;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered, maxIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-8xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-16">
          <div className="mb-8 lg:mb-0">
            <p className="text-primary font-semibold text-lg mb-4 tracking-wide uppercase">
              CLIENT STORIES
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral mb-6 leading-tight">
              Don't Take Our Word For It
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
              Hear from real clients who've trusted Nworie Capital to fuel their investments and business goals.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <NavigationButton
              direction="left"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            />
            <NavigationButton
              direction="right"
              onClick={handleNext}
              disabled={currentIndex === maxIndex}
            />
          </div>
        </div>

        {/* Testimonials Slider */}
        <div 
          className="overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div 
            className="flex gap-8 transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 33.333}%)`,
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex-shrink-0 w-1/3">
                <TestimonialCard
                  quote={testimonial.quote}
                  name={testimonial.name}
                  location={testimonial.location}
                  rating={testimonial.rating}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                currentIndex === index ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}