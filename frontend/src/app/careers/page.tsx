"use client";

import Link from 'next/link';
import Image from 'next/image';
import { FaLinkedin, FaFacebook, FaTwitter, FaInstagram, FaBriefcase, FaUsers, FaSeedling, FaPaperPlane } from 'react-icons/fa';

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50">
      <header className="border-b border-green-100 bg-white/90 backdrop-blur-sm">
        <div className="section-container py-4 sm:py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Kisan Unnati Logo" width={34} height={34} className="rounded-md" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-600">Careers</p>
                <h1 className="text-xl font-bold text-green-950">Join Kisan Unnati</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/" className="rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-medium text-green-800 hover:bg-green-50 transition">
                Home
              </Link>
              <Link href="/contact" className="rounded-full bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 transition">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="section-container py-12 sm:py-16">
        {/* Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-green-900 leading-tight">Work With Us</h1>
            <p className="text-lg text-green-800/90">We strive to create a meaningful work environment where real growth takes place at every level, where hard work and teamwork are the keys to achieving goals, yours and ours.</p>
            <p className="text-base text-green-700/90">Our collaborative work style offers the support you need to make an impact on our business, while enabling you to shape your career, in the path you have chosen. Be a part of our journey and join us in creating a better business and a better world.</p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="https://www.linkedin.com/company/agroudan-kisan-pragati"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 transition"
              >
                <FaLinkedin />
                Visit Our LinkedIn Page
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-6 py-3 border-2 border-green-200 text-green-800 font-semibold rounded-lg bg-white/60 hover:bg-green-50 transition"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <div className="w-[420px] h-[320px] rounded-2xl bg-white shadow-2xl overflow-hidden border border-green-100 p-4">
              <div className="relative w-full h-full">
                <Image src="/1778677564941.jpg" alt="We are hiring - Agroudan" fill className="object-contain" />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-white rounded-2xl shadow-md border border-green-50">
            <div className="flex items-center justify-center w-12 h-12 bg-green-50 text-green-700 rounded-lg mb-4">
              <FaSeedling />
            </div>
            <h4 className="text-lg font-semibold text-green-900 mb-2">Meaningful Impact</h4>
            <p className="text-sm text-green-700">Work on solutions that directly benefit farmers and communities.</p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-md border border-green-50">
            <div className="flex items-center justify-center w-12 h-12 bg-green-50 text-green-700 rounded-lg mb-4">
              <FaUsers />
            </div>
            <h4 className="text-lg font-semibold text-green-900 mb-2">Collaborative Culture</h4>
            <p className="text-sm text-green-700">Cross-functional teams, mentorship, and growth opportunities.</p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-md border border-green-50">
            <div className="flex items-center justify-center w-12 h-12 bg-green-50 text-green-700 rounded-lg mb-4">
              <FaBriefcase />
            </div>
            <h4 className="text-lg font-semibold text-green-900 mb-2">Career Progression</h4>
            <p className="text-sm text-green-700">Clear paths, continuing learning, and real ownership of work.</p>
          </div>
        </section>

        {/* Open Roles */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-green-900">Open Positions</h2>
            <Link href="/contact" className="text-sm text-green-700 underline">Can't find a match? Reach out</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Frontend Engineer', location: 'Remote / India', id: 'fe-01' },
              { title: 'Product Manager', location: 'Bengaluru', id: 'pm-02' },
              { title: 'Data Scientist', location: 'Remote / India', id: 'ds-03' },
              { title: 'Community Manager', location: 'Field-based', id: 'cm-04' },
            ].map((job) => (
              <div key={job.id} className="p-5 bg-white rounded-2xl shadow-sm border border-green-50 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-green-900">{job.title}</h3>
                  <p className="text-sm text-green-700 mt-1">{job.location}</p>
                  <p className="text-sm text-green-600 mt-3">We are looking for motivated people who want to build sustainable, impactful solutions for farmers. Strong communication and a bias for action are important.</p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-green-600">ID: {job.id}</div>
                  <div className="flex gap-3">
                    <Link href={`/careers/${job.id}`} className="px-4 py-2 bg-white border border-green-200 text-green-800 rounded-lg text-sm hover:bg-green-50">View</Link>
                    <a href={`mailto:hello@kisan.com?subject=Application%20for%20${encodeURIComponent(job.title)}`} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-sm">
                      <FaPaperPlane />
                      Apply
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Social / Follow */}
        <section className="bg-gradient-to-r from-green-900 to-emerald-900 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">Follow Us On</h3>
              <p className="text-sm text-green-100/90">To see the latest developments and to stay connected with us, follow our LinkedIn and social channels.</p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="https://www.linkedin.com/company/agroudan-kisan-pragati" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition">
                <FaLinkedin />
              </Link>
              <Link href="#" aria-label="Facebook" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition">
                <FaFacebook />
              </Link>
              <Link href="#" aria-label="Twitter" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition">
                <FaTwitter />
              </Link>
              <Link href="#" aria-label="Instagram" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition">
                <FaInstagram />
              </Link>
            </div>
          </div>
        </section>
      </div>

      <footer className="border-t border-green-100 bg-white/90">
        <div className="section-container py-5 sm:py-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-green-800">© {new Date().getFullYear()} Kisan Unnati. Careers for people building better farming tools.</p>
          <Link href="/contact" className="text-sm font-medium text-green-700 hover:text-green-900 transition">
            Reach out for openings
          </Link>
        </div>
      </footer>
    </main>
  );
}
