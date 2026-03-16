'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { API } from '@/lib/axios'

const statCards = (summary) => [
  {
    label: 'Total Revenue',
    value: `$${Number(summary?.totalSales || 0).toFixed(2)}`,
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    label: 'Total Orders',
    value: summary?.numOrders ?? '—',
    icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
  },
  {
    label: 'Total Users',
    value: summary?.userCount ?? '—',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    label: 'Total Products',
    value: summary?.productCount ?? '—',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [summary, setSummary] = useState(null)
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    if (!user.isAdmin) { router.push('/'); return }

    const fetchAll = async () => {
      try {
        const [sumRes, usersRes, prodsRes] = await Promise.all([
          API.get('/api/orders/summary'),
          API.get('/api/users'),
          API.get('/api/products'),
        ])
        setSummary(sumRes.data)
        setUsers(usersRes.data.slice(0, 6))
        setProducts(prodsRes.data.products?.slice(0, 6) ?? [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [user, router])

  if (!user || !user.isAdmin) return null

  return (
    <section className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 font-serif">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            <p className="text-base text-slate-500 dark:text-slate-400 mt-1">Welcome back, {user.name}</p>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
          >
            ← Back to site
          </Link>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards(summary).map(({ label, value, icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-4"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500">{label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {loading ? <span className="animate-pulse text-slate-300 dark:text-slate-600">···</span> : value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tables row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Users</h2>
              <span className="text-xs text-slate-400 dark:text-slate-500">Latest 6</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="px-6 py-4 flex items-center gap-3 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : users.length === 0 ? (
                <p className="px-6 py-8 text-sm text-slate-400 text-center">No users found</p>
              ) : (
                users.map((u) => (
                  <div key={u._id} className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 text-sm font-bold flex-shrink-0">
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{u.name}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{u.email}</p>
                    </div>
                    {u.isAdmin && (
                      <span className="text-xs px-2 py-0.5 border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Recent Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Products</h2>
              <Link
                href="/product"
                className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="px-6 py-4 flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/5" />
                      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/4" />
                    </div>
                  </div>
                ))
              ) : products.length === 0 ? (
                <p className="px-6 py-8 text-sm text-slate-400 text-center">No products found</p>
              ) : (
                products.map((p) => (
                  <div key={p._id} className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{p.name}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{p.category}</p>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">${p.price}</span>
                  </div>
                ))
              )}
            </div>
          </motion.div>

        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Products', href: '/product', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
            { label: 'Try-On', href: '/try-on', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { label: 'Profile', href: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
            { label: 'Contact', href: '/contact', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
          ].map(({ label, href, icon }) => (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center gap-2 p-5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-slate-400 dark:hover:border-slate-500 transition-colors duration-200 group"
            >
              <svg className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
              </svg>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{label}</span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
