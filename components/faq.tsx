'use client'
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

// Types
interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

// FAQ data
const faqData = [
  {
    question: "What documents are required for Pre-approval?",
    answer: "For pre-approval, you'll typically need proof of income, bank statements, credit report, identification documents, and details about the property you're interested in. Our team will provide you with a complete checklist based on your specific situation and loan program."
  },
  {
    question: "What types of properties do you lend on?",
    answer: "We provide funding for various property types including residential fix-and-flip projects, rental properties, commercial real estate, land acquisition, new construction, and multi-family developments. Each property type has specific requirements and terms."
  },
  {
    question: "Can first-time investors qualify for a loan?",
    answer: "Yes! We work with first-time investors and provide guidance throughout the process. While experience is valuable, we evaluate each application based on multiple factors including creditworthiness, financial capacity, and the strength of the deal."
  },
  {
    question: "How long does it take to close on a loan?",
    answer: "Our typical closing timeline ranges from 7-14 business days for most loan programs. The exact timeframe depends on the complexity of the deal, property type, and how quickly all required documentation is provided. We pride ourselves on fast, efficient closings."
  },
  {
    question: "Do you provide funding for renovations or new construction?",
    answer: "Absolutely! We offer specialized loan programs for both renovations and new construction projects. These include fix-and-flip loans, construction-to-permanent loans, and renovation financing with funds released in stages based on project milestones."
  }
];

// Components
const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
      >
        <span className="text-lg font-medium text-neutral pr-4">
          {question}
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      
      {/* Dropdown Content */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-5 pt-2">
          <p className="text-gray-600 leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-8xl mx-auto px-[2em]">
        {/* Header */}
        <div className="text-left mb-12">
          <p className="text-primary font-semibold text-lg mb-4 tracking-wide uppercase">
            FAQS
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral mb-6 leading-tight">
            Got Questions? We`ve got Answers
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed mx-auto">
            Find quick answers to your most common questions about Nworie Capital`s lending programs and services.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}