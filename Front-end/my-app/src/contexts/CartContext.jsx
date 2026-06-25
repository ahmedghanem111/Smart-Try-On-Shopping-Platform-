'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { API } from '@/lib/axios'
import { useAuth } from '@/contexts/AuthContext'

const CartContext = createContext()

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchCart = useCallback(async () => {
    if (!user) { setCartItems([]); return }
    setLoading(true)
    try {
      const { data } = await API.get('/api/cart')
      setCartItems(data.cartItems || [])
    } catch {
      setCartItems([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetchCart() }, [fetchCart])

  const persist = async (items) => {
    if (!user) return
    try {
      await API.post('/api/cart', { cartItems: items })
    } catch (err) {
      console.error('Cart sync failed', err)
    }
  }

  const addToCart = async (product, qty = 1, color = null, size = null) => {
    setCartItems(prev => {
      // Treat same product with different color OR size as a separate cart entry
      const existing = prev.find(i =>
        (i.product === product._id || i.product?._id === product._id) &&
        (i.color ?? null) === (color ?? null) &&
        (i.size ?? null) === (size ?? null)
      )
      let updated
      if (existing) {
        updated = prev.map(i =>
          (i.product === product._id || i.product?._id === product._id) &&
          (i.color ?? null) === (color ?? null) &&
          (i.size ?? null) === (size ?? null)
            ? { ...i, qty: i.qty + qty }
            : i
        )
      } else {
        updated = [
          ...prev,
          {
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            qty,
            ...(color ? { color } : {}),
            ...(size ? { size } : {}),
          },
        ]
      }
      persist(updated)
      return updated
    })
  }

  const updateQty = async (productId, qty, color = null, size = null) => {
    if (qty < 1) return removeFromCart(productId, color, size)
    setCartItems(prev => {
      const updated = prev.map(i =>
        (i.product === productId || i.product?._id === productId) &&
        (i.color ?? null) === (color ?? null) &&
        (i.size ?? null) === (size ?? null)
          ? { ...i, qty }
          : i
      )
      persist(updated)
      return updated
    })
  }

  const removeFromCart = async (productId, color = null, size = null) => {
    setCartItems(prev => {
      const updated = prev.filter(i =>
        !((i.product === productId || i.product?._id === productId) &&
          (i.color ?? null) === (color ?? null) &&
          (i.size ?? null) === (size ?? null))
      )
      persist(updated)
      return updated
    })
  }

  const clearCart = async () => {
    setCartItems([])
    if (user) {
      try { await API.post('/api/cart', { cartItems: [] }) } catch {}
    }
  }

  const itemCount = cartItems.reduce((sum, i) => sum + i.qty, 0)
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      itemCount,
      subtotal,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
