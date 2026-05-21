import Navbar from '@/components/Navbar';
import TopBar from '@/components/TopBar';
import VideoBanner from '@/components/VideoBanner';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="w-full">
      <TopBar />
      <Navbar />
      <VideoBanner />
      <HowItWorks />
      <Features />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
