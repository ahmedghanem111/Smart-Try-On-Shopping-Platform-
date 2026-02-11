'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from '../../contexts/ThemeContext'
import { BiSolidHome } from "react-icons/bi";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'products', label: 'Products', href: '/products' },
    { id: 'try-on', label: 'Try-On', href: '/try-on' },
    { id: 'categories', label: 'Categories', href: '/categories' },
  ];

  return (
    <nav className="  sticky top-0 z-50 bg-gradient-to-r   bg-white/80 dark:bg-black/60 backdrop-blur-md border-b border-purple-400 shadow-lg">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center transition-transform duration-300 hover:scale-105">
            <Image
              src="/logo2.png"
              alt="Logo"
              width={230}
              height={60}
              className="object-contain"
            />
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className=" px-4 py-2 rounded-lg font-medium text-slate-900 dark:text-slate-100 hover:bg-purple-500/10 dark:hover:bg-white/10 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 transform hover:scale-105"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white/10 text-black hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-white/10 text-black hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/10 rounded-lg mt-2">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="block px-3 py-2 text-black font-medium hover:bg-purple-500/30 hover:text-purple-200 transition-all duration-300 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
