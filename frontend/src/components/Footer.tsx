'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaYoutube, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#' },
        { label: 'Pricing', href: '#' },
        { label: 'Security', href: '#' },
        { label: 'Gallery', href: '/gallery' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Press', href: '#' },
        { label: 'Contact', href: '/contact' },
        { label: 'Blog', href: '/blog' },
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
    <footer className="relative bg-gradient-to-b from-white via-green-100 to-green-500 text-green-950 pt-8 pb-4 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/80 rounded-full filter blur-3xl -translate-x-1/3 -translate-y-1/3 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-600/35 rounded-full filter blur-3xl translate-x-1/3 translate-y-1/3 animate-pulse" />

      <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-3 sm:px-4 lg:px-6">
        <div className="rounded-3xl border border-white/70 bg-white/75 shadow-2xl backdrop-blur-xl p-4 md:p-5">
          {/* Main Content */}
          <div className="grid gap-4 md:grid-cols-12 md:gap-5">
            {/* Brand Section */}
            <div className="md:col-span-5 lg:col-span-4 group">
              <div className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-green-700">
                Agroudan Kisan Pragati
              </div>

              <div className="mt-3 rounded-2xl border border-green-100 bg-gradient-to-br from-white to-green-50 p-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white via-green-100 to-green-500 blur-md opacity-80 scale-110" />
                    <Image
                      src="/logo.png"
                      alt="Agroudan Kisan Pragati Logo"
                      width={72}
                      height={72}
                      className="relative z-10 rounded-2xl"
                    />
                  </div>

                  <div className="space-y-2">
                  <h3 className="text-xl font-black tracking-tight text-green-950">
                    Agroudan Kisan Pragati
                  </h3>
                  <p className="max-w-sm text-sm leading-6 text-green-900">
                    Smart farming, smart income. Empowering Indian farmers with AI-driven solutions.
                  </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 grid gap-2 text-sm text-green-900">
                <div className="flex items-center gap-3 rounded-xl border border-green-100 bg-white px-3 py-2.5 shadow-sm">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-green-100 text-green-700">
                    <FaPhone size={14} />
                  </span>
                  <span>+91 6378095181</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-green-100 bg-white px-3 py-2.5 shadow-sm">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-green-100 text-green-700">
                    <FaEnvelope size={14} />
                  </span>
                  <span>agroudankisanpragati@gmail.com</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-green-100 bg-white px-3 py-2.5 shadow-sm">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-green-100 text-green-700">
                    <FaMapMarkerAlt size={14} />
                  </span>
                  <span>Main Market Barna, Jalsu, Jaipur Rajasthan</span>
                </div>
              </div>
            </div>

            {/* Link Sections */}
            <div className="md:col-span-7 lg:col-span-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {sections.map((section) => (
                <div
                  key={section.title}
                  className="rounded-2xl border border-green-100 bg-white/80 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md"
                >
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide text-green-950">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    {section.title}
                  </h4>
                  <ul className="space-y-1 text-sm">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="group/link flex items-center justify-between rounded-xl px-2.5 py-1.5 text-green-900 transition-colors duration-200 hover:bg-green-50 hover:text-green-700"
                        >
                          <span>{link.label}</span>
                          <span className="ml-3 inline-block h-1.5 w-1.5 rounded-full bg-green-300 transition-transform duration-200 group-hover/link:scale-110 group-hover/link:bg-green-500" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-4 flex flex-col gap-3 border-t border-green-200 pt-4 md:flex-row md:items-center md:justify-between">
            <p className="text-center text-xs font-medium text-green-900 md:text-left">
              © {currentYear} Agroudan Kisan Pragati LLP. All rights reserved. | Empowering farmers, building futures.
            </p>

            <div className="flex justify-center gap-2 md:justify-end">
              {[
                { icon: FaFacebook, href: 'https://www.facebook.com/profile.php?id=61589122658245', label: 'Facebook' },
                { icon: FaXTwitter, href: 'https://x.com/agroudankisan', label: 'X' },
                { icon: FaInstagram, href: 'https://www.instagram.com/agroudankisanpragati/', label: 'Instagram' },
                { icon: FaYoutube, href: 'https://www.youtube.com/@AGROUDANKISANPRAGATI', label: 'YouTube' },
              ].map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="relative grid h-10 w-10 place-items-center rounded-full border border-green-200 bg-white text-green-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-400 hover:bg-green-600 hover:text-white"
                  >
                    <Icon size={18} />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Farming Tagline */}
          <div className="mt-4 rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-white px-4 py-2.5 text-center shadow-sm">
            <p className="text-xs font-medium italic text-green-900">
              🌾 Connecting farmers to technology, markets, and prosperity 🌾
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
