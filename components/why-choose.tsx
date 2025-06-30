import React from 'react';
import Image from 'next/image';

// Types
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  backgroundColor: string;
}

// Features data
const features = [
  {
    icon: '/images/briefcase.svg',
    title: 'Direct lending decisions, no red tape',
    description: 'Make faster, more flexible lending decisions with our in-house team, avoiding red tape or delays.',
    backgroundColor: 'bg-accent'
  },
  {
    icon: '/images/trusted.svg',
    title: 'Trusted Partnership',
    description: 'Count on us as your reliable funding partner to help you achieve your goals.',
    backgroundColor: 'bg-gray-200'
  },
  {
    icon: '/images/clock.svg',
    title: 'Fast Approvals',
    description: 'Get your projects moving quickly with approvals that meet your timeline.',
    backgroundColor: 'bg-warning'
  },
  {
    icon: '/images/user.svg',
    title: 'Personalized Service',
    description: 'Our dedicated team works alongside you to provide a personal touch at every step.',
    backgroundColor: 'bg-info'
  }
];

// Components
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, backgroundColor }) => {
  return (
    <div className={`${backgroundColor} rounded-2xl p-8 hover:scale-105 transition-transform duration-300 w-[500px]`}>
      {/* Icon */}
      <div className="mb-6">
        <Image 
          src={icon}
          alt={`${title} icon`}
          width={40}
          height={40}
          className="w-10 h-10"
        />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-neutral mb-4 leading-tight">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default function WhyChooseUs() {
  return (
    <section className="py-20  mx-auto bg-gray-50">
      <div className="max-w-8xl mx-auto px-6">
        <div className="flex flex-col">
          {/* Header Section */}
          <div className="mb-12">
            <p className="text-primary font-semibold text-lg mb-4 tracking-wide uppercase">
              WHY CHOOSE US?
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral mb-6 leading-tight">
              We`re more than a lender. We`re your trusted partner.
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-4xl">
              At Nworie Capital, we`re dedicated to helping you succeed. With flexible funding options, fast approvals, and a personal touch, we make sure your investment goals are met every time.
            </p>
          </div>

          {/* Main Content Section */}
          <div className="flex flex-col lg:flex-row gap-16 mx-auto" >
            {/* Left Side - Feature Cards */}
            <div className="flex">
              <div className="flex flex-col gap-6">
                {features.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    backgroundColor={feature.backgroundColor}
                  />
                ))}
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="">
              <div className="rounded-3xl ">
                <Image 
                  src="/images/why-choose.svg"
                  alt="Team collaboration at Nworie Capital"
                  width={605}
                  height={700}
                  className=" "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}