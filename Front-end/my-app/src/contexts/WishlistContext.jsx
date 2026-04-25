'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { API } from '@/lib/axios'
import { useAuth } from '@/contexts/AuthContext'

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [wishlistMap, setWishlistMap] = useState({}) // For quick O(1) lookups

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlistItems([])
      setWishlistMap({})
      return
    }
    setLoading(true)
    try {
      const { data } = await API.get('/api/wishlist')
      const items = Array.isArray(data) ? data : data.products || []
      setWishlistItems(items)
      
      const map = {}
      items.forEach(item => {
        map[item._id] = true
      })
      setWishlistMap(map)
    } catch (error) {
      console.error('Failed to fetch wishlist:', error)
      setWishlistItems([])
      setWishlistMap({})
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])


  const addToWishlist = async (productId) => {
    try {
      await API.post(`/api/wishlist/${productId}`)
      setWishlistMap(prev => ({ ...prev, [productId]: true }))
      
      fetchWishlist()
      return true
    } catch (error) {
      console.error('Failed to add to wishlist:', error)
      return false
    }
  }

  
  const removeFromWishlist = async (productId) => {
    try {
      await API.delete(`/api/wishlist/${productId}`)
      setWishlistMap(prev => {
        const map = { ...prev }
        delete map[productId]
        return map
      })
      setWishlistItems(prev => prev.filter(item => item._id !== productId))
      return true
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
      return false
    }
  }

 
  const toggleWishlist = async (productId) => {
    if (wishlistMap[productId]) {
      return removeFromWishlist(productId)
    } else {
      return addToWishlist(productId)
    }
  }

  
  const isInWishlist = (productId) => {
    return !!wishlistMap[productId]
  }

  const itemCount = wishlistItems.length

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      loading,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      itemCount,
      fetchWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return context
}
