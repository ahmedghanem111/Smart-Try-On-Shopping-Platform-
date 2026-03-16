'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const CTASection = () => {
  return (
    <section className="relative py-28 overflow-hidden bg-slate-100 dark:bg-slate-800">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-400/10 dark:bg-purple-600/15 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold tracking-widest text-slate-500 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-full bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse" />
            TRANSFORM YOUR SHOPPING
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 dark:text-white leading-tight mb-6"
        >
          Looking for your{' '}
          <span className="text-blue-700 dark:text-blue-400 italic">perfect fit?</span>{' '}
          Try Fitme.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto leading-relaxed mb-10"
        >
          Experience the future of fashion shopping with AI-powered virtual try-ons. Shop with absolute confidence and eliminate returns forever.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <Link
            href="/product"
            className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-full hover:bg-slate-700 dark:hover:bg-slate-100 transition-colors duration-200 shadow-lg shadow-black/10"
          >
            Start Shopping Now
            <span className="text-lg">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default CTASection
