'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaTwitter, FaYoutube, FaInstagram, FaLeaf, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#' },
        { label: 'Pricing', href: '#' },
        { label: 'Security', href: '#' },
        { label: 'Blog', href: '/blog' },
        { label: 'Gallery', href: '/gallery' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Careers', href: '/careers' },
        { label: 'Press', href: '#' },
        { label: 'Contact', href: '/contact' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
        { label: 'Cookies', href: '#' },
        { label: 'Licenses', href: '#' },
      ]
    },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-green-900 via-emerald-900 to-green-800 text-gray-200 pt-[3.2rem] pb-[1.6rem] overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-700/20 rounded-full filter blur-3xl -translate-x-1/3 -translate-y-1/3 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-700/20 rounded-full filter blur-3xl translate-x-1/3 translate-y-1/3 animate-pulse" />

      <div className="section-container relative z-10">
        {/* Main Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 mb-6 md:mb-10">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1 group">
            <div className="mb-3 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-green-500/20 rounded-lg blur-md group-hover:blur-lg transition-all duration-300" />
              <Image
                src="/logo.png"
                alt="Kisan Unnati Logo"
                width={56}
                height={56}
                className="rounded-lg relative z-10 group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="space-y-3">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <FaLeaf className="text-yellow-400 animate-bounce" />
                Kisan Unnati
              </h3>
              <p className="text-sm leading-relaxed text-green-100">
                Smart farming, smart income. Empowering Indian farmers with AI-driven solutions.
              </p>
              <div className="space-y-1.5 text-xs text-green-200">
                <div className="flex items-center gap-2 hover:text-yellow-300 transition-colors">
                  <FaPhone size={14} />
                  <span>+91 XXXX XXXX</span>
                </div>
                <div className="flex items-center gap-2 hover:text-yellow-300 transition-colors">
                  <FaEnvelope size={14} />
                  <span>hello@kisan.com</span>
                </div>
                <div className="flex items-center gap-2 hover:text-yellow-300 transition-colors">
                  <FaMapMarkerAlt size={14} />
                  <span>India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Link Sections */}
          {sections.map((section) => (
            <div key={section.title} className="group">
              <h4 className="text-white font-bold mb-3 text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full group-hover:scale-150 transition-transform" />
                {section.title}
              </h4>
              <ul className="space-y-1.5 text-sm">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-green-200 hover:text-yellow-300 transition-colors duration-300 relative group/link inline-block"
                    >
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-green-400 group-hover/link:w-full transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-green-700/50 my-6" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs md:text-sm text-center md:text-left text-green-200">
            © {currentYear} Kisan Unnati. All rights reserved. | Empowering farmers, building futures.
          </p>

          {/* Social Links */}
          <div className="flex gap-4 md:gap-6">
            {[
              { icon: FaFacebook, href: '#', label: 'Facebook' },
              { icon: FaTwitter, href: '#', label: 'Twitter' },
              { icon: FaYoutube, href: '#', label: 'YouTube' },
              { icon: FaInstagram, href: '#', label: 'Instagram' },
            ].map((social) => {
              const Icon = social.icon;
              return (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-gradient-to-br hover:from-yellow-400 hover:to-green-400 text-green-200 hover:text-white transition-all duration-300 group transform hover:scale-110 hover:-translate-y-1"
                >
                  <Icon size={18} className="group-hover:scale-125 transition-transform" />
                  <span className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Farming Tagline */}
        <div className="text-center mt-4 pt-4 border-t border-green-700/30">
          <p className="text-xs text-green-300 italic">
            🌾 Connecting farmers to technology, markets, and prosperity 🌾
          </p>
        </div>
      </div>
    </footer>
  );
}
