'use client';

import { useState } from 'react';
import Model3D from '@/components/ui/Model3D';
import { motion } from 'framer-motion';

const products = [
  {
    id: 1,
    name: 'Classic Aviator Glasses',
    description: 'Timeless design with modern comfort',
    category: 'Eyewear',
    modelPath: '/glass6.glb',
    scale: 2,
    price: '$129.99',
    features: ['Premium quality materials', 'UV protection coating', 'Lightweight and durable design', 'Adjustable for perfect fit'],
  },
  {
    id: 2,
    name: 'Modern Round Frames',
    description: 'Contemporary style meets functionality',
    category: 'Eyewear',
    modelPath: '/glass4.glb',
    scale: 2,
    price: '$149.99',
    features: ['Premium quality materials', 'UV protection coating', 'Lightweight and durable design', 'Adjustable for perfect fit'],
  },
  {
    id: 3,
    name: 'Designer Square Glasses',
    description: 'Bold statement for the fashion-forward',
    category: 'Eyewear',
    modelPath: '/glass3.glb',
    scale: 2,
    price: '$179.99',
    features: ['Premium quality materials', 'UV protection coating', 'Lightweight and durable design', 'Adjustable for perfect fit'],
  },
  {
    id: 4,
    name: 'Essential White T-Shirt',
    description: 'Clean, minimal everyday essential in premium cotton',
    category: 'Clothing',
    modelPath: '/t-shirt1.glb',
    scale: 1,
    price: '$49.99',
    features: ['100% premium cotton', 'Relaxed modern fit', 'Pre-shrunk fabric', 'Available in multiple sizes'],
  },

  {
    id: 6,
    name: 'Oversized Drop T-Shirt',
    description: 'Relaxed oversized silhouette for a streetwear look',
    category: 'Clothing',
    modelPath: '/t-shirt3.glb',
    scale: 1,
    price: '$54.99',
    features: ['Heavyweight cotton blend', 'Oversized drop shoulder', 'Ribbed collar', 'Available in multiple sizes'],
  },





];

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState(0);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      
      <section className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-wider text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-full">
              3D Product Viewer
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-slate-900 dark:text-white">
              Explore Our Collection
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Experience products in 3D. Rotate, zoom, and explore every detail before you buy.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <motion.div 
              key={`main-${selectedProduct}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative bg-slate-100  rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
              style={{ aspectRatio: '1/1' }}
            >
              <Model3D key={`main-model-${selectedProduct}`} modelPath={products[selectedProduct].modelPath} />
              
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
                <span className="inline-block px-4 py-2 text-xs font-medium tracking-wider text-slate-600 dark:text-slate-300 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-600 rounded-full">
                  Drag to rotate • Scroll to zoom
                </span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              <div>
                <span className="inline-block px-3 py-1 text-[10px] uppercase tracking-[0.3em] font-semibold text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600 rounded-full mb-4">
                  {products[selectedProduct].category}
                </span>
                <h2 className="text-4xl md:text-5xl font-serif text-slate-900 dark:text-white mb-4">
                  {products[selectedProduct].name}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6">
                  {products[selectedProduct].description}
                </p>
                <p className="text-3xl font-medium text-slate-900 dark:text-white">
                  {products[selectedProduct].price}
                </p>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-sm uppercase tracking-wider font-medium text-slate-900 dark:text-white">
                  Features
                </h3>
                <ul className="space-y-3">
                  {products[selectedProduct].features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-slate-900 dark:bg-slate-300 mt-2 flex-shrink-0"></span>
                      <span className="text-slate-600 dark:text-slate-400">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4 pt-6">
                <button className="flex-1 px-8 py-3 text-sm font-medium tracking-wider bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors duration-200">
                  ADD TO CART
                </button>
                <button className="px-6 py-3 text-sm font-medium tracking-wider border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h3 className="text-3xl md:text-4xl font-serif text-slate-900 dark:text-white mb-2">
              All Products
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Click on any product to view in 3D
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setSelectedProduct(index);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`cursor-pointer group bg-white dark:bg-slate-900 border-2 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  selectedProduct === index 
                    ? 'border-slate-900 dark:border-white shadow-lg' 
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="aspect-square relative bg-gradient-to-b from-slate-100 to-slate-50  ">
                  <Model3D key={`card-model-${product.id}`} modelPath={product.modelPath} />
                </div>
                <div className="p-6">
                  <span className="inline-block px-2 py-1 text-[9px] uppercase tracking-[0.2em] font-semibold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-full mb-3">
                    {product.category}
                  </span>
                  <h4 className="text-xl font-serif text-slate-900 dark:text-white mb-2">
                    {product.name}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                    {product.description}
                  </p>
                  <p className="text-lg font-medium text-slate-900 dark:text-white">
                    {product.price}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}