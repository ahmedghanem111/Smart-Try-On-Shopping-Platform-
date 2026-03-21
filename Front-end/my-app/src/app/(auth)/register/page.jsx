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
        response.data.isAdmin ? router.push('/dashboard') : router.push('/')
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.response?.data || 'Registration failed.'
        toast.error(errorMessage)
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <section className="relative min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center px-4 overflow-hidden transition-colors duration-500 font-serif">
      
      {/* Background Blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-slate-100 dark:bg-slate-800/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-100 dark:bg-slate-800/30 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-lg relative z-10 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-light text-slate-900 dark:text-slate-100 tracking-tight mb-3 italic">
            Join Fit-Me
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-light">
            Start your AI-powered fashion journey
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-8 md:p-12 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-none"
        >
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-xs font-medium uppercase tracking-widest text-slate-600 dark:text-slate-300 ml-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                {...formik.getFieldProps('name')}
                placeholder="John Doe"
                className={`w-full px-6 py-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border transition-all duration-300 ${
                  formik.touched.name && formik.errors.name
                    ? 'border-red-400'
                    : 'border-slate-200 dark:border-slate-700 focus:border-slate-900 dark:focus:border-white'
                } text-slate-900 dark:text-white outline-none`}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-xs ml-2">{formik.errors.name}</p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="block text-xs font-medium uppercase tracking-widest text-slate-600 dark:text-slate-300 ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                {...formik.getFieldProps('email')}
                placeholder="name@example.com"
                className={`w-full px-6 py-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border transition-all duration-300 ${
                  formik.touched.email && formik.errors.email
                    ? 'border-red-400'
                    : 'border-slate-200 dark:border-slate-700 focus:border-slate-900 dark:focus:border-white'
                } text-slate-900 dark:text-white outline-none`}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-xs ml-2">{formik.errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-xs font-medium uppercase tracking-widest text-slate-600 dark:text-slate-300 ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  {...formik.getFieldProps('password')}
                  placeholder="••••••••"
                  className={`w-full px-6 py-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border transition-all duration-300 ${
                    formik.touched.password && formik.errors.password
                      ? 'border-red-400'
                      : 'border-slate-200 dark:border-slate-700 focus:border-slate-900 dark:focus:border-white'
                  } text-slate-900 dark:text-white outline-none`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-xs ml-2">{formik.errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-xs font-medium uppercase tracking-widest text-slate-600 dark:text-slate-300 ml-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  {...formik.getFieldProps('confirmPassword')}
                  placeholder="••••••••"
                  className={`w-full px-6 py-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border transition-all duration-300 ${
                    formik.touched.confirmPassword && formik.errors.confirmPassword
                      ? 'border-red-400'
                      : 'border-slate-200 dark:border-slate-700 focus:border-slate-900 dark:focus:border-white'
                  } text-slate-900 dark:text-white outline-none`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="text-red-500 text-xs ml-2">{formik.errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-medium tracking-widest uppercase text-sm hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {formik.isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-700" /></div>
            <span className="relative px-4 bg-white dark:bg-slate-800/0 text-slate-400 text-xs uppercase tracking-widest block w-max mx-auto">
              Or join with
            </span>
          </div>

          <GoogleLoginButton />
        </motion.div>

        {/* Footer Link */}
        <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-slate-900 dark:text-white font-bold hover:underline underline-offset-4">
            Sign in instead
          </Link>
        </p>
      </div>
    </section>
  )
}

export default Register