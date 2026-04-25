'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long'
    }

    return newErrors
  }

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    
    try {
      // Console log the form data
      console.log('Contact Form Submitted:', {
        timestamp: new Date().toISOString(),
        ...formData
      })

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })
      setErrors({})
      setSubmitted(true)

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false)
      }, 5000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-wider text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-full">
              GET IN TOUCH
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-normal text-slate-900 dark:text-white">
              Contact Us
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you. Get in touch with our team today.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="bg-white dark:bg-slate-900 py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Success Message */}
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-green-800 dark:text-green-300">Message received!</h3>
                    <p className="text-sm text-green-700 dark:text-green-400 mt-1">Thank you for reaching out. We'll get back to you as soon as possible.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent ${
                    errors.name
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-600 dark:text-red-400 mt-1.5"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent ${
                    errors.email
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-600 dark:text-red-400 mt-1.5"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>

              {/* Subject Field */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent ${
                    errors.subject
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {errors.subject && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-600 dark:text-red-400 mt-1.5"
                  >
                    {errors.subject}
                  </motion.p>
                )}
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message here... (minimum 10 characters)"
                  rows="6"
                  className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent resize-none ${
                    errors.message
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                <div className="flex items-center justify-between mt-1.5">
                  {errors.message && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-600 dark:text-red-400"
                    >
                      {errors.message}
                    </motion.p>
                  )}
                  <span className={`text-xs ml-auto transition-colors ${
                    formData.message.length < 10
                      ? 'text-slate-400 dark:text-slate-500'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    {formData.message.length}/10 min
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-3.5 text-sm font-medium tracking-wider text-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>Send Message</>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Can't find what you're looking for? Check our FAQ section.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: 'How quickly will you respond?',
                answer: 'We typically respond to inquiries within 24-48 business hours. For urgent matters, please mark them as such in your message.'
              },
              {
                question: 'What is the best way to reach you?',
                answer: 'Our contact form is the fastest way to reach us. We monitor it regularly and respond to all messages as soon as possible.'
              },
              {
                question: 'Can I call you directly?',
                answer: 'Currently, we support contact through our online form. You can reach out with your preferred contact method and we\'ll get back to you.'
              },
              {
                question: 'Do you offer customer support?',
                answer: 'Yes, we offer full customer support. You can reach our support team through this contact form with any questions about our products or services.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white dark:bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 dark:text-white">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Explore our products and experience the future of shopping with our AI-powered try-on technology.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/product"
                className="px-8 py-3 text-sm font-medium tracking-wider bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:opacity-90 transition-opacity duration-200"
              >
                SHOP NOW
              </Link>
              <Link
                href="/find-my-fit"
                className="px-8 py-3 text-sm font-medium tracking-wider border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors duration-200"
              >
                TRY NOW
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
