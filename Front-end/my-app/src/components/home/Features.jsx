'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

const features = [
  {
    id: 0,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Real-time AI Try-On',
    description: 'Experience clothes on your body instantly using advanced AI technology. No waiting, no guesswork.',
    gradient: 'from-purple-500 to-blue-500',
    border: 'border-purple-200 dark:border-purple-800/50',
    iconBg: 'bg-purple-100 dark:bg-purple-900/40',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    id: 1,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    title: 'Accessibility-Friendly',
    description: 'Built with everyone in mind. High contrast modes, voice assist, and intuitive controls for all users.',
    gradient: 'from-violet-500 to-purple-600',
    border: 'border-violet-300 dark:border-violet-700/60',
    iconBg: 'bg-violet-100 dark:bg-violet-900/40',
    iconColor: 'text-violet-600 dark:text-violet-400',
    featured: true,
  },
  {
    id: 2,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m1.636 6.364l.707-.707M12 21v-1M7.05 7.05l-.707-.707M17 12a5 5 0 11-10 0 5 5 0 0110 0z" />
      </svg>
    ),
    title: 'Smart Recommendations',
    description: 'AI-powered suggestions based on your style, body measurements, and shopping preferences.',
    gradient: 'from-blue-500 to-cyan-500',
    border: 'border-blue-200 dark:border-blue-800/50',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 3,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Lightning Fast',
    description: 'Instant processing and rendering. See results in real-time as you browse through products.',
    gradient: 'from-amber-500 to-orange-500',
    border: 'border-amber-200 dark:border-amber-800/50',
    iconBg: 'bg-amber-100 dark:bg-amber-900/40',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    id: 4,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Social Shopping',
    description: 'Share your try-ons with friends, get feedback, and discover trending styles in your community.',
    gradient: 'from-pink-500 to-rose-500',
    border: 'border-pink-200 dark:border-pink-800/50',
    iconBg: 'bg-pink-100 dark:bg-pink-900/40',
    iconColor: 'text-pink-600 dark:text-pink-400',
  },
  {
    id: 5,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Size Accuracy',
    description: 'Our AI learns your perfect fit and recommends the right size every time you shop.',
    gradient: 'from-green-500 to-emerald-500',
    border: 'border-green-200 dark:border-green-800/50',
    iconBg: 'bg-green-100 dark:bg-green-900/40',
    iconColor: 'text-green-600 dark:text-green-400',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] },
  },
}

const Features = () => {
  const [activeId, setActiveId] = useState(1)

  return (
    <section className="relative py-28 overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/20 dark:from-slate-950 dark:via-purple-950/20 dark:to-blue-950/10">

      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/30 dark:bg-purple-700/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-200/30 dark:bg-blue-700/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 border border-purple-300/30 dark:border-purple-500/30 backdrop-blur-sm">
            <span className="text-lg">✨</span>
            <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </span>

          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
            Everything You Need for the
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 dark:from-purple-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Perfect Shopping Experience
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Our platform combines cutting-edge AI with intuitive design to revolutionize how you shop for clothes online.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {features.map((feature) => {
            const isActive = activeId === feature.id

            return (
              <motion.div
                key={feature.id}
                variants={cardVariants}
                onClick={() => setActiveId(feature.id)}
                className="relative group cursor-pointer rounded-2xl p-[2px] transition-all duration-300"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
              >
                {/* Gradient border wrapper — always visible on active, appears on hover for others */}
                <div className={`
                  absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} transition-opacity duration-300
                  ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                `} />

                {/* Faint border fallback when not hovered/active */}
                <div className={`
                  absolute inset-0 rounded-2xl border transition-opacity duration-300
                  ${feature.border}
                  ${isActive || false ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'}
                `} />

                {/* Inner card */}
                <div className={`
                  relative rounded-[14px] p-6 transition-all duration-300
                  bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm
                  ${isActive ? 'shadow-xl' : 'group-hover:shadow-lg'}
                `}>
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${feature.iconBg} ${feature.iconColor}`}>
                    {feature.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold mb-2 text-slate-900 dark:text-slate-100">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {feature.description}
                  </p>

                  {/* Active indicator bar */}
                  {isActive && (
                    <motion.div
                      className={`absolute bottom-0 left-6 right-6 h-[3px] rounded-full bg-gradient-to-r ${feature.gradient}`}
                      layoutId="activeBar"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}

export default Features