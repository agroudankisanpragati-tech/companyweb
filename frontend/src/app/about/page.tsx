import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'About — Agroudan Kisan Pragati',
};

export default function AboutPage() {
  return (
    <main className="bg-gradient-to-b from-white to-green-50 py-16">
      <div className="mx-auto max-w-6xl px-6">
        {/* Hero */}
        <section className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 mb-4">
              About Us
            </div>
            <h1 className="text-4xl font-extrabold leading-tight text-green-900 mb-4">
              Empowering farmers with technology, insight and markets
            </h1>
            <p className="text-lg text-green-800 mb-6">
              Agroudan Kisan Pragati blends local agricultural expertise with modern data-driven tools to
              improve farm productivity, incomes and sustainability across India.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/careers"
                className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-white shadow hover:bg-green-800"
              >
                See Open Positions
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-white px-4 py-2 text-green-700 shadow-sm hover:bg-green-50"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="pointer-events-none absolute -inset-y-4 -right-8 -z-10 transform rotate-3 rounded-3xl bg-gradient-to-br from-green-100 to-green-300 opacity-60 blur-3xl" />
            <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
              <Image src="/img/hero-farm.jpg" alt="Farmers" width={860} height={540} className="w-full object-cover" />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Farmers helped', value: '12k+' },
            { label: 'Crops supported', value: '45' },
            { label: 'Market connections', value: '8k+' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-green-100 bg-white p-5 text-center shadow-sm">
              <div className="text-2xl font-bold text-green-900">{s.value}</div>
              <div className="mt-1 text-sm text-green-800">{s.label}</div>
            </div>
          ))}
        </section>

        {/* What we do */}
        <section className="mt-10 grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Advisory & Recommendations</h3>
            <p className="text-green-800 text-sm">Crop-specific guidance, pest alerts and optimized input plans to boost yields.</p>
          </div>

          <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Weather & Market Insights</h3>
            <p className="text-green-800 text-sm">Localized weather forecasts and mandi prices to inform harvesting and sales decisions.</p>
          </div>

          <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Marketplace</h3>
            <p className="text-green-800 text-sm">Direct listings and buyer connections to improve margins for farmers.</p>
          </div>
        </section>

        {/* Team + Values */}
        <section className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-green-900 mb-4">Our Values</h3>
            <ul className="space-y-3 text-green-800">
              <li><strong>Farmer-first:</strong> Design with real farmer needs and field realities.</li>
              <li><strong>Local expertise:</strong> Work closely with agronomists and extension workers.</li>
              <li><strong>Data-driven:</strong> Use evidence to deliver actionable, low-cost guidance.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-green-900 mb-4">Meet the Team</h3>
            <div className="text-green-800">
              <p className="text-sm">Team details will be updated soon. Follow our careers page for openings and team announcements.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 rounded-2xl border border-green-100 bg-gradient-to-r from-green-50 to-white p-8 text-center shadow-sm">
          <h3 className="text-2xl font-bold text-green-900 mb-3">Join us in building resilient livelihoods</h3>
          <p className="text-green-800 mb-4">We’re hiring across product, data and field operations. Help scale impact for millions of farmers.</p>
          <div className="flex justify-center">
            <Link href="/careers" className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-5 py-3 text-white shadow hover:bg-green-800">
              View Careers
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}

