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

  return (
    <div className="min-h-screen bg-bg">
      {/* Header - Responsive Design */}
      {showHeader && (
        <header className="sticky top-0 z-40 backdrop-blur-lg border-b border-brand/20" style={{background: 'rgba(2, 7, 11, 0.9)'}}>
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              {/* Logo and Brand */}
              <div className="flex items-center space-x-3 lg:space-x-6">
                <Link href="/dashboard" className="flex items-center space-x-2 lg:space-x-3">
                  <img 
                    src="/SG_logo.png" 
                    alt="Spekter Games"
                    className="h-5 w-auto lg:h-6"
                  />
                </Link>
                
              </div>


              {/* Navigation */}
              <nav className="flex items-center space-x-4 lg:space-x-8">
                <div className="hidden md:flex items-center space-x-6 lg:space-x-8 text-sm">
                  <Link 
                    href="/dashboard"
                    className={`font-bold tracking-wide transition-colors ${
                      isActive('/dashboard') 
                        ? 'text-cyan-400' 
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/leaderboard"
                    className={`font-bold tracking-wide transition-colors ${
                      isActive('/leaderboard') 
                        ? 'text-cyan-400' 
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
                    userAvatar={currentUser.avatar || 'https://api.dicebear.com/7.x/personas/svg?seed=default-user&backgroundColor=transparent&backgroundType=gradientLinear&clothingColor=262e33&eyeColor=4a90e2&hairColor=724133&skinColor=edb98a&style=circle'} 
                  />
                ) : (
                  <button
                    onClick={handleLoginRedirect}
                    className="bg-gradient-to-r from-brand to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white px-4 py-2 lg:px-6 rounded-lg font-bold tracking-wide transition-all duration-200 text-xs lg:text-sm shadow-lg hover:shadow-brand/25"
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
      <main className="container mx-auto px-4 section-spacing">
        {children}
      </main>

      {/* Footer */}
      {showHeader && <Footer />}
    </div>
  );
}
