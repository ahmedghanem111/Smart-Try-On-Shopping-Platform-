import React from "react";
import Image from "next/image";
import Link from "next/link";

const linkStyle = `
text-slate-900 dark:text-slate-100
hover:text-purple-600 dark:hover:text-purple-400
underline-offset-4
hover:underline decoration-purple-500 dark:decoration-purple-400
transition-all duration-300
`;
const Footer = () => {
  return (
    <footer className="bg-white/80 dark:bg-black/60 backdrop-blur-md border-b border-purple-400 border-t mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 items-start">

          {/* Brand */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo2.png"
              alt="Logo"
              width={230}
              height={60}
              className="object-contain"
            />
          </Link>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Shop
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className={linkStyle}>All Products</Link></li>
              <li><Link href="/categories" className={linkStyle}>Categories</Link></li>
              <li><Link href="/try-on" className={linkStyle}>Virtual Try-On</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className={linkStyle}>Help Center</Link></li>
              <li><Link href="/size-guide" className={linkStyle}>Size Guide</Link></li>
              <li><Link href="/returns" className={linkStyle}>Returns</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className={linkStyle}>About Us</Link></li>
              <li><Link href="/brand-assets" className={linkStyle}>Brand Assets</Link></li>
              <li><Link href="/contact" className={linkStyle}>Contact</Link></li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-slate-800 mt-12 pt-6 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            © 2026 Fitme. All rights reserved. Built with cutting-edge AI technology.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
