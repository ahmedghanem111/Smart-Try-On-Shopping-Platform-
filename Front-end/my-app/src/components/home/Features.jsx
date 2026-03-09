'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const features = [
  {
    id: 1,
    category: 'Personalization',
    title: 'Build Your Digital Body Profile',
    description: 'Create a personalized virtual fitting experience using your own body measurements and photo.',
    points: [
      'Upload a personal portrait photo',
      'Enter height and weight measurements',
      'Generate a digital body profile for accurate try-on'
    ],
    image: '/f1.jpeg',
  },
  {
    id: 2,
    category: 'AI Technology',
    title: 'AI Virtual Try-On',
    description: 'See how clothing items look on your real body using AI-powered image processing.',
    points: [
      'Upload your personal photo',
      'Overlay garments on your image',
      'Automatic scaling based on body shape'
    ],
    image: '/f2.jpeg',
  },
  {
    id: 3,
    category: '3D Experience',
    title: 'Interactive 3D Product Viewer',
    description: 'Explore clothing items from every angle before trying them on.',
    points: [
      'Rotate garments in 360°',
      'Zoom in to inspect fabric details',
      'Realistic visualization beyond static photos'
    ],
    image: '/f3.jpeg',
  },
  {
    id: 4,
    category: 'Smart Shopping',
    title: 'Smarter Online Shopping',
    description: 'Make confident purchase decisions using advanced visualization tools.',
    points: [
      'Reduce size uncertainty',
      'Minimize product returns',
      'Shop with greater confidence'
    ],
    image: '/f4.jpeg',
  }
]

const FeatureCard = ({ feature, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.12 }}
    viewport={{ once: true }}
    whileHover={{ y: -10 }}
    className="group bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden flex flex-col 
    shadow-sm hover:shadow-2xl transition-all duration-300"
  >
    <div className="relative h-64 w-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
      <Image
        src={feature.image}
        alt={feature.title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-700"
      />

      <div className="absolute top-4 left-4">
        <span className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-3 py-1 text-[10px] uppercase tracking-[0.3em] font-semibold text-black dark:text-white border border-gray-200 dark:border-slate-600 rounded-full">
          {feature.category}
        </span>
      </div>
    </div>

    <div className="p-10 flex flex-col flex-1">

      <h3 className="text-2xl md:text-3xl font-serif text-slate-900 dark:text-white mb-4 leading-snug">
        {feature.title}
      </h3>

      <p className="text-slate-500 dark:text-slate-400 text-sm md:text-xl leading-relaxed mb-6">
        {feature.description}
      </p>

      <div className="space-y-3 mt-auto">
        {feature.points.map((point, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="mt-[7px] w-2 h-2 rounded-full bg-slate-900 dark:bg-slate-300" />
            <span className="text-l text-slate-600 dark:text-slate-400 leading-relaxed">
              {point}
            </span>
          </div>
        ))}
      </div>

    </div>
  </motion.div>
)

const Features = () => {
  return (
    <section className="bg-[#fcfcfc] dark:bg-slate-900 py-32 px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-28 space-y-4">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] uppercase tracking-[0.4em] text-gray-400 dark:text-slate-500 block"
          >
            Capabilities
          </motion.span>
       <motion.h2
  initial={{ opacity: 0, y: 10 }}
  whileInView={{ opacity: 1, y: 0 }}
  className="text-5xl md:text-6xl font-serif text-slate-900 dark:text-white leading-tight"
>

            Redefining the <span className="italic underline underline-offset-8 decoration-gray-100 dark:decoration-slate-700">Fashion Landscape</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features