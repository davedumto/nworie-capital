'use client'
import React, { useState } from 'react';

// Types
interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactSection() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-8xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Side - Contact Info */}
          <div>
            <div className="mb-8">
              <p className="text-primary font-semibold text-lg mb-4 tracking-wide uppercase">
                CONTACT US
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-neutral mb-6 leading-tight">
                Still have questions? Contact Us
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Our team is here to help. Send us your questions, feedback, or complaints using the form, or reach us through any of our contact details.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <div>
                <a 
                  href="tel:(210)503-0505" 
                  className="text-xl text-gray-700 hover:text-primary transition-colors duration-200"
                >
                  (210) 503-0505
                </a>
              </div>
              
              <div>
                <a 
                  href="mailto:Info@Nworiecapital.Com" 
                  className="text-xl text-gray-700 hover:text-primary transition-colors duration-200"
                >
                  Info@Nworiecapital.Com
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="space-y-6">
              
              {/* Name Field */}
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 placeholder-gray-500"
                />
              </div>

              {/* Email Field */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 placeholder-gray-500"
                />
              </div>

              {/* Phone Field */}
              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 placeholder-gray-500"
                />
              </div>

              {/* Message Field */}
              <div>
                <textarea
                  name="message"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 placeholder-gray-500 resize-vertical"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full bg-primary hover:bg-primary-600 text-white font-semibold py-4 px-6 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}