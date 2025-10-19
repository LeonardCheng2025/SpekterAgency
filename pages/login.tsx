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

  const handleFacebookLogin = () => {
    // Mock login - redirect to dashboard
    router.push('/dashboard')
  }

  const handleXLogin = () => {
    // Mock login - redirect to dashboard
    router.push('/dashboard')
  }


  return (
    <>
      <Head>
        <title>Creator Competition - Spekter Games</title>
        <meta name="description" content="Join the creator competition! Create content, get referrals, and earn rewards. Compete with other creators from YouTube, Twitch, Facebook, and X." />
      </Head>

      <div className="min-h-screen bg-bg relative overflow-hidden">
        {/* Enhanced background gradients */}
        <div className="absolute inset-0 bg-spekter-blue-glow"></div>
        <div className="absolute inset-0 bg-spekter-purple-glow"></div>
        <div className="absolute inset-0 bg-spekter-grid bg-grid opacity-10"></div>
        
        {/* Content */}
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12 relative z-10">
          <div className="samsung-card p-8 max-w-md w-full relative overflow-hidden">
            {/* Enhanced glass effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-spekter-surface/30 via-spekter-glass/20 to-spekter-surface/30"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-brand/10 via-transparent to-accent/10"></div>
            <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-6">
                <img 
                  src="/SG_logo.png" 
                  alt="Spekter Games"
                  className="h-8 w-auto mx-auto"
                />
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleXLogin}
                className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-medium py-3 px-4 rounded-md transition-all duration-fast min-h-[48px] shadow-lg hover:shadow-gray-800/25"
              >
                <img src="/X-logo.png" alt="X" className="w-5 h-5" />
                <span>Login with X</span>
              </button>

              <button
                onClick={handleYouTubeLogin}
                className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-4 rounded-md transition-all duration-fast min-h-[48px] shadow-lg hover:shadow-red-500/25"
              >
                <img src="/youtube.png" alt="YouTube" className="w-6 h-4" />
                <span>Login with YouTube</span>
              </button>

              <button
                onClick={handleTwitchLogin}
                className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-md transition-all duration-fast min-h-[48px] shadow-lg hover:shadow-purple-500/25"
              >
                <img src="/twitch.png" alt="Twitch" className="w-5 h-5" />
                <span>Login with Twitch</span>
              </button>

              <button
                onClick={handleFacebookLogin}
                className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-md transition-all duration-fast min-h-[48px] shadow-lg hover:shadow-blue-600/25"
              >
                <img src="/facebook.png" alt="Facebook" className="w-5 h-5" />
                <span>Login with Facebook</span>
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-muted">
                Join the creator competition • Create content • Earn rewards
              </p>
            </div>
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
