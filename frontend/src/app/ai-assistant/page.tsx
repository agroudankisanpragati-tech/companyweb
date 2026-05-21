"use client"

import React from "react"

const services = [
  { title: "Voice-Based Assistant", img: "/img/1.png" },
  { title: "Direct Farmer Marketplace", img: "/img/2.png" },
  { title: "Weather Intelligence", img: "/img/3.png" },
  { title: "Disease Detection", img: "/img/4.png" },
  { title: "Gamified Learning", img: "/img/5.png" },
  { title: "Government Scheme Help", img: "/img/6.png" },
  { title: "Organic Support", img: "/img/7.png" },
  { title: "Community Learning", img: "/img/8.png" },
  { title: "Soil & Leaf Testing", img: "/img/9.png" },
]

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f6efe8] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10" />

        <div className="relative flex flex-col md:flex-row gap-8">
          {/* Left: heading + subtle background feature list */}
          <aside className="w-full md:w-1/3 relative">
            <div className="relative z-20">
              <p className="text-amber-400 font-semibold">Our Products &amp; Services</p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#0b0b0b] mt-3">AI Farming Assistant</h1>
              <p className="mt-4 text-gray-700">Ask about crops, diseases, mandi prices, government schemes, and more — by text or voice.</p>
            </div>

            {/* Background feature block (subtle, decorative) */}
            <div className="pointer-events-none absolute inset-0 -z-10 flex items-start">
              <div className="mt-20 ml-0 opacity-10 text-2xl md:text-4xl leading-tight font-extrabold text-[#0b0b0b]">
                <div>Voice-Based Assistant</div>
                <div>Direct Farmer Marketplace</div>
                <div>Weather Intelligence</div>
                <div>Disease Detection</div>
                <div>Gamified Learning</div>
                <div>Government Scheme Help</div>
                <div>Organic Support</div>
                <div>Community Learning</div>
              </div>
            </div>
          </aside>

          {/* Right: cards grid */}
          <div className="w-full md:flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {services.map((s) => (
                <div key={s.title} className="relative bg-white rounded-2xl shadow-sm overflow-hidden p-4">
                  <div className="relative bg-gray-100 overflow-hidden rounded-2xl">
                    <div className="h-44 w-full">
                      <img
                        src={s.img}
                        alt={s.title}
                        className="w-full h-full object-cover rounded-2xl"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=60'
                        }}
                      />
                    </div>

                    {/* decorative cutout / notch */}
                    <div className="absolute -right-3 -bottom-3 bg-white w-14 h-14 rounded-2xl shadow flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M5 12H19"
                          stroke="#0f9d58"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 5L19 12L12 19"
                          stroke="#0f9d58"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-gray-700 font-semibold">{s.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
