import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import ErrorModal from '../components/ErrorModal';

export default function Login() {
  const router = useRouter();
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorInfo, setErrorInfo] = useState({ title: '', message: '' })
  
  useEffect(() => {
    // Check for error parameters
    if (router.query.error) {
      console.error('Login error:', router.query.error)
      
      if (router.query.error === 'youtube_login_failed') {
        setErrorInfo({
          title: 'YouTube Login Failed',
          message: 'No YouTube channel found for this account. Please make sure you have an active YouTube channel before connecting.'
        })
        setShowErrorModal(true)
      }
    }
  }, [router.query.error])

  const handleYouTubeLogin = () => {
    // Mock login - redirect to dashboard
    router.push('/dashboard')
  }

  const handleTwitchLogin = () => {
    // Mock login - redirect to dashboard
    router.push('/dashboard')
  }


  return (
    <>
      <Head>
        <title>Login - Spekter Games</title>
        <meta name="description" content="Login to Spekter Games platform" />
      </Head>

      <div className="min-h-screen bg-bg">
        {/* Content */}
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
          <div className="samsung-card p-8 max-w-md w-full">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-6">
                <img 
                  src="/SG_logo.png" 
                  alt="Spekter Games"
                  className="h-12 w-auto mx-auto"
                />
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleYouTubeLogin}
                className="w-full flex items-center justify-center space-x-3 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-fast min-h-[48px]"
              >
                <img src="/youtube.png" alt="YouTube" className="w-6 h-4" />
                <span>Login with YouTube</span>
              </button>

              <button
                onClick={handleTwitchLogin}
                className="w-full flex items-center justify-center space-x-3 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-fast min-h-[48px]"
              >
                <img src="/twitch.png" alt="Twitch" className="w-5 h-5" />
                <span>Login with Twitch</span>
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-muted">
                By continuing, you agree to our{' '}
                <Link href="/terms" className="text-primary hover:text-primary/80 underline">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-primary hover:text-primary/80 underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-bg border-t border-brand/20 mt-auto relative overflow-hidden">
          <div className="relative z-10 container mx-auto px-4 py-12">
            <div className="text-center text-sm text-white/40 font-medium tracking-wide">
              © 2025 Spekter Games. All rights reserved.
            </div>
          </div>
        </footer>
      </div>

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={errorInfo.title}
        message={errorInfo.message}
      />
    </>
  );
}
