'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useFormik } from 'formik'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { registerRequest } from '@/services/authService'
import { useToast } from '@/contexts/ToastContext'
import { registerSchema } from '@/lib/validationSchemas'
import GoogleLoginButton from '@/components/ui/GoogleLoginButton'

const Register = () => {
  const { login } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await registerRequest({
          name: values.name,
          email: values.email,
          password: values.password
        })

        login(response.data)
        toast.success('Account created successfully! Welcome aboard.')
        
        if (response.data.isAdmin) {
          router.push('/dashboard')
        } else {
          router.push('/')
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.response?.data || 'Registration failed. Please try again.'
        toast.error(errorMessage)
      } finally {
        setSubmitting(false)
      }
    },
  })

  const getStrength = (password) => {
    if (!password) return { level: 0, label: '', color: '' }
    let score = 0
    if (password.length >= 6) score++
    if (password.length >= 10) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-red-500' }
    if (score <= 3) return { level: 2, label: 'Fair', color: 'bg-yellow-500' }
    return { level: 3, label: 'Strong', color: 'bg-green-500' }
  }

  const strength = getStrength(formik.values.password)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] },
    },
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/20 dark:from-slate-950 dark:via-purple-950/20 dark:to-blue-950/10 flex items-center justify-center px-4 py-16">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-10 w-72 h-72 bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-96 h-96 bg-blue-300/20 dark:bg-blue-600/10 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 left-1/3 w-48 h-48 bg-cyan-300/10 dark:bg-cyan-600/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div
        className="relative w-full max-w-md z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="p-[1.5px] rounded-3xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 shadow-2xl shadow-purple-500/20">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl px-8 py-10">

            <motion.div variants={itemVariants} className="text-center mb-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 border border-purple-300/30 dark:border-purple-500/30 backdrop-blur-sm mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Join StyleAI Today
                </span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create your account</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Start your AI-powered fashion journey in seconds</p>
            </motion.div>

            <form onSubmit={formik.handleSubmit} className="space-y-5">

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="John Doe"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border ${
                      formik.touched.name && formik.errors.name
                        ? 'border-red-400 dark:border-red-600'
                        : 'border-slate-200 dark:border-slate-700'
                    } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 dark:focus:border-purple-500 transition-all duration-200`}
                  />
                </div>
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {formik.errors.name}
                  </p>
                )}
              </motion.div>


              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="you@example.com"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border ${
                      formik.touched.email && formik.errors.email
                        ? 'border-red-400 dark:border-red-600'
                        : 'border-slate-200 dark:border-slate-700'
                    } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 dark:focus:border-purple-500 transition-all duration-200`}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {formik.errors.email}
                  </p>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-12 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border ${
                      formik.touched.password && formik.errors.password
                        ? 'border-red-400 dark:border-red-600'
                        : 'border-slate-200 dark:border-slate-700'
                    } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 dark:focus:border-purple-500 transition-all duration-200`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                {formik.values.password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-1 pt-1"
                  >
                    <div className="flex gap-1.5">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            i <= strength.level ? strength.color : 'bg-slate-200 dark:bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-medium ${strength.level === 1 ? 'text-red-500' : strength.level === 2 ? 'text-yellow-500' : 'text-green-500'}`}>
                      {strength.label} password
                    </p>
                  </motion.div>
                )}
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {formik.errors.password}
                  </p>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-12 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 ${
                      formik.touched.confirmPassword && formik.errors.confirmPassword
                        ? 'border-red-400 dark:border-red-600 focus:border-red-500'
                        : formik.values.confirmPassword && formik.values.password === formik.values.confirmPassword
                        ? 'border-green-400 dark:border-green-600 focus:border-green-500'
                        : 'border-slate-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-500'
                    }`}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    {showConfirm ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                  {formik.values.confirmPassword && (
                    <div className="absolute inset-y-0 right-10 flex items-center pr-1">
                      {formik.values.password === formik.values.confirmPassword ? (
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {formik.errors.confirmPassword}
                  </p>
                )}
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants} className="pt-2">
                <motion.button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="group relative w-full px-8 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/30 dark:shadow-purple-500/20 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                  whileHover={!formik.isSubmitting ? { scale: 1.02, y: -1 } : {}}
                  whileTap={!formik.isSubmitting ? { scale: 0.98 } : {}}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {formik.isSubmitting ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div variants={itemVariants} className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white dark:bg-slate-900 text-slate-400">Or continue with</span>
              </div>
            </motion.div>

            {/* Google Login */}
            <motion.div variants={itemVariants} className="mb-6">
              <GoogleLoginButton />
            </motion.div>

            {/* Divider */}
            <motion.div variants={itemVariants} className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white dark:bg-slate-900 text-slate-400">Already have an account?</span>
              </div>
            </motion.div>

            {/* Login Link */}
            <motion.div variants={itemVariants}>
              <Link href="/login">
                <motion.button
                  className="w-full px-8 py-3.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-semibold border-2 border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-300 shadow-sm"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign In Instead
                </motion.button>
              </Link>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default Register
