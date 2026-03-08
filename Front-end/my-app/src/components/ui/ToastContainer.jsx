'use client'

import { AnimatePresence } from 'framer-motion'
import Toast from './Toast'
import { useToast } from '@/contexts/ToastContext'

const ToastContainer = () => {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              id={toast.id}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={removeToast}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default ToastContainer
