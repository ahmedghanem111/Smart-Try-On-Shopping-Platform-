'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaTshirt, FaRulerCombined, FaShoppingBag, FaChartLine, FaUndo, FaGlobe, FaBolt, FaChartBar, FaLink, FaPaintBrush, FaFlask, FaUsers } from 'react-icons/fa'

const userCategories = [
  {
    id: 1,
    title: 'Online Shoppers',
    subtitle: 'Shop smarter with virtual try-on technology',
    image: '/onlineshop.png',
    features: [
      {
        icon: FaTshirt,
        title: 'Try Clothes Before Buying',
        description: 'Use our 3D try-on technology to see how clothes look on you before making a purchase.'
      },
      {
        icon: FaRulerCombined,
        title: 'Find the Perfect Fit',
        description: 'Preview sizes and styles virtually to choose the best fit with confidence.'
      },
      {
        icon: FaShoppingBag,
        title: 'Shop with Confidence',
        description: 'Reduce guesswork and enjoy a smarter, more reliable online shopping experience.'
      }
    ],
    tags: ['VIRTUAL TRY ON', 'SMART SHOPPING', '3D EXPERIENCE'],
    gradient: 'from-purple-600 to-blue-600',
    borderColor: 'border-purple-500/30',
    bgGradient: 'from-purple-500/10 to-blue-500/10'
  },
  {
    id: 2,
    title: 'Fashion Brands',
    subtitle: 'Showcase your products with immersive technology',
    image: '/Fashonbrand.png',
    features: [
      {
        icon: FaChartLine,
        title: 'Increase Sales & Engagement',
        description: 'Interactive 3D try-on attracts customers and increases purchase confidence.'
      },
      {
        icon: FaUndo,
        title: 'Reduce Product Returns',
        description: 'Help customers choose the right size and style before buying.'
      },
      {
        icon: FaGlobe,
        title: 'Stand Out in the Market',
        description: 'Offer an innovative shopping experience that makes your brand more competitive.'
      }
    ],
    tags: ['BRAND EXPERIENCE', 'CUSTOMER ENGAGEMENT', 'SALES GROWTH'],
    gradient: 'from-blue-600 to-cyan-600',
    borderColor: 'border-blue-500/30',
    bgGradient: 'from-blue-500/10 to-cyan-500/10'
  },
  {
    id: 3,
    title: 'E-Commerce Platforms',
    subtitle: 'Upgrade your online store with 3D virtual fitting',
    image: '/platform.png',
    features: [
      {
        icon: FaBolt,
        title: 'Next-Generation Shopping',
        description: 'Transform traditional product pages into interactive 3D experiences.'
      },
      {
        icon: FaChartBar,
        title: 'Boost Conversion Rates',
        description: 'Customers who can try products virtually are more likely to buy.'
      },
      {
        icon: FaLink,
        title: 'Easy Integration',
        description: 'Seamlessly integrate virtual try-on into your existing e-commerce platform.'
      }
    ],
    tags: ['E-COMMERCE', 'CONVERSION BOOST', '3D TECHNOLOGY'],
    gradient: 'from-violet-600 to-purple-600',
    borderColor: 'border-violet-500/30',
    bgGradient: 'from-violet-500/10 to-purple-500/10'
  },
  {
    id: 4,
    title: 'Fashion Designers',
    subtitle: 'Visualize and present designs in a new digital way',
    image: '/fashondesign.png',
    features: [
      {
        icon: FaPaintBrush,
        title: 'Show Designs in 3D',
        description: 'Present your clothing collections using realistic 3D models.'
      },
      {
        icon: FaFlask,
        title: 'Experiment with Styles',
        description: 'Test different designs and styles virtually before production.'
      },
      {
        icon: FaUsers,
        title: 'Reach a Global Audience',
        description: 'Share your designs online and let users try them instantly.'
      }
    ],
    tags: ['DIGITAL FASHION', '3D DESIGN', 'GLOBAL REACH'],
    gradient: 'from-orange-600 to-red-600',
    borderColor: 'border-orange-500/30',
    bgGradient: 'from-orange-500/10 to-red-500/10'
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }
  }
}

const WhoUsesOurAI = () => {
  return (
    <section className="relative py-28 overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 right-1/4 w-96 h-96 bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-80 h-80 bg-blue-300/20 dark:bg-blue-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
      
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 dark:text-white leading-tight mb-4">
          Who Benefits from <span className='italic underline underline-offset-8 decoration-gray-100 dark:decoration-slate-700'> Our Platform</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Discover how different teams leverage our fashion AI capabilities for their specific needs
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {userCategories.map((category) => (
            <motion.div
              key={category.id}
              variants={cardVariants}
              className="group relative h-full"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`relative h-full rounded-2xl overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border ${category.borderColor} shadow-lg hover:shadow-2xl transition-all duration-300 font-serif`}>
                
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover"
                  />
            
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  
                  <div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                      {category.title}
                    </h3>
                    <p className="text-base text-slate-600 dark:text-slate-400">
                      {category.subtitle}
                    </p>
                  </div>
                  <div className="space-y-4">
                    {category.features.map((feature, idx) => {
                      const FeatureIcon = feature.icon
                      return (
                        <div key={idx} className="flex gap-4">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                            <FeatureIcon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                              {feature.title}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {category.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-1.5 text-sm font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}

export default WhoUsesOurAI
