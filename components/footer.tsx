import React from 'react';
import Image from 'next/image';
import { Facebook, Instagram, MessageCircle } from 'lucide-react';
import Logo from '@/public/images/Logo.svg';

// Types
interface NavItem {
  label: string;
  href: string;
}

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

interface FooterSectionProps {
  title: string;
  links: NavItem[];
}

interface SocialIconProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

interface ContactInfo {
  email: string;
  address: {
    street: string;
    city: string;
  };
  phone: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
}

const contactInfo: ContactInfo = {
  email: 'Info@Nworiecapital.Com',
  address: {
    street: '8407 Bandera Rd #103420',
    city: 'San Antonio, TX 78250'
  },
  phone: '(210) 503-0505',
  hours: {
    weekdays: 'Monday - Friday: 9am - 5pm',
    saturday: 'Saturday: By Appointment',
    sunday: 'Sunday: Closed'
  }
};

const footerSections = {
  quickLinks: [
    { label: 'Home', href: '#' },
    { label: 'About Us', href: '#' },
    { label: 'Loan Programs', href: '#' },
    { label: 'Apply Now', href: '#' },
    { label: 'Blog', href: '#' }
  ],
  loanPrograms: [
    { label: 'Residential', href: '#' },
    { label: 'Commercial', href: '#' },
    { label: 'Small Business', href: '#' },
    { label: 'Investor Tiers', href: '#' },
    { label: 'Horizontal Development And Vertical Construction', href: '#' }
  ]
};

const socialLinks = [
  {
    href: '#',
    icon: 'x',
    label: 'Follow us on X (Twitter)'
  },
  {
    href: '#',
    icon: 'facebook',
    label: 'Follow us on Facebook'
  },
  {
    href: '#',
    icon: 'instagram',
    label: 'Follow us on Instagram'
  },
  {
    href: '#',
    icon: 'whatsapp',
    label: 'Contact us on WhatsApp'
  }
];

const legalLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Cookie Policy', href: '#' }
];


const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const SocialIconRenderer = ({ iconType }: { iconType: string }) => {
  const icons = {
    x: <XIcon />,
    facebook: <Facebook size={16} />,
    instagram: <Instagram size={16} />,
    whatsapp: <MessageCircle size={16} />
  };
  
  return icons[iconType as keyof typeof icons] || null;
};


const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => {
  return (
    <a 
      href={href}
      className="text-gray-600 hover:text-primary transition-colors duration-200 block mb-3"
    >
      {children}
    </a>
  );
};

const FooterSection: React.FC<FooterSectionProps> = ({ title, links }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-neutral mb-6">{title}</h3>
      <div className="space-y-0">
        {links.map((link, index) => (
          <FooterLink key={index} href={link.href}>
            {link.label}
          </FooterLink>
        ))}
      </div>
    </div>
  );
};

const SocialIcon: React.FC<SocialIconProps> = ({ href, icon, label }) => {
  return (
    <a
      href={href}
      aria-label={label}
      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all duration-200"
    >
      {icon}
    </a>
  );
};

const CompanyInfo: React.FC = () => {
  return (
    <div className="lg:col-span-1">
      <div className="mb-6">
        <Image 
          src={Logo}
          alt="Nworie Capital Logo" 
          width={220}
          height={32}
          className="mb-6"
        />
      </div>
      
      <div className="space-y-3 text-gray-600">
        <p>{contactInfo.email}</p>
        <div>
          <p>{contactInfo.address.street}</p>
          <p>{contactInfo.address.city}</p>
        </div>
        <p>{contactInfo.phone}</p>
        <div className="pt-2">
          <p>{contactInfo.hours.weekdays}</p>
          <p>{contactInfo.hours.saturday}</p>
          <p>{contactInfo.hours.sunday}</p>
        </div>
      </div>
    </div>
  );
};

const NewsletterSection: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-neutral mb-6">Newsletter</h3>
      <p className="text-gray-600 mb-6 leading-relaxed">
        Subscribe to our newsletter for new products, trends and offers
      </p>
      
    
      <div className="flex mb-6">
        <input
          type="email"
          placeholder="example@gmail.com"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-primary"
        />
        <button className="bg-primary text-white px-6 py-3 rounded-r-md font-medium hover:bg-primary-600 transition-colors duration-200 cursor-pointer">
          Subscribe
        </button>
      </div>

      
      <div className="flex space-x-4">
        {socialLinks.map((social, index) => (
          <SocialIcon
            key={index}
            href={social.href}
            icon={<SocialIconRenderer iconType={social.icon} />}
            label={social.label}
          />
        ))}
      </div>
    </div>
  );
};

const FooterBottom: React.FC = () => {
  return (
    <div className="border-t border-gray-200 pt-8">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <p className="text-gray-600 text-sm">
          Copyright © 2019-2025 Nworie Capital - All Rights Reserved.
        </p>
        
        <div className="flex space-x-8">
          {legalLinks.map((link, index) => (
            <a 
              key={index}
              href={link.href} 
              className="text-gray-600 hover:text-primary transition-colors duration-200 text-sm"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-8xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <CompanyInfo />
          <FooterSection title="Quick Links" links={footerSections.quickLinks} />
          <FooterSection title="Loan Programs" links={footerSections.loanPrograms} />
          <NewsletterSection />
        </div>
        <FooterBottom />
      </div>
    </footer>
  );
}