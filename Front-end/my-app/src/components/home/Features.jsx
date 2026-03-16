'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
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
    image: '/b1.png',
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
    image: '/f3.png',
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
    image: '/f4.png',
  }
]

const StackedCard = ({ feature, index, totalCards }) => {
  const cardRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"]
  })

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1])
  

  return (
    <motion.div
      ref={cardRef}
      style={{
        scale,
        top: `${index * 80}px`,
      }}
      className="sticky  top-24 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm"
    >
      <div className="grid md:grid-cols-2 gap-0">
        <div className="relative h-[400px] md:h-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
          <Image
            src={feature.image}
            alt={feature.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-6 left-6">
            <span className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-4 py-2 text-[10px] uppercase tracking-[0.3em] font-semibold text-black dark:text-white border border-gray-200 dark:border-slate-600 rounded-full">
              {feature.category}
            </span>
          </div>
        </div>

        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            {feature.title}
          </h3>

          <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-8">
            {feature.description}
          </p>

          <div className="space-y-4">
            {feature.points.map((point, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-[7px] w-2 h-2 rounded-full bg-slate-900 dark:bg-slate-300 flex-shrink-0" />
                <span className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  {point}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const Features = () => {
  return (
    <section className="bg-gray-100 dark:bg-slate-900 py-32 px-6">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-20 space-y-4">
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

        <div className="space-y-32">
          {features.map((feature, index) => (
            <StackedCard 
              key={feature.id} 
              feature={feature} 
              index={index}
              totalCards={features.length}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features