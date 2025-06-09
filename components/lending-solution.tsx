import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

// Types
interface LoanCardProps {
  icon: string;
  title: string;
  description: string;
  features: string[];
  link: string;
}

// Loan data
const loanPrograms = [
  {
    icon: '/images/houses.svg',
    title: 'Residential Loans',
    description: 'Flexible funding for non-owner occupied properties, including fix-n-flip, new construction, rentals, and more.',
    features: [
      'No monthly payments required on fix-n-flip loans.'
    ],
    link: '#'
  },
  {
    icon: '/images/bank.svg',
    title: 'Commercial Loans',
    description: 'Private lending for land acquisition, construction, and multi-family development projects.',
    features: [
      'No LLC or tax returns needed.'
    ],
    link: '#'
  },
  {
    icon: '/images/bag.svg',
    title: 'Business Loans',
    description: 'Smart funding solutions for growing businesses, from working capital to equipment financing.',
    features: [
      'Minimum 6 months in business and $10k monthly revenue.'
    ],
    link: '#'
  }
];

// Components
const LoanCard: React.FC<LoanCardProps> = ({ icon, title, description, features, link }) => {
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group">
      {/* Icon */}
      <div className="w-16 h-16  rounded-2xl flex items-center justify-center mb-6  transition-colors duration-300">
        <Image 
          src={icon}
          alt={`${title} icon`}
          width={40}
          height={40}
          className="w-15 h-15"
        />
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-neutral mb-4 group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 mb-4 leading-relaxed">
        {description}
      </p>

      {/* Features */}
      <div className="mb-6">
        {features.map((feature, index) => (
          <p key={index} className="text-gray-600 text-sm">
            {feature}
          </p>
        ))}
      </div>

      {/* Learn More Link */}
      <a 
        href={link}
        className="inline-flex items-center text-secondary font-medium hover:text-secondary-600 transition-colors duration-200 group/link"
      >
        Learn More
        <ArrowRight 
          size={16} 
          className="ml-2 group-hover/link:translate-x-1 transition-transform duration-200" 
        />
      </a>
    </div>
  );
};

export default function LendingSolutions() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-8xl mx-auto px-6">
        {/* Header */}
        <div className="text-left mb-16 md:w-[696px] pl-[3em]">
          <p className="text-primary mb-4 ">
            FIND THE RIGHT LOAN FOR YOU
          </p>
          <h2 className=" text-neutral mb-6 leading-tight text-[40px] font-bold">
            Tailored Lending Solutions for Every Investment Strategy
          </h2>
          <p className="text-[20px] text-gray-500 ">
            From fix-n-flip and long-term rentals to new construction and small business growth, <span className='text-primary'>Nworie Capital </span> provides flexible funding to support your next investment. No matter your project, we have the right loan program for you.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:px-[3em]">
          {loanPrograms.map((program, index) => (
            <LoanCard
              key={index}
              icon={program.icon}
              title={program.title}
              description={program.description}
              features={program.features}
              link={program.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
}