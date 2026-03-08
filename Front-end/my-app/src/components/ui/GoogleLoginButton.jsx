'use client'

import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useToast } from '@/contexts/ToastContext'
import { googleLoginRequest } from '@/services/authService'

const GoogleLoginButton = () => {
  const { login } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse
      
      if (!credential) {
        toast.error('Google authentication failed. Please try again.')
        return
      }

      const response = await googleLoginRequest(credential)
      
      // Backend returns: { _id, name, email, isAdmin, token }
      login(response.data)
      toast.success(`Welcome back, ${response.data.name}!`)
      
      // Redirect based on user role
      if (response.data.isAdmin) {
        router.push('/dashboard')
      } else {
        router.push('/')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || 'Google authentication failed. Please try again.'
      toast.error(errorMessage)
    }
  }

  const handleGoogleError = () => {
    toast.error('Google sign-in was cancelled or failed.')
  }

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap={false}
        theme="outline"
        size="large"
        width="100%"
        text="signin_with"
        locale="en"
        shape="rectangular"
        logo_alignment="left"
      />
      <style jsx global>{`
        /* Customize Google button size and padding */
        .nsm7Bb-HzV7m-LgbsSe {
          padding: 14px 16px !important;
          height: auto !important;
          min-height: 50px !important;
          width: 100% !important;
        }
        
        /* Make text bigger */
        .nsm7Bb-HzV7m-LgbsSe .nsm7Bb-HzV7m-LgbsSe-BPrWId {
          font-size: 16px !important;
          font-weight: 500 !important;
        }
        
        /* Adjust icon size */
        .nsm7Bb-HzV7m-LgbsSe-Bz112c {
          width: 24px !important;
          height: 24px !important;
        }
      `}</style>
    </div>
  )
}

export default GoogleLoginButton
