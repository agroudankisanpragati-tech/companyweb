'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaTimes, FaLeaf, FaChevronDown } from 'react-icons/fa';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navLinks = [
    { 
      href: '/#about', 
      label: 'About', 
      dropdown: 'about', 
      items: [
        { label: 'About Us – Company', href: '/#about-company' },
        { label: 'Our Operations', href: '/#our-operations' },
        { label: 'History & Milestones', href: '/#history-milestones' },
        { label: 'Our Vision, Mission and Values', href: '/#vision-mission-values' },
        { label: 'Board of Directors', href: '/#board-directors' },
        { label: 'Top Management', href: '/#top-management' },
        { label: 'Awards', href: '/#awards' }
      ] 
    },
    { href: '/weather', label: 'Weather' },
    { href: '/mandi-prices', label: 'Mandi Prices' },
    { href: '/shops', label: 'Shops' },
    { href: '/schemes', label: 'Govt Schemes' },
    { href: '/careers', label: 'Careers' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-lg border-b-2 border-green-100 w-full">
      <div className="max-w-full">
        <div className="section-container">
          <div className="flex justify-between items-center py-3 md:py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group hover:scale-105 transition-transform duration-300 flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/10 rounded-lg blur-md group-hover:blur-lg transition-all duration-300" />
                <Image
                  src="/logo.png"
                  alt="AGROUDAN KISAN PRAGATI Logo"
                  width={48}
                  height={48}
                  className="rounded-lg relative z-10 group-hover:shadow-lg transition-shadow"
                />
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex gap-1 items-center">
              {navLinks.map((link) => (
                <div key={link.href} className="relative group">
                  {link.dropdown ? (
                    <button
                      onMouseEnter={() => setOpenDropdown(link.dropdown!)}
                      onMouseLeave={() => setOpenDropdown(null)}
                      className="relative px-4 py-2 text-green-700 font-semibold text-sm group overflow-hidden rounded-lg hover:bg-green-50 transition-all duration-300 flex items-center gap-2"
                    >
                      <span className="relative z-10 transition-colors duration-300">
                        {link.label}
                      </span>
                      <FaChevronDown size={12} className={`transition-transform duration-300 ${openDropdown === link.dropdown ? 'rotate-180' : ''}`} />
                      <div className="absolute bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-yellow-400 group-hover:w-full transition-all duration-300" />
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className="relative px-4 py-2 text-green-700 font-semibold text-sm group overflow-hidden rounded-lg hover:bg-green-50 transition-all duration-300"
                    >
                      <span className="relative z-10 transition-colors duration-300">
                        {link.label}
                      </span>
                      <div className="absolute bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-yellow-400 group-hover:w-full transition-all duration-300" />
                    </Link>
                  )}
                  
                  {/* Dropdown Menu */}
                  {link.dropdown && link.items && (
                    <div className="absolute left-0 mt-0 w-48 bg-white rounded-lg shadow-xl border border-green-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      {link.items.map((item, idx) => (
                        <Link
                          key={idx}
                          href={typeof item === 'string' ? link.href : item.href}
                          onClick={() => setOpenDropdown(null)}
                          className="block px-4 py-3 text-green-700 hover:bg-green-50 transition-colors duration-200 text-sm font-medium first:pt-3 last:pb-3 hover:text-green-900"
                        >
                          {typeof item === 'string' ? item : item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="hidden md:flex gap-3 items-center flex-shrink-0">
              <Link
                href="/auth/login"
                className="px-5 py-2.5 text-green-600 font-semibold rounded-lg border-2 border-green-600 hover:bg-green-50 transition-all duration-300 hover:shadow-lg active:scale-95 transform hover:scale-105 text-sm"
              >
                Sign In
              </Link>
              <Link
                href="/auth/role-select"
                className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg active:scale-95 transform hover:scale-105 flex items-center gap-2 text-sm transition-all duration-300"
              >
                <FaLeaf size={16} />
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Toggle - 48x48px touch target */}
            <button
              className="lg:hidden flex items-center justify-center w-12 h-12 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-300 active:bg-green-100 flex-shrink-0"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Mobile Menu - Full Width Dropdown */}
          {isOpen && (
            <div className="lg:hidden bg-white border-t border-green-100 pb-4 space-y-1 animate-slideDown max-h-[calc(100vh-80px)] overflow-y-auto">
              {navLinks.map((link) => (
                <div key={link.href}>
                  {link.dropdown ? (
                    <div>
                      <button
                        onClick={() => setOpenDropdown(openDropdown === link.dropdown ? null : link.dropdown!)}
                        className="w-full text-left px-4 py-3 text-green-700 hover:bg-green-50 rounded-lg transition-all duration-300 font-semibold text-sm active:scale-95 min-h-12 flex items-center justify-between"
                      >
                        {link.label}
                        <FaChevronDown size={14} className={`transition-transform duration-300 ${openDropdown === link.dropdown ? 'rotate-180' : ''}`} />
                      </button>
                      {openDropdown === link.dropdown && link.items && (
                        <div className="bg-green-50 space-y-1 px-4 py-2">
                          {link.items.map((item, idx) => (
                            <Link
                              key={idx}
                              href={typeof item === 'string' ? link.href : item.href}
                              onClick={() => {
                                setOpenDropdown(null);
                                setIsOpen(false);
                              }}
                              className="block px-3 py-2 text-green-600 hover:bg-green-100 rounded transition-colors duration-200 text-sm font-medium"
                            >
                              {typeof item === 'string' ? item : item.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className="block px-4 py-3 text-green-700 hover:bg-green-50 rounded-lg transition-all duration-300 font-semibold text-sm active:scale-95 min-h-12 flex items-center"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="border-t border-green-200 pt-3 mt-3 space-y-2 px-4">
                <Link
                  href="/auth/login"
                  className="block px-4 py-3 text-green-600 font-semibold rounded-lg border-2 border-green-600 hover:bg-green-50 transition-all duration-300 text-center text-sm min-h-12 flex items-center justify-center"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/role-select"
                  className="block px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 text-center flex items-center justify-center gap-2 text-sm min-h-12"
                  onClick={() => setIsOpen(false)}
                >
                  <FaLeaf size={16} />
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
