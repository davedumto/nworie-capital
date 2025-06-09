import React from 'react';

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero.svg')",
        }}
      >
       
      </div>

      {/* Content */}
      <div className="relative z-5  w-[688px] ml-[5em]">
        <div className="">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-[40px]  font-semi-bold text-white leading-tight mb-6 text-left">
            Private Money Lending for Real Estate and Businesses Nationwide
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-white mb-8 leading-relaxed opacity-90 text-left">
            Flexible private lending for real estate and business. No monthly payments on select programs. Fast approvals nationwide.
          </p>

          {/* CTA Button */}
          <div className="text-left">
            <button className="bg-white text-blue-950 hover:bg-primary hover:text-white px-15 py-4 rounded-full text-lg  transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Optional: Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white opacity-70">
        <div className="animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}