'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

const tabs = ['Account', 'Measurements', 'Orders', 'Wishlist']

const ProfilePage = () => {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('Account')
  const [measurements, setMeasurements] = useState({
    height: '', weight: '', chest: '', waist: '', hips: '', inseam: ''
  })
  const [saved, setSaved] = useState(false)

  React.useEffect(() => {
    if (!user) router.push('/login')
    const stored = localStorage.getItem('measurements')
    if (stored) setMeasurements(JSON.parse(stored))
  }, [user, router])

  if (!user) return null

  const handleSaveMeasurements = () => {
    localStorage.setItem('measurements', JSON.stringify(measurements))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <section className="min-h-screen bg-slate-50 dark:bg-slate-900 py-16 px-4 font-serif">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6"
        >
          <div className="flex-shrink-0 w-24 h-24 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 text-4xl font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{user.name}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-base mt-1">{user.email}</p>
            {user.isAdmin && (
              <span className="inline-block mt-2 px-3 py-1 text-sm font-semibold tracking-widest uppercase border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-full">
                Admin
              </span>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="text-base font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
          >
            LOGOUT
          </button>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-8"
        >

          {activeTab === 'Account' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Account Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', value: user.name },
                  { label: 'Email Address', value: user.email },
                  { label: 'Account Type', value: user.isAdmin ? 'Administrator' : 'Customer' },
                  { label: 'Member Since', value: '2026' },
                ].map(({ label, value }) => (
                  <div key={label} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                    <p className="text-sm font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-1">{label}</p>
                    <p className="text-slate-900 dark:text-white text-base">{value}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <Link
                  href="/product"
                  className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-base font-medium rounded-full hover:bg-slate-700 dark:hover:bg-slate-100 transition-colors duration-200"
                >
                  Browse Products
                </Link>
                <Link
                  href="/try-on"
                  className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-base font-medium rounded-full hover:border-slate-900 dark:hover:border-white hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
                >
                  Virtual Try-On
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'Measurements' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Body Measurements</h2>
                <p className="text-base text-slate-500 dark:text-slate-400 mt-1">
                  Save your measurements for a more accurate virtual try-on experience.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { key: 'height', label: 'Height', unit: 'cm' },
                  { key: 'weight', label: 'Weight', unit: 'kg' },
                  { key: 'chest', label: 'Chest', unit: 'cm' },
                  { key: 'waist', label: 'Waist', unit: 'cm' },
                  { key: 'hips', label: 'Hips', unit: 'cm' },
                  { key: 'inseam', label: 'Inseam', unit: 'cm' },
                ].map(({ key, label, unit }) => (
                  <div key={key}>
                    <label className="block text-sm font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-1.5">
                      {label} ({unit})
                    </label>
                    <input
                      type="number"
                      value={measurements[key]}
                      onChange={(e) => setMeasurements(prev => ({ ...prev, [key]: e.target.value }))}
                      placeholder="—"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-base focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 transition-colors"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={handleSaveMeasurements}
                className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-base font-medium rounded-full hover:bg-slate-700 dark:hover:bg-slate-100 transition-colors duration-200"
              >
                {saved ? 'Saved ✓' : 'Save Measurements'}
              </button>
            </div>
          )}

          {activeTab === 'Orders' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Order History</h2>
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-base mb-4">No orders yet</p>
                <Link
                  href="/product"
                  className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-base font-medium rounded-full hover:bg-slate-700 dark:hover:bg-slate-100 transition-colors duration-200"
                >
                  Start Shopping
                </Link>
              </div>
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'Wishlist' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Wishlist</h2>
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-base mb-4">Your wishlist is empty</p>
                <Link
                  href="/product"
                  className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-base font-medium rounded-full hover:bg-slate-700 dark:hover:bg-slate-100 transition-colors duration-200"
                >
                  Discover Products
                </Link>
              </div>
            </div>
          )}

        </motion.div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Try-On', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', href: '/try-on' },
            { label: 'Products', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', href: '/product' },
            { label: 'Brands', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', href: '/brand' },
            { label: 'Contact', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', href: '/contact' },
          ].map(({ label, icon, href }) => (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center gap-2 p-5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-slate-400 dark:hover:border-slate-500 transition-colors duration-200 group"
            >
              <svg className="w-6 h-6 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default ProfilePage
