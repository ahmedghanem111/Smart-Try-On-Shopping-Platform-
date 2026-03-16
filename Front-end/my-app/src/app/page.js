import Image from "next/image";
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import Herosection from "../components/home/Herosection";
import Features from "../components/home/Features";
import WhoUsesOurAI from "../components/home/WhoUsesOurAI";
import CTASection from "../components/home/CTASection";

export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
        <Herosection />
        <Features/>
        <WhoUsesOurAI />
        <CTASection />
      </main>
      <Footer/>
    </>
  );
}
