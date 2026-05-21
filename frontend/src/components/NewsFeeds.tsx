"use client";

import { FaRegNewspaper, FaArrowRight } from 'react-icons/fa';

const feeds = [
  {
    id: 1,
    title: 'Local mandi prices updated for this week',
    date: 'May 18, 2026',
    excerpt: 'Get the latest mandi prices from nearby markets to make informed selling decisions.',
    href: '#',
  },
  {
    id: 2,
    title: 'New disease detection model improves accuracy',
    date: 'May 12, 2026',
    excerpt: 'Our AI model now detects common crop diseases faster with higher precision.',
    href: '#',
  },
  {
    id: 3,
    title: 'Government scheme: Subsidies announced for drip irrigation',
    date: 'Apr 30, 2026',
    excerpt: 'A quick guide on eligibility and how to apply for new irrigation subsidies.',
    href: '#',
  },
];

export default function NewsFeeds() {
  return (
    <section id="news" className="py-8 md:py-12 lg:py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="section-container">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-green-50 text-green-600 rounded-md">
              <FaRegNewspaper className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg md:text-2xl font-semibold">News & Feeds</h3>
              <p className="text-sm text-gray-500">Latest updates, advisories and market news</p>
            </div>
          </div>
          <a className="text-sm text-green-600 font-medium hover:underline flex items-center gap-2" href="#">
            View all
            <FaArrowRight />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {feeds.map((f) => (
            <article key={f.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 md:p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-md bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-green-700">
                  <FaRegNewspaper />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm md:text-base">{f.title}</h4>
                    <span className="text-xs text-gray-400">{f.date}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">{f.excerpt}</p>
                  <div className="mt-3">
                    <a href={f.href} className="text-sm text-green-600 font-medium inline-flex items-center gap-2">
                      Read
                      <FaArrowRight />
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
