'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'

const TAX_RATE = 0.14 // 14% VAT

export default function CartPage() {
  const { cartItems, itemCount, subtotal, updateQty, removeFromCart, clearCart, loading } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const shipping = subtotal > 500 ? 0 : 50
  const tax = parseFloat((subtotal * TAX_RATE).toFixed(2))
  const total = subtotal + shipping + tax

  const handleCheckout = () => {
    if (!user) { router.push('/login'); return }
    router.push('/checkout')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-slate-300 dark:border-slate-600 border-t-slate-900 dark:border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">

      {/* Breadcrumb */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white">Cart</span>
          {itemCount > 0 && (
            <span className="ml-1 text-slate-400 dark:text-slate-500">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          )}
        </div>
      </div>

      {/* Checkout steps */}
      {cartItems.length > 0 && (
        <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase">
              <span className="text-slate-900 dark:text-white">1. Cart</span>
              <span className="text-slate-300 dark:text-slate-600">—</span>
              <span className="text-slate-400 dark:text-slate-500">2. Checkout</span>
              <span className="text-slate-300 dark:text-slate-600">—</span>
              <span className="text-slate-400 dark:text-slate-500">3. Confirmation</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
              <svg className="w-9 h-9 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-serif text-slate-900 dark:text-white mb-2">Your cart is empty</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
              Looks like you haven't added anything yet. Browse our collection to find something you love.
            </p>
            <Link
              href="/product"
              className="px-8 py-3.5 text-sm font-medium tracking-widest uppercase bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:opacity-90 transition-all"
            >
              Browse Products
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12 items-start">

            {/* ── Cart items ── */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-serif text-slate-900 dark:text-white">Shopping Cart</h1>
                <button
                  onClick={clearCart}
                  className="text-xs text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors tracking-wider uppercase"
                >
                  Clear all
                </button>
              </div>

              <AnimatePresence initial={false}>
                {cartItems.map((item) => {
                  const productId = item.product?._id || item.product
                  return (
                    <motion.div
                      key={productId}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-5 p-5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl"
                    >
                      <Link href={`/product/${productId}`} className="flex-shrink-0">
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          {item.image ? (
                            <Image src={item.image} alt={item.name} fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="96px" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-8 h-8 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${productId}`}>
                          <h3 className="font-serif text-lg text-slate-900 dark:text-white hover:text-slate-600 dark:hover:text-slate-300 transition-colors truncate">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{item.price} EGP each</p>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden">
                            <button onClick={() => updateQty(productId, item.qty - 1)} className="px-3 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm" aria-label="Decrease">−</button>
                            <span className="px-4 py-1.5 text-sm font-medium text-slate-900 dark:text-white border-x border-slate-300 dark:border-slate-600 min-w-[2.5rem] text-center">{item.qty}</span>
                            <button onClick={() => updateQty(productId, item.qty + 1)} className="px-3 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm" aria-label="Increase">+</button>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-base font-semibold text-slate-900 dark:text-white">{(item.price * item.qty).toFixed(2)} EGP</span>
                            <button onClick={() => removeFromCart(productId)} className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors" aria-label="Remove">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>

              <div className="pt-4">
                <Link href="/product" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* ── Order summary ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:sticky lg:top-24 space-y-4">
              <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-5">
                <h2 className="font-serif text-xl text-slate-900 dark:text-white">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                    <span>{subtotal.toFixed(2)} EGP</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-emerald-600 dark:text-emerald-400">Free</span> : `${shipping.toFixed(2)} EGP`}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Tax (14% VAT)</span>
                    <span>{tax.toFixed(2)} EGP</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-slate-400 dark:text-slate-500">Free shipping on orders over 500 EGP</p>
                  )}
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between font-semibold text-slate-900 dark:text-white text-base">
                    <span>Total</span>
                    <span>{total.toFixed(2)} EGP</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 text-sm font-medium tracking-widest uppercase bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  Proceed to Checkout
                </button>

                {!user && (
                  <p className="text-xs text-center text-slate-400 dark:text-slate-500">
                    You'll be asked to{' '}
                    <Link href="/login" className="text-slate-700 dark:text-slate-300 underline underline-offset-4">login</Link>
                    {' '}before checkout
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'Secure Checkout' },
                  { icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', label: 'Easy Returns' },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
                    <svg className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                    </svg>
                    <span className="text-xs text-slate-600 dark:text-slate-400">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        )}
      </div>
    </div>
  )
}
