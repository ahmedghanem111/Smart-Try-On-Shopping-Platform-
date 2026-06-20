'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

// ─── Brand data ───────────────────────────────────────────────────────────────
const FEATURED_BRANDS = [
  {
    name: 'Fitme Originals',
    tag: 'Local Brand',
    category: 'Clothing & Accessories',
    description: 'Our own in-house line — designed in Egypt, crafted for everyday style. From lightweight tees to statement accessories, every piece is made with local artisans.',
    local: true,
  },
  {
    name: 'GradBrand',
    tag: 'Local Brand',
    category: 'Casual Wear',
    description: 'A homegrown label born out of a graduation project turned fashion movement. Comfortable cuts, bold prints, and proudly Egyptian-made.',
    local: true,
  },
  {
    name: 'Levis',
    tag: 'International',
    category: 'Denim & Bottoms',
    description: 'The original denim icon since 1853. Classic fits, modern cuts, and timeless quality that never goes out of style.',
    local: false,
  },
  {
    name: 'Nike',
    tag: 'International',
    category: 'Footwear & Sportswear',
    description: 'Just Do It. From performance running shoes to streetwear, Nike brings innovation and style to every step.',
    local: false,
  },
  {
    name: 'Gucci',
    tag: 'International',
    category: 'Luxury Footwear',
    description: 'Italian luxury at its finest. Gucci shoes are a statement — bold, crafted, and unmistakably iconic.',
    local: false,
  },
  {
    name: 'Fossil',
    tag: 'International',
    category: 'Watches',
    description: 'American-crafted timepieces that blend vintage design with modern movement. Reliable, stylish, and made to last.',
    local: false,
  },
  {
    name: 'Pandora',
    tag: 'International',
    category: 'Jewellery',
    description: 'Handcrafted jewellery that tells your story. From charm bracelets to delicate necklaces, Pandora celebrates every moment.',
    local: false,
  },
  {
    name: 'Burberry',
    tag: 'International',
    category: 'Scarves & Outerwear',
    description: 'The iconic British check. Burberry scarves are the gold standard — warm, elegant, and instantly recognisable.',
    local: false,
  },
  {
    name: 'Coach',
    tag: 'International',
    category: 'Bags & Leather Goods',
    description: 'New York-born, globally loved. Coach crafts leather goods that age beautifully and carry everything that matters.',
    local: false,
  },
]

const LOCAL_BRANDS = FEATURED_BRANDS.filter(b => b.local)
const GLOBAL_BRANDS = FEATURED_BRANDS.filter(b => !b.local)

// ─── Helpers ──────────────────────────────────────────────────────────────────
function BrandCard({ brand, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-slate-900 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300"
    >
      {/* Avatar / monogram */}
      <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-5 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors duration-300">
        <span className="text-xl font-serif font-bold text-slate-700 dark:text-slate-200 select-none">
          {brand.name[0]}
        </span>
      </div>

      {/* Tags row */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className={`inline-block px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${
          brand.local
            ? 'border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400'
            : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400'
        }`}>
          {brand.tag}
        </span>
        <span className="inline-block px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-full border border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500">
          {brand.category}
        </span>
      </div>

      {/* Name */}
      <h3 className="text-lg font-serif font-semibold text-slate-900 dark:text-white mb-2">
        {brand.name}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
        {brand.description}
      </p>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BrandsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">

      {/* ── Hero ── */}
      <section className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-5"
          >
            <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-wider text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-full">
              OUR BRANDS
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-normal text-slate-900 dark:text-white">
              Brands We Carry
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              From iconic international names to homegrown Egyptian labels — every brand on Fitme is here because it earns its place.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Local brands spotlight ── */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold tracking-widest uppercase text-emerald-600 dark:text-emerald-400">
                  Supporting Local
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-slate-900 dark:text-white">
                Local Brands
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-lg">
                We proudly support Egyptian and local designers. Every purchase from a local brand goes directly back into the community.
              </p>
            </div>
          </motion.div>

          {/* Local brand banner */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative mb-10 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-50 to-slate-50 dark:from-emerald-900/20 dark:to-slate-800/40 border border-emerald-100 dark:border-emerald-800/30 p-8 sm:p-10"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative max-w-2xl">
              <p className="text-xs font-semibold tracking-widest uppercase text-emerald-600 dark:text-emerald-400 mb-3">
                Why Local?
              </p>
              <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
                "Supporting local brands isn't just shopping — it's investing in the makers, the craft, and the culture around us. Fitme partners with Egyptian designers to give local talent a global-quality platform."
              </p>
              <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                — Fitme Team
              </p>
            </div>
          </motion.div>

          {/* Local brand cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {LOCAL_BRANDS.map((brand, i) => (
              <BrandCard key={brand.name} brand={brand} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-slate-200 dark:border-slate-800" />

      {/* ── Global brands ── */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 dark:text-white mb-2">
              International Brands
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg">
              The world's best labels, curated and verified — so you always know you're getting the real thing.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {GLOBAL_BRANDS.map((brand, i) => (
              <BrandCard key={brand.name} brand={brand} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── By the numbers ── */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 dark:text-white">
              By the Numbers
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '9+',   label: 'Brands & Counting' },
              { value: '2',    label: 'Local Egyptian Labels' },
              { value: '7',    label: 'International Names' },
              { value: '100%', label: 'Authenticity Guaranteed' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="text-center"
              >
                <p className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partner with us ── */}
      <section className="relative py-24 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-400/10 dark:bg-emerald-600/15 rounded-full blur-3xl"
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
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold tracking-widest text-slate-500 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-full bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              ARE YOU A LOCAL BRAND?
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 dark:text-white leading-tight mb-6"
          >
            Grow with Fitme.<br />
            <span className="text-emerald-600 dark:text-emerald-400 italic">We support local.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto leading-relaxed mb-10"
          >
            If you're a local designer or brand looking to reach more customers and offer virtual try-on technology, get in touch — we'd love to partner with you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-full hover:bg-slate-700 dark:hover:bg-slate-100 transition-colors duration-200 shadow-lg shadow-black/10"
            >
              Partner with Us
              <span className="text-lg">→</span>
            </Link>
            <Link
              href="/product"
              className="inline-flex items-center gap-3 px-8 py-4 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200"
            >
              Shop All Products
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
