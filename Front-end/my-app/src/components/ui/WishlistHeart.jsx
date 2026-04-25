'use client'

import { useState } from 'react'
import { useWishlist } from '@/contexts/WishlistContext'
import { useAuth } from '@/contexts/AuthContext'

export default function WishlistHeart({ productId, size = 'md' }) {
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const isFilled = isInWishlist(productId)

  const handleClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      
      return
    }

    setLoading(true)
    try {
      await toggleWishlist(productId)
    } finally {
      setLoading(false)
    }
  }

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading || !user}
      className="relative inline-flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={isFilled ? 'Remove from wishlist' : 'Add to wishlist'}
      title={!user ? 'Sign in to add to wishlist' : undefined}
    >
      <svg
        className={`${sizeClasses[size]} transition-all duration-300 ${
          isFilled
            ? 'text-red-500 fill-red-500'
            : 'text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-500 stroke-current fill-none'
        }`}
        strokeWidth={isFilled ? 0 : 2}
        viewBox="0 0 24 24"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full rounded-full border border-transparent border-t-red-500 animate-spin" />
        </div>
      )}
    </button>
  )
}
