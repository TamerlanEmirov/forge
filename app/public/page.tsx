import { Navbar } from "@/components/public/Navbar";
import { Hero } from "@/components/public/Hero";
import { Features } from "@/components/public/Features";
import { CTA } from "@/components/public/CTA";
import { Footer } from "@/components/public/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />

      <main>
        <Hero />
        <Features />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}