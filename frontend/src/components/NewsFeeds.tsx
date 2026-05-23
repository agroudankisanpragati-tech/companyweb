"use client";

import { FaRegNewspaper, FaArrowRight } from 'react-icons/fa';
import Image from 'next/image';

const feeds = [
  {
    id: 1,
    title: 'Local mandi prices updated for this week',
    date: 'May 18, 2026',
    excerpt: 'Get the latest mandi prices from nearby markets to make informed selling decisions.',
    href: '#',
    category: 'Markets',
    readTime: '2 min',
    image: '/img/news-1.jpg',
  },
  {
    id: 2,
    title: 'New disease detection model improves accuracy',
    date: 'May 12, 2026',
    excerpt: 'Our AI model now detects common crop diseases faster with higher precision.',
    href: '#',
    category: 'Research',
    readTime: '3 min',
    image: '/img/news-2.jpg',
  },
  {
    id: 3,
    title: 'Government scheme: Subsidies announced for drip irrigation',
    date: 'Apr 30, 2026',
    excerpt: 'A quick guide on eligibility and how to apply for new irrigation subsidies.',
    href: '#',
    category: 'Advisory',
    readTime: '4 min',
    image: '/img/news-3.jpg',
  },
];

export default function NewsFeeds() {
  return (
    <section id="news" className="py-10 md:py-14 lg:py-18 bg-gradient-to-b from-white to-gray-50">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-gradient-to-br from-green-50 to-green-100 text-green-700 rounded-lg shadow-sm">
              <FaRegNewspaper className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-xl md:text-3xl font-extrabold">News & Feeds</h3>
              <p className="text-sm text-gray-500">Latest updates, advisories and market news</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-md shadow-sm text-sm text-gray-700 hover:shadow-md" href="#">
              View all
              <FaArrowRight />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {feeds.map((f) => (
            <article
              key={f.id}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 transform hover:-translate-y-1 transition-shadow shadow-sm hover:shadow-lg"
            >
              <div className="relative w-full h-44 bg-gradient-to-br from-green-50 to-green-200">
                {f.image ? (
                  <Image src={f.image} alt={f.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-green-700">
                    <FaRegNewspaper className="w-10 h-10 opacity-80" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="text-xs px-2 py-1 bg-white/80 backdrop-blur-sm rounded-full text-green-700 font-semibold">{f.category}</span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="text-xs px-2 py-1 bg-white/70 rounded-full text-gray-700">{f.readTime}</span>
                </div>
              </div>

              <div className="p-4 md:p-5">
                <h4 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-2">{f.title}</h4>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm text-gray-600 line-clamp-3">{f.excerpt}</p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-gray-400">{f.date}</div>
                  <a href={f.href} className="inline-flex items-center gap-2 text-green-600 font-medium hover:underline">
                    Read
                    <FaArrowRight />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
