'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { API } from '@/lib/axios'

const TAX_RATE = 0.14

const PAYMENT_METHODS = [
  {
    id: 'cash',
    label: 'Cash on Delivery',
    description: 'Pay when your order arrives',
    icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
  },
  {
    id: 'card',
    label: 'Credit / Debit Card',
    description: 'Visa, Mastercard, and more',
    icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  },
  {
    id: 'paypal',
    label: 'PayPal',
    description: 'Fast and secure PayPal checkout',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
]

const INPUT = 'w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-slate-400 dark:focus:border-slate-500 transition-colors'

export default function CheckoutPage() {
  const { cartItems, itemCount, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [placing, setPlacing] = useState(false)
  const [address, setAddress] = useState({ address: '', city: '', postalCode: '', country: 'Egypt' })
  const [errors, setErrors] = useState({})

  const shipping = subtotal > 500 ? 0 : 50
  const tax = parseFloat((subtotal * TAX_RATE).toFixed(2))
  const total = subtotal + shipping + tax

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    if (cartItems.length === 0) { router.push('/cart') }
  }, [user, cartItems, router])

  const validate = () => {
    const e = {}
    if (!address.address.trim()) e.address = 'Address is required'
    if (!address.city.trim()) e.city = 'City is required'
    if (!address.postalCode.trim()) e.postalCode = 'Postal code is required'
    if (!address.country.trim()) e.country = 'Country is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handlePlaceOrder = async () => {
    if (!validate()) return
    setPlacing(true)
    try {
      const orderItems = cartItems.map(i => ({
        name: i.name,
        qty: i.qty,
        image: i.image,
        price: i.price,
        product: i.product?._id || i.product,
      }))
      const { data } = await API.post('/api/orders', {
        orderItems,
        shippingAddress: address,
        paymentMethod,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total,
      })
      await clearCart()
      toast.success('Order placed successfully!')
      router.push(`/order/${data._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order.')
    } finally {
      setPlacing(false)
    }
  }

  if (!user || cartItems.length === 0) return null

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">

      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-slate-900 dark:hover:text-white transition-colors">Cart</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white">Checkout</span>
        </div>
      </div>

      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase">
            <Link href="/cart" className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">1. Cart</Link>
            <span className="text-slate-300 dark:text-slate-600">—</span>
            <span className="text-slate-900 dark:text-white">2. Checkout</span>
            <span className="text-slate-300 dark:text-slate-600">—</span>
            <span className="text-slate-400 dark:text-slate-500">3. Confirmation</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12 items-start">

          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl font-serif text-slate-900 dark:text-white mb-8">Checkout</h1>

              <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-5">
                <h2 className="font-serif text-lg text-slate-900 dark:text-white">Shipping Address</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Street Address</label>
                    <input
                      value={address.address}
                      onChange={e => setAddress(a => ({ ...a, address: e.target.value }))}
                      placeholder="123 Main Street, Apt 4B"
                      className={`${INPUT} ${errors.address ? 'border-red-400' : ''}`}
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">City</label>
                    <input
                      value={address.city}
                      onChange={e => setAddress(a => ({ ...a, city: e.target.value }))}
                      placeholder="Cairo"
                      className={`${INPUT} ${errors.city ? 'border-red-400' : ''}`}
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Postal Code</label>
                    <input
                      value={address.postalCode}
                      onChange={e => setAddress(a => ({ ...a, postalCode: e.target.value }))}
                      placeholder="11511"
                      className={`${INPUT} ${errors.postalCode ? 'border-red-400' : ''}`}
                    />
                    {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Country</label>
                    <input
                      value={address.country}
                      onChange={e => setAddress(a => ({ ...a, country: e.target.value }))}
                      placeholder="Egypt"
                      className={`${INPUT} ${errors.country ? 'border-red-400' : ''}`}
                    />
                    {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-4 mt-6">
                <h2 className="font-serif text-lg text-slate-900 dark:text-white">Payment Method</h2>

                <div className="space-y-3">
                  {PAYMENT_METHODS.map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        paymentMethod === method.id
                          ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        paymentMethod === method.id
                          ? 'border-slate-900 dark:border-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {paymentMethod === method.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 dark:bg-white" />
                        )}
                      </div>

                      <svg className="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={method.icon} />
                      </svg>

                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{method.label}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{method.description}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {(paymentMethod === 'card' || paymentMethod === 'paypal') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl"
                  >
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      {paymentMethod === 'card'
                        ? 'Card payment will be collected at the time of delivery or via a secure link sent to your email after order confirmation.'
                        : 'A PayPal payment link will be sent to your registered email after order confirmation.'}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:sticky lg:top-24 space-y-4"
          >
            <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-5">
              <h2 className="font-serif text-xl text-slate-900 dark:text-white">Order Summary</h2>

              <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                {cartItems.map(item => {
                  const productId = item.product?._id || item.product
                  return (
                    <div key={productId} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                        {item.image
                          ? <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                          : <div className="w-full h-full flex items-center justify-center"><svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                        }
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[9px] font-bold rounded-full flex items-center justify-center">{item.qty}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900 dark:text-white truncate">{item.name}</p>
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white flex-shrink-0">{(item.price * item.qty).toFixed(2)} EGP</span>
                    </div>
                  )
                })}
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
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
                <div className="border-t border-slate-200 dark:border-slate-700 pt-2.5 flex justify-between font-semibold text-slate-900 dark:text-white text-base">
                  <span>Total</span>
                  <span>{total.toFixed(2)} EGP</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="w-full py-3.5 text-sm font-medium tracking-widest uppercase bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:opacity-90 active:scale-[0.98] disabled:opacity-50 transition-all"
              >
                {placing ? 'Placing Order...' : 'Place Order'}
              </button>

              <p className="text-xs text-center text-slate-400 dark:text-slate-500">
                By placing your order you agree to our{' '}
                <span className="text-slate-600 dark:text-slate-300">Terms & Conditions</span>
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
