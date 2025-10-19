import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { currentSeason, mockCreators } from '@/data/mockData';
import ProfileDropdown from './ProfileDropdown';
import Footer from './Footer';
import MobileRedirect from './MobileRedirect';
import { useAuth } from '../lib/hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();

  // Use real authentication state instead of localStorage
  useEffect(() => {
    setIsLoggedIn(isAuthenticated);
  }, [isAuthenticated]);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
      const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
      const isSmallScreen = window.innerWidth < 1024; // Less than lg breakpoint
      setIsMobile(isMobileUA || isSmallScreen);
    };

    if (typeof window !== 'undefined') {
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  const isActive = (path: string) => {
    if (path === '/dashboard' && router.pathname === '/') return true;
    return router.pathname === path;
  };

  const showHeader = router.pathname !== '/login';
  
  // Get current user data - 使用真實用戶數據或 fallback 到 mock 數據
  const currentUser = user || mockCreators.find(creator => creator.id === 'ares')!;

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  // Show mobile redirect screen if on mobile device
  if (isMobile) {
    return <MobileRedirect />;
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header - Delabs Style */}
      {showHeader && (
        <header className="sticky top-0 z-40 backdrop-blur-lg border-b border-brand/20" style={{background: 'rgba(13, 13, 13, 0.9)'}}>
          <div className="container mx-auto">
            <div className="flex h-16 items-center justify-between">
              {/* Logo and Brand */}
              <div className="flex items-center space-x-6">
                <Link href="/dashboard" className="flex items-center space-x-3">
                  <img 
                    src="/Header_logo.png" 
                    alt="Ragnarok Libre"
                    className="h-5 w-auto"
                  />
                </Link>
                
                <div className="hidden lg:flex items-center space-x-6 ml-8 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-white/60 tracking-wide font-medium">Season</span>
                    <span className="font-bold text-white">{currentSeason.season}</span>
                  </div>
                  <div className="px-4 py-2 bg-brand text-white rounded-full text-xs font-bold tracking-wide border border-brand/50">
                    {currentSeason.daysLeft}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex items-center space-x-8">
                <div className="hidden md:flex items-center space-x-8 text-sm">
                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSdlFb-g9-Aoz8phRuM_5UzVIvdI74q6u5X8o-oMhNvl88_W6Q/viewform"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-4 py-2 rounded-lg font-bold tracking-wide transition-all duration-300 text-sm border border-orange-400/50 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/25 hover:scale-105 transform"
                  >
                    Apply Now
                  </a>
                  <Link 
                    href="/dashboard"
                    className={`font-bold tracking-wide transition-colors ${
                      isActive('/dashboard') 
                        ? 'text-brand' 
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/leaderboard"
                    className={`font-bold tracking-wide transition-colors ${
                      isActive('/leaderboard') 
                        ? 'text-brand' 
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Leaderboard
                  </Link>
                </div>
                
                {/* User Profile Dropdown or Login Button */}
                {isLoggedIn ? (
                  <ProfileDropdown 
                    userName={currentUser.name || 'User'} 
                    userId={currentUser.id || 'user'} 
                    userAvatar={currentUser.avatar || '/Creator/阿瑞斯Ares.png'} 
                  />
                ) : (
                  <button
                    onClick={handleLoginRedirect}
                    className="bg-brand hover:bg-brand/80 text-white px-6 py-2 rounded-lg font-bold tracking-wide transition-colors text-sm"
                  >
                    Login
                  </button>
                )}
              </nav>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="container mx-auto section-spacing">
        {children}
      </main>

      {/* Footer */}
      {showHeader && <Footer />}
    </div>
  );
}
