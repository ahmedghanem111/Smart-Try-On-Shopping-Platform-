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

  return (
    <section className="relative min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-medium tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-4">
            JOIN US TODAY
          </p>
          <h1 className="text-4xl font-serif text-slate-900 dark:text-white mb-3">
            Create your account
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Start your AI-powered fashion journey in seconds
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={formik.handleSubmit}
          className="space-y-6"
        >
          {/* Name */}
          <div className="space-y-2">
            <label className="block text-xs font-medium tracking-wider text-slate-700 dark:text-slate-300 uppercase">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="John Doe"
              className={`w-full px-4 py-3 bg-white dark:bg-slate-800 border ${
                formik.touched.name && formik.errors.name
                  ? 'border-red-400'
                  : 'border-slate-300 dark:border-slate-700'
              } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors duration-200`}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-xs">{formik.errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-xs font-medium tracking-wider text-slate-700 dark:text-slate-300 uppercase">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="email@example.com"
              className={`w-full px-4 py-3 bg-white dark:bg-slate-800 border ${
                formik.touched.email && formik.errors.email
                  ? 'border-red-400'
                  : 'border-slate-300 dark:border-slate-700'
              } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors duration-200`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-xs font-medium tracking-wider text-slate-700 dark:text-slate-300 uppercase">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="••••••••"
                className={`w-full px-4 py-3 pr-12 bg-white dark:bg-slate-800 border ${
                  formik.touched.password && formik.errors.password
                    ? 'border-red-400'
                    : 'border-slate-300 dark:border-slate-700'
                } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors duration-200`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
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
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs">{formik.errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="block text-xs font-medium tracking-wider text-slate-700 dark:text-slate-300 uppercase">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="••••••••"
                className={`w-full px-4 py-3 pr-12 bg-white dark:bg-slate-800 border ${
                  formik.touched.confirmPassword && formik.errors.confirmPassword
                    ? 'border-red-400'
                    : 'border-slate-300 dark:border-slate-700'
                } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors duration-200`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
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
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-red-500 text-xs">{formik.errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium tracking-wider uppercase text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formik.isSubmitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>
        </motion.form>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative my-8"
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300 dark:border-slate-700" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-4 bg-slate-50 dark:bg-slate-900 text-slate-500 uppercase tracking-wider">
              Or
            </span>
          </div>
        </motion.div>

        {/* Google Login */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <GoogleLoginButton />
        </motion.div>

        {/* Sign In Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-xs font-medium tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-4">
            ALREADY HAVE AN ACCOUNT?
          </p>
          <Link
            href="/login"
            className="text-sm text-slate-900 dark:text-white hover:underline"
          >
            Sign in instead
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default Register
