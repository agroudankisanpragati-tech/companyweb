'use client';

import { FaCheck } from 'react-icons/fa';
import NewsFeeds from './NewsFeeds';

const plans = [
  {
    name: 'Farmer',
    price: 'Free',
    description: 'Perfect for getting started',
    features: [
      'AI Crop Recommendations',
      'Voice Assistant (3 languages)',
      'Basic Weather Updates',
      'Community Access',
      'Limited Marketplace Listings',
    ],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Pro Farmer',
    price: '₹99',
    period: '/month',
    description: 'For serious farmers',
    features: [
      'Everything in Farmer',
      'Advanced Weather Forecasts',
      'Disease Detection (Unlimited)',
      'Priority Marketplace Listings',
      '15+ Local Languages',
      'Yield Prediction',
      'Email Support',
    ],
    cta: 'Start 7-Day Trial',
    popular: true,
  },
  {
    name: 'Agri Vendor',
    price: 'Custom',
    description: 'For retailers & wholesalers',
    features: [
      'Bulk Buyer Access',
      'Price Analytics',
      'Farmer Directory',
      'Custom Listings',
      'Dedicated Account Manager',
      'API Access',
      'Priority Support',
    ],
    cta: 'Contact Us',
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-12 md:py-20 lg:py-32 bg-white">
      <div className="section-container">
        <NewsFeeds />
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 px-4">
            Choose the plan that works best for you. All plans are free for basic farmers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-lg p-6 md:p-8 transition-all duration-300 flex flex-col ${plan.popular
                  ? 'bg-green-600 text-white shadow-2xl md:scale-105'
                  : 'bg-gray-50 text-gray-900 border border-gray-200'
                }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-yellow-400 text-gray-900 px-2 py-1 md:px-3 rounded-full text-xs md:text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">{plan.name}</h3>
              <p className={`text-xs md:text-sm mb-4 md:mb-6 ${plan.popular ? 'text-green-100' : 'text-gray-600'}`}>
                {plan.description}
              </p>

              <div className="mb-4 md:mb-6">
                <span className="text-3xl md:text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-xs md:text-sm">{plan.period}</span>}
              </div>

              <button
                className={`w-full py-2 md:py-3 rounded-lg font-semibold mb-6 md:mb-8 transition-all text-sm md:text-base min-h-10 ${plan.popular
                    ? 'bg-white text-green-600 hover:bg-gray-100'
                    : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
              >
                {plan.cta}
              </button>

              <ul className="space-y-3 md:space-y-4 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 md:gap-3">
                    <FaCheck size={14} className="flex-shrink-0 mt-0.5 md:mt-0" />
                    <span className="text-xs md:text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
