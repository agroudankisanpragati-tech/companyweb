'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaYoutube, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: 'Explore',
      links: [
        { label: 'Gallery', href: '/gallery' },
        { label: 'Blog', href: '/blog' },
        { label: 'Schemes', href: '/schemes' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
        { label: 'Cookies', href: '#' },
      ]
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-emerald-900/10 bg-[linear-gradient(180deg,_#0f172a_0%,_#0f2e24_100%)] text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-24 top-0 h-56 w-56 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-lime-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.28)] backdrop-blur-xl lg:grid-cols-[1.2fr_1fr] lg:p-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-200">
              Agroudan Kisan Pragati
            </div>

            <div className="flex items-start gap-4">
              <div className="shrink-0 rounded-2xl border border-white/10 bg-white/10 p-2 shadow-sm">
                <Image
                  src="/logo.png"
                  alt="Agroudan Kisan Pragati Logo"
                  width={56}
                  height={56}
                  className="rounded-xl bg-white p-0.5"
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight text-white">
                  Agroudan Kisan Pragati
                </h3>
                <p className="max-w-xl text-sm leading-6 text-slate-300">
                  Simple tools for farmers, shops, weather, and market access.
                </p>
              </div>
            </div>

            <div className="grid gap-2 text-sm text-slate-200 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500/15 text-emerald-200">
                  <FaPhone size={14} />
                </span>
                <span>+91 6378095181</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500/15 text-emerald-200">
                  <FaEnvelope size={14} />
                </span>
                <span className="truncate">agroudankisanpragati@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 sm:col-span-2">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500/15 text-emerald-200">
                  <FaMapMarkerAlt size={14} />
                </span>
                <span>Main Market Barna, Jalsu, Jaipur, Rajasthan</span>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {sections.map((section) => (
                <div
                  key={section.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm transition-colors duration-300 hover:bg-white/8"
                >
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide text-white">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    {section.title}
                  </h4>
                  <ul className="space-y-1 text-sm">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="group/link flex items-center justify-between rounded-xl px-2.5 py-1.5 text-slate-300 transition-colors duration-200 hover:bg-white/8 hover:text-white"
                        >
                          <span>{link.label}</span>
                          <span className="ml-3 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400/70 transition-transform duration-200 group-hover/link:scale-110 group-hover/link:bg-emerald-300" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

          <div className="flex flex-col gap-4 border-t border-white/10 pt-4 md:flex-row md:items-center md:justify-between">
            <p className="text-center text-xs font-medium text-slate-300 md:text-left">
              © {currentYear} Agroudan Kisan Pragati LLP.
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
                    className="relative grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/50 hover:bg-emerald-500 hover:text-white"
                  >
                    <Icon size={18} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
