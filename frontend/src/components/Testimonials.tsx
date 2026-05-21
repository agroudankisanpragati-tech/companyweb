'use client';

const testimonials = [
  {
    name: 'Rajesh Kumar',
    location: 'Maharashtra',
    image: '👨‍🌾',
    quote:
      'Kisan Unnati helped me choose cotton this year instead of wheat. My income increased by 3 times! The app is so easy to use.',
    crop: 'Cotton Farmer',
  },
  {
    name: 'Priya Singh',
    location: 'Punjab',
    image: '👩‍🌾',
    quote:
      'I sold my vegetables directly through the marketplace. No middlemen, no haggling. I got 40% more than before!',
    crop: 'Vegetable Farmer',
  },
  {
    name: 'Arun Patel',
    location: 'Gujarat',
    image: '👨‍🌾',
    quote:
      'The disease detection feature saved my mango crop. AI told me exactly what was wrong and how to fix it.',
    crop: 'Mango Farmer',
  },
];

export default function Testimonials() {
  return (
    <section className="py-12 md:py-20 lg:py-32 bg-gray-50">
      <div className="section-container">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
            Farmers Love <span className="gradient-text">Kisan Unnati</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 px-4">
            Join thousands of successful farmers already using our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 md:p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="text-3xl md:text-4xl flex-shrink-0">{testimonial.image}</div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm md:text-base truncate">{testimonial.name}</h4>
                  <p className="text-xs md:text-sm text-gray-600 truncate">{testimonial.crop} • {testimonial.location}</p>
                </div>
              </div>
              <p className="text-gray-700 italic leading-relaxed text-sm md:text-base">
                "{testimonial.quote}"
              </p>
              <div className="mt-4 text-yellow-500 text-lg md:text-xl">⭐⭐⭐⭐⭐</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
