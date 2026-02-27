import Image from "next/image";
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import Herosection from "../components/home/Herosection";

import Features from "../components/home/Features";

export default function Home() {
  return (
    <>
      <main className="min-h-screen  dark:bg-gray-900 transition-colors duration-300">
        <Herosection />
      <Features/>
      </main>
      <Footer/>
    </>
  );
}
