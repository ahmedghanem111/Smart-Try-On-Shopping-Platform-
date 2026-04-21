'use client'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { ToastProvider } from '@/contexts/ToastContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { CartProvider } from '@/contexts/CartContext'
import ToastContainer from '@/components/ui/ToastContainer'

export default function Providers({ children }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  if (!clientId) {
    console.error('⚠️ NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set in environment variables')
  }

  return (
    <GoogleOAuthProvider clientId={clientId || ''}>
      <ToastProvider>
        <AuthProvider>
          <ThemeProvider>
            <CartProvider>
              {children}
              <ToastContainer />
            </CartProvider>
          </ThemeProvider>
        </AuthProvider>
      </ToastProvider>
    </GoogleOAuthProvider>
  )
}
