import React from 'react'
import Link from 'next/link'

const Footer = () => {
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/product' },
    { label: 'Find My Fit', href: '/try-on' },
    { label: 'Brands', href: '/brand' },
    { label: 'Contact', href: '/contact' },
  ]

  const shopLinks = [
    { label: 'All Products', href: '/product' },
    { label: 'Virtual Try-On', href: '/try-on' },
    { label: 'Size Guide', href: '/size-guide' },
  ]

  const companyLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Help Center', href: '/help' },
    { label: 'Returns', href: '/returns' },
  ]

  const linkCls = 'text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200'

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 font-serif">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-xl tracking-[0.2em] font-light uppercase text-black dark:text-slate-300">
                Fit-Me
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              AI-powered virtual try-on. Shop smarter, return less, feel confident.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-slate-900 dark:text-slate-100 mb-4">
              Navigate
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkCls}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-slate-900 dark:text-slate-100 mb-4">
              Shop
            </h3>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkCls}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-slate-900 dark:text-slate-100 mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkCls}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            © 2026 Fit-Me. All rights reserved.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Built with AI technology
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer
