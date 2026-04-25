'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useWishlist } from '@/contexts/WishlistContext'
import { useAuth } from '@/contexts/AuthContext'
import WishlistHeart from '@/components/ui/WishlistHeart'

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function WishlistPage() {
  const { wishlistItems, loading, removeFromWishlist } = useWishlist()
  const { user, loading: authLoading } = useAuth()
  const [error, setError] = useState(null)
  const [removingId, setRemovingId] = useState(null)

  const handleRemove = async (productId) => {
    setRemovingId(productId)
    try {
      await removeFromWishlist(productId)
    } catch (err) {
      setError('Failed to remove item from wishlist')
    } finally {
      setRemovingId(null)
    }
  }

 
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="w-10 h-10 border-2 border-slate-300 dark:border-slate-600 border-t-slate-900 dark:border-t-white rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-400 dark:text-slate-500">Loading wishlist...</p>
        </div>
      </div>
    )
  }

  
  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col items-center justify-center gap-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-serif text-slate-900 dark:text-white">Your Wishlist</h1>
          <p className="text-slate-600 dark:text-slate-400">Sign in to view and manage your wishlist</p>
        </div>
        <Link
          href="/auth/login"
          className="px-8 py-3 text-sm font-medium tracking-wider bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity rounded-xl"
        >
          Sign In
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-slate-900 dark:text-white">
              Your Wishlist
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {wishlistItems.length === 0
                ? 'No items yet. Start building your perfect collection!'
                : `You have ${wishlistItems.length} item${wishlistItems.length !== 1 ? 's' : ''} saved`}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-slate-50 dark:bg-slate-800/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          {wishlistItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="mb-6 flex justify-center">
                <svg className="w-16 h-16 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                Your wishlist is empty
              </p>
              <Link
                href="/product"
                className="inline-block px-8 py-3 text-sm font-medium tracking-wider bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity rounded-xl"
              >
                CONTINUE SHOPPING
              </Link>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((product, index) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-slate-200/60 dark:hover:shadow-slate-900 transition-all duration-300"
                >
                  {/* Product Image */}
                  <div className="aspect-square relative bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    
                    {/* Wishlist Button */}
                    <div className="absolute top-3 right-3 z-20">
                      <WishlistHeart productId={product._id} size="md" />
                    </div>

                    {/* Out of Stock Overlay */}
                    {product.countInStock === 0 && (
                      <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 flex items-center justify-center">
                        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-block px-2 py-1 text-[9px] uppercase tracking-[0.2em] font-semibold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-full">
                        {product.category}
                      </span>
                      <StarRating rating={product.rating || 0} />
                    </div>
                    
                    <h4 className="text-lg font-serif text-slate-900 dark:text-white mb-1 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors line-clamp-2">
                      {product.name}
                    </h4>
                    
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-widest">
                      {product.brand || 'Brand'}
                    </p>

                    <div className="flex items-center justify-between">
                      <p className="text-lg font-medium text-slate-900 dark:text-white">
                        {product.price} EGP
                      </p>
                      <Link
                        href={`/product/${product._id}`}
                        className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap"
                      >
                        Details →
                      </Link>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemove(product._id)}
                      disabled={removingId === product._id}
                      className="w-full mt-4 py-2.5 text-xs font-medium tracking-wider text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                      {removingId === product._id ? 'REMOVING...' : 'REMOVE'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
