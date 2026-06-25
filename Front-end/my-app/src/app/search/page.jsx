'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import WishlistHeart from '@/components/ui/WishlistHeart'
import { API } from '@/lib/axios'

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function SearchResults() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const q = searchParams.get('q') || ''

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = q ? `Search: "${q}" — Fit-Me` : 'Search — Fit-Me'
    }
  }, [q])

  useEffect(() => {
    setPage(1)
  }, [q])

  useEffect(() => {
    if (!q) return
    const fetchResults = async () => {
      setLoading(true)
      try {
        const { data } = await API.get(
          `/api/products?keyword=${encodeURIComponent(q)}&pageSize=12&pageNumber=${page}`
        )
        setProducts(data.products || [])
        setPages(data.pages || 1)
        setCount(data.count ?? (data.products?.length ?? 0))
      } catch {
        setProducts([])
        setPages(1)
        setCount(0)
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [q, page])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">

      {/* Breadcrumb */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/product" className="hover:text-slate-900 dark:hover:text-white transition-colors">Products</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white truncate">Search</span>
        </div>
      </div>

      {/* Hero header */}
      <section className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-serif text-slate-900 dark:text-white">
              {q ? (
                <>Results for: <span className="italic text-slate-500 dark:text-slate-400">"{q}"</span></>
              ) : (
                'Search Products'
              )}
            </h1>
            {!loading && q && (
              <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-full">
                {count} product{count !== 1 ? 's' : ''} found
              </span>
            )}
          </motion.div>
        </div>
      </section>

      <section className="bg-slate-50 dark:bg-slate-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* No query */}
          {!q && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <svg className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-slate-500 dark:text-slate-400 text-lg mb-6">Enter a search term in the navigation bar.</p>
              <Link href="/product" className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-full hover:opacity-90 transition-all text-sm">
                Browse All Products
              </Link>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && q && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                  <div className="aspect-square bg-slate-200 dark:bg-slate-700" />
                  <div className="p-5 space-y-2">
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {!loading && q && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-slate-900 dark:text-white text-xl font-serif mb-2">No products found</p>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                We couldn't find anything for "{q}". Try a different keyword.
              </p>
              <Link
                href="/product"
                className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-full hover:opacity-90 transition-all text-sm"
              >
                Browse All Products
              </Link>
            </div>
          )}

          {/* Results grid */}
          {!loading && products.length > 0 && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {products.map((product, index) => (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.04 }}
                      className="group bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-slate-900 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300"
                    >
                      <div className="aspect-square relative bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 25vw"
                        />
                        <div className="absolute top-3 right-3 z-20">
                          <WishlistHeart productId={product._id} size="md" />
                        </div>
                        {product.countInStock === 0 && (
                          <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 flex items-center justify-center">
                            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Out of Stock</span>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="inline-block px-2 py-1 text-[9px] uppercase tracking-[0.2em] font-semibold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-full">
                            {product.category}
                          </span>
                          <StarRating rating={product.rating} />
                        </div>
                        <h4 className="text-lg font-serif text-slate-900 dark:text-white mb-1 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-widest">{product.brand}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-medium text-slate-900 dark:text-white">{product.price} EGP</p>
                          <Link
                            href={`/product/${product._id}`}
                            className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                          >
                            Details →
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-16">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 text-sm rounded-xl border transition-colors ${
                        p === page
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                          : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(pages, p + 1))}
                    disabled={page === pages}
                    className="px-4 py-2 text-sm border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-slate-300 dark:border-slate-600 border-t-slate-900 dark:border-t-white rounded-full animate-spin" />
      </div>
    }>
      <SearchResults />
    </Suspense>
  )
}
