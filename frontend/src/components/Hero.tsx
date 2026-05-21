'use client';

import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-amber-50 to-lime-50 py-12 md:py-20 lg:py-32">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-green-300/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl" />
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="order-2 md:order-1">
            <p className="inline-flex rounded-full border border-green-200 bg-white/70 px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] text-green-700 shadow-sm">
              AI-powered digital farming companion
            </p>
            <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold leading-tight mb-4 md:mb-6 text-gray-900">
              Every farmer deserves{' '}
              <span className="gradient-text">better decisions</span>
            </h1>
            <p className="text-base sm:text-lg md:text-lg text-gray-600 mb-4 md:mb-6 leading-relaxed max-w-xl">
              Kisan Unnati combines AI advice, voice support, crop guidance, weather alerts, disease detection, schemes, and marketplace access in one simple platform for Indian farmers.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
              <Link href="/auth/role-select" className="btn-primary flex items-center justify-center gap-2 py-3 md:py-3 text-base md:text-lg min-h-12">
                Start Your Farm Setup <FaArrowRight size={16} />
              </Link>
              <Link href="#features" className="btn-secondary flex items-center justify-center text-base md:text-lg min-h-12">
                Explore the Platform
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 md:gap-6 text-xs md:text-sm text-gray-600">
              <div className="flex items-center gap-2">✓ <span>Voice + text assistance</span></div>
              <div className="flex items-center gap-2">✓ <span>Regional language support</span></div>
              <div className="flex items-center gap-2">✓ <span>Organic-friendly guidance</span></div>
            </div>
          </div>

          {/* Right Illustration Placeholder */}
          <div className="relative order-1 md:order-2">
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-2xl p-6 md:p-8 lg:p-10 border border-white/70">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 p-5 text-white shadow-lg">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-100">AI crop suggestion</p>
                  <p className="mt-3 text-3xl font-black">Best crop</p>
                  <p className="mt-2 text-sm text-green-50">Based on soil, rainfall, water, and market demand.</p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Live alerts</p>
                  <p className="mt-3 text-3xl font-black text-gray-900">Weather + disease</p>
                  <p className="mt-2 text-sm text-gray-600">Get warnings and treatment suggestions on time.</p>
                </div>
                <div className="sm:col-span-2 rounded-2xl border border-dashed border-green-200 bg-green-50 p-6 text-center">
                  <div className="text-5xl md:text-6xl mb-3">🌾</div>
                  <p className="text-gray-800 font-semibold text-sm md:text-base">A simple companion for small and low-tech farmers</p>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">Voice commands, scheme help, marketplace access, and community learning in one place.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
