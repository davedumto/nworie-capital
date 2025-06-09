'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import Logo from '@/public/images/Logo.svg'

// Types
interface NavItem {
  label: string;
  href: string;
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

interface DropdownItemProps {
  href: string;
  children: React.ReactNode;
}

interface LoanProgramsDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
}

// Navigation data
const navigationItems: NavItem[] = [
  { label: 'Home', href: '#' },
  { label: 'About', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Contact us', href: '#' }
];

const loanPrograms: NavItem[] = [
  { label: 'Personal Loans', href: '#' },
  { label: 'Business Loans', href: '#' },
  { label: 'Auto Loans', href: '#' },
  { label: 'Home Loans', href: '#' }
];

// Reusable components
const NavLink: React.FC<NavLinkProps> = ({ href, children, className = "" }) => {
  return (
    <a 
      href={href} 
      className={`text-neutral hover:text-primary transition-all duration-300 font-medium relative group ${className}`}
    >
      {children}
      <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
    </a>
  );
};

const DropdownItem: React.FC<DropdownItemProps> = ({ href, children }) => {
  return (
    <a 
      href={href} 
      className="block px-4 py-2 text-neutral hover:bg-accent hover:text-primary transition-colors duration-200"
    >
      {children}
    </a>
  );
};

const LoanProgramsDropdown: React.FC<LoanProgramsDropdownProps> = ({ isOpen, onToggle }) => {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center space-x-1 text-neutral hover:text-primary transition-all duration-300 font-medium relative group"
      >
        <span>Loan Programs</span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
          {loanPrograms.map((program, index) => (
            <DropdownItem key={index} href={program.href}>
              {program.label}
            </DropdownItem>
          ))}
        </div>
      )}
    </div>
  );
};

const MobileMenuButton: React.FC = () => {
  return (
    <div className="md:hidden">
      <button className="text-neutral hover:text-primary transition-colors duration-200">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
};

export default function Navbar() {
  const [isLoanDropdownOpen, setIsLoanDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsLoanDropdownOpen(!isLoanDropdownOpen);
  const closeDropdown = () => setIsLoanDropdownOpen(false);

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10 shadow-md">
      <div className="max-w-8xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Image 
            src={Logo}
            alt="Nworie Capital Logo" 
            width={120}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </div>

        {/* Navigation and Button */}
        <div className="flex items-center space-x-8">
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.slice(0, 2).map((item, index) => (
              <NavLink key={index} href={item.href}>
                {item.label}
              </NavLink>
            ))}
            
            <LoanProgramsDropdown 
              isOpen={isLoanDropdownOpen} 
              onToggle={toggleDropdown} 
            />
            
            {navigationItems.slice(2).map((item, index) => (
              <NavLink key={index + 2} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Apply Now Button */}
          <div className="flex items-center">
            <button className="bg-primary hover:bg-primary-600 text-primary-foreground px-6 py-2.5 rounded-full font-medium transition-colors duration-200 shadow-sm hover:shadow-md">
              Apply Now
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <MobileMenuButton />
      </div>

      {/* Dropdown Overlay */}
      {isLoanDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={closeDropdown}
        />
      )}
    </nav>
  );
}