'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { API } from '@/lib/axios'

const PAYMENT_LABELS = {
  cash: 'Cash on Delivery',
  card: 'Credit / Debit Card',
  paypal: 'PayPal',
}

function StatusBadge({ label, active, date }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${
      active
        ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
        : 'border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
      <span>{label}</span>
      {active && date && <span className="opacity-70">· {new Date(date).toLocaleDateString()}</span>}
    </div>
  )
}

export default function OrderPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [markingPaid, setMarkingPaid] = useState(false)

  const loadOrder = async () => {
    setLoading(true)
    try {
      const { data } = await API.get(`/api/orders/${id}`)
      setOrder(data)
    } catch {
      toast.error('Order not found.')
      router.push('/profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    if (id) loadOrder()
  }, [id, user])

  const handleMarkPaid = async () => {
    setMarkingPaid(true)
    try {
      await API.put(`/api/orders/${id}/pay`)
      toast.success('Order marked as paid!')
      loadOrder()
    } catch {
      toast.error('Failed to update payment status.')
    } finally {
      setMarkingPaid(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-slate-300 dark:border-slate-600 border-t-slate-900 dark:border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  if (!order) return null

  const subtotal = order.itemsPrice
  const shipping = order.shippingPrice
  const tax = order.taxPrice
  const total = order.totalPrice

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">

      {/* Breadcrumb */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/profile" className="hover:text-slate-900 dark:hover:text-white transition-colors">Orders</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white truncate max-w-[140px]">{order._id}</span>
        </div>
      </div>

      {/* Steps */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase">
            <span className="text-slate-400 dark:text-slate-500">1. Cart</span>
            <span className="text-slate-300 dark:text-slate-600">—</span>
            <span className="text-slate-400 dark:text-slate-500">2. Checkout</span>
            <span className="text-slate-300 dark:text-slate-600">—</span>
            <span className="text-slate-900 dark:text-white">3. Confirmation</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Success banner */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 p-5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="font-serif text-lg text-emerald-800 dark:text-emerald-300">Order Confirmed</h2>
            <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-0.5">
              Thank you for your order! Your order ID is <span className="font-mono font-semibold">{order._id}</span>
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">

          {/* ── Left: Details ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Status row */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6"
            >
              <h3 className="font-serif text-base text-slate-900 dark:text-white mb-4">Order Status</h3>
              <div className="flex flex-wrap gap-2">
                <StatusBadge label="Order Placed" active date={order.createdAt} />
                <StatusBadge label="Paid" active={order.isPaid} date={order.paidAt} />
                <StatusBadge label="Delivered" active={order.isDelivered} date={order.deliveredAt} />
              </div>

              {/* Mark as paid — shown for cash orders that aren't paid yet */}
              {order.paymentMethod === 'cash' && !order.isPaid && (
                <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-700">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                    This is a cash on delivery order. Mark it as paid once payment is received.
                  </p>
                  <button
                    onClick={handleMarkPaid}
                    disabled={markingPaid}
                    className="px-5 py-2.5 text-sm font-medium tracking-wider bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    {markingPaid ? 'Updating...' : 'Mark as Paid'}
                  </button>
                </div>
              )}
            </motion.div>

            {/* Shipping address */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6"
            >
              <h3 className="font-serif text-base text-slate-900 dark:text-white mb-3">Shipping Address</h3>
              <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </motion.div>

            {/* Payment method */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6"
            >
              <h3 className="font-serif text-base text-slate-900 dark:text-white mb-3">Payment Method</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
              </p>
            </motion.div>

            {/* Order items */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6"
            >
              <h3 className="font-serif text-base text-slate-900 dark:text-white mb-5">Items Ordered</h3>
              <div className="space-y-4">
                {order.orderItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                      {item.image
                        ? <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                        : <div className="w-full h-full flex items-center justify-center"><svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.product}`} className="text-sm font-medium text-slate-900 dark:text-white hover:text-slate-600 dark:hover:text-slate-300 transition-colors truncate block">
                        {item.name}
                      </Link>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.qty} × {item.price} EGP
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white flex-shrink-0">
                      {(item.qty * item.price).toFixed(2)} EGP
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Right: Price summary ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:sticky lg:top-24 space-y-4"
          >
            <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-4">
              <h2 className="font-serif text-xl text-slate-900 dark:text-white">Price Breakdown</h2>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span>{Number(subtotal).toFixed(2)} EGP</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-emerald-600 dark:text-emerald-400">Free</span> : `${Number(shipping).toFixed(2)} EGP`}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Tax (14% VAT)</span>
                  <span>{Number(tax).toFixed(2)} EGP</span>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-2.5 flex justify-between font-semibold text-slate-900 dark:text-white text-base">
                  <span>Total</span>
                  <span>{Number(total).toFixed(2)} EGP</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/product"
                className="block w-full py-3 text-sm font-medium tracking-widest uppercase text-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:opacity-90 transition-all"
              >
                Continue Shopping
              </Link>
              <Link
                href="/profile"
                className="block w-full py-3 text-sm font-medium tracking-widest uppercase text-center border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                View All Orders
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
