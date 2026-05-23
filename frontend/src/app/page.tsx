import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import VideoBanner from '@/components/VideoBanner';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <TopBar />
      <Navbar />
      <main className="w-full">
        <VideoBanner />
        <HowItWorks />
        <Features />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
