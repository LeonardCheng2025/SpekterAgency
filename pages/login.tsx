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
        <title>Play Spekter Agency - Telegram Game</title>
        <meta name="description" content="Start your spirit hunting adventure in Spekter Agency. Play the rogue-lite survivor game on Telegram and earn Spark points!" />
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
                onClick={handleYouTubeLogin}
                className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-md transition-all duration-fast min-h-[48px] shadow-lg hover:shadow-blue-500/25"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.169 1.858-.896 3.46-2.128 4.692-1.232 1.232-2.834 1.959-4.692 2.128-1.858.169-3.46.896-4.692 2.128-1.232 1.232-1.959 2.834-2.128 4.692-.169 1.858-.896 3.46-2.128 4.692-1.232 1.232-2.834 1.959-4.692 2.128C1.858 22.431.256 23.158-1.602 22.989c-1.858-.169-3.46-.896-4.692-2.128-1.232-1.232-1.959-2.834-2.128-4.692-.169-1.858-.896-3.46-2.128-4.692-1.232-1.232-2.834-1.959-4.692-2.128C-1.858 1.569-.256.842 1.602 1.011c1.858.169 3.46.896 4.692 2.128 1.232 1.232 1.959 2.834 2.128 4.692.169 1.858.896 3.46 2.128 4.692 1.232 1.232 2.834 1.959 4.692 2.128z"/>
                </svg>
                <span>Play on Telegram</span>
              </button>

              <button
                onClick={handleTwitchLogin}
                className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-brand to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-medium py-3 px-4 rounded-md transition-all duration-fast min-h-[48px] shadow-lg hover:shadow-brand/25"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.5 6.5h3v6h-3v-6zm-3 0h3v6h-3v-6zm6 0h3v6h-3v-6z"/>
                </svg>
                <span>Start Spirit Hunting</span>
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-muted">
                No download required • Play directly on Telegram • Earn Spark points while playing
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
