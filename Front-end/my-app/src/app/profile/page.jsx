'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const ProfilePage = () => {
  const { user } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/20 dark:from-slate-950 dark:via-purple-950/20 dark:to-blue-950/10 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-4xl font-bold mb-4">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {user.name}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
            {user.isAdmin && (
              <span className="inline-block mt-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
                Admin
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                User Name
              </label>
              <p className="text-slate-900 dark:text-white font-mono text-sm">
                {user.name}
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                Email Address
              </label>
              <p className="text-slate-900 dark:text-white">
                {user.email}
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                Account Type
              </label>
              <p className="text-slate-900 dark:text-white">
                {user.isAdmin ? 'Administrator' : 'Regular User'}
              </p>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ProfilePage
