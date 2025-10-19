import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import CreatorCard from '@/components/CreatorCard';
import Layout from '@/components/Layout';
import { StarIcon } from '@heroicons/react/24/outline';
import { mockCreators, mockAnnouncements, currentSeason, sortedCreators } from '@/data/mockData';
import { useAuth } from '../lib/hooks/useAuth';
import { DashboardSkeleton, TopCreatorsSkeleton } from '@/components/SkeletonLoader';

// FAQ Data
const faqData = [
  {
    id: 1,
    question: "How do I start playing Spekter Agency?",
    answer: "Simply open Telegram and search for 'Spekter Agency' bot or visit our game link. No download required - you can start playing immediately within Telegram. Create your character and begin hunting spirits right away!"
  },
  {
    id: 2,
    question: "What are Spark points and how do I earn them?",
    answer: "Spark points are rewards you earn both while playing and passively when offline. You gain them by hunting spirits, completing missions, and leveling up. Higher levels increase your passive Spark earning rate, so you're always progressing even when not actively playing."
  },
  {
    id: 3,
    question: "What makes Spekter Agency different from other games?",
    answer: "Spekter Agency combines high-quality Web2 gameplay with Web3 rewards seamlessly. You get deep rogue-lite mechanics, 300+ unique spirits to hunt, and skill combos - all while earning Spark points that unlock tiered status levels and exclusive rewards."
  },
  {
    id: 4,
    question: "Can I play on mobile or do I need a computer?",
    answer: "Spekter Agency is designed for mobile-first gameplay with one-handed controls perfect for quick sessions. You can play on any device that supports Telegram - no separate app installation needed. The game is optimized for touch controls and mobile gaming."
  }
];

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [selectedFaq, setSelectedFaq] = useState<{question: string, answer: string} | null>(null);
  const [topCreators, setTopCreators] = useState<any[]>([]);
  const [creatorsLoading, setCreatorsLoading] = useState(true);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // Use mock data for top creators
  useEffect(() => {
    setCreatorsLoading(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      // Get top 10 creators from sorted leaderboard
      const top10Creators = sortedCreators.slice(0, 10);
      setTopCreators(top10Creators);
      setCreatorsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    // 檢查登錄成功參數
    if (router.query.login === 'success') {
      const token = router.query.token as string;
      
      // 如果有 token，保存到 localStorage
      if (token) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('isLoggedIn', 'true');
        
        // 清除 URL 參數並重新檢查認證狀態
        router.replace('/dashboard', undefined, { shallow: true }).then(() => {
          // 強制重新檢查認證狀態
          window.location.reload();
        });
      } else {
        // 沒有 token，只清除 URL 參數
        router.replace('/dashboard', undefined, { shallow: true });
      }
    }
  }, [router.query]);

  // 檢查認證狀態 - 允許未登入用戶訪問
  useEffect(() => {
    if (!isLoading) {
      // 模擬初始加載時間，讓用戶看到骨架屏
      const timer = setTimeout(() => {
        setDashboardLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Current user - 使用真實的認證用戶或默認用戶
  const currentUser = user || mockCreators.find(creator => creator.id === 'ares')!;

  // 顯示載入狀態
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-game-dark via-gray-900 to-game-dark flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-delabs-red mx-auto"></div>
        </div>
      </div>
    );
  }

  // 顯示儀表板（無論是否認證）
  return (
    <Layout>
      {dashboardLoading ? (
        <DashboardSkeleton />
      ) : (
      <div className="space-y-12">
        {/* Hero Section - Spekter Games Style */}
        <div className="relative overflow-hidden rounded-xl">
          {/* Background with blue glow and grid */}
          <div className="absolute inset-0 bg-spekter-hero"></div>
          <div className="absolute inset-0 bg-spekter-grid bg-grid opacity-30"></div>
          <div className="absolute inset-0 bg-spekter-diagonal opacity-20"></div>
          
          {/* Spekter Games Logo Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="text-8xl font-bold text-white font-display opacity-20">
                SPEKTER
              </div>
            </div>
          </div>
          
          <div className="relative z-10 p-12 text-center text-white">
            {/* Game Status */}
            <div className="mb-8">
              <div className="inline-flex items-center space-x-3 bg-black/20 backdrop-blur-md rounded-full px-6 py-3 border border-brand/20">
                <span className="bg-brand text-white px-3 py-1.5 rounded-full text-sm font-bold tracking-wide">LIVE NOW</span>
                <span className="text-white/60 text-sm">Play on Telegram</span>
              </div>
            </div>
            
            {/* Game Stats Display */}
            <div className="mb-8">
              <div className="text-8xl font-black mb-4 tracking-wider">
                <span className="text-white drop-shadow-lg">300</span>
                <span className="text-brand drop-shadow-lg">+</span>
              </div>
              <div className="text-white/80 text-lg font-bold tracking-wider mb-6">Unique Spirits to Hunt</div>
              
              <div className="text-2xl font-bold text-white mb-2 tracking-wider">
                Spekter Agency - Rogue-lite Survivor Game
              </div>

            </div>
            
            {/* Play Now */}
            <div className="inline-flex items-center bg-black/30 backdrop-blur-md rounded-full px-6 py-3 border border-brand/30">
              <div className="w-2.5 h-2.5 bg-brand rounded-full mr-2.5 animate-pulse"></div>
              <p className="text-base font-bold tracking-wider">Earn Spark Points</p>
            </div>
          </div>
          
          {/* Game Description - Part of Hero Section */}
          <div className="relative z-10 bg-gradient-to-r from-gray-900/40 to-gray-800/40 backdrop-blur-sm border-t border-brand/20 p-8">
            <div className="text-center max-w-5xl mx-auto">
              <h3 className="font-bold text-white mb-6 tracking-wide text-center" style={{fontSize: '20.4px'}}>
                Gaming Evolved: Balancing Web2 + Web3 for Mainstream Gamers
              </h3>
              <div className="text-center max-w-4xl mx-auto space-y-4">
                <p className="text-gray-200 leading-relaxed" style={{fontSize: '16px'}}>
                  Spekter Agency combines high-quality Web2 gameplay with seamless Web3 rewards. Hunt spirits, build combos, and earn Spark points in this rogue-lite survivor game.
                </p>
                <p className="text-gray-200 leading-relaxed" style={{fontSize: '16px'}}>
                  Play directly on Telegram with one-handed controls, no download required. Earn rewards both actively and passively as you progress through haunted locations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* News Section - Public */}
        <div className="relative overflow-hidden rounded-xl">
          {/* Enhanced Background Gradients */}
          <div className="absolute inset-0 bg-spekter-blue-glow"></div>
          <div className="absolute inset-0 bg-spekter-purple-glow"></div>
          <div className="absolute inset-0 bg-spekter-grid bg-grid opacity-20"></div>
          <div className="absolute inset-0 bg-spekter-diagonal opacity-15"></div>
          
          <div className="samsung-card p-8">
            <h2 className="font-black text-white mb-8 tracking-tight" style={{fontSize: '24px'}}>Game Information</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Featured News Image */}
              <div className="relative group">
                <div className="overflow-hidden rounded-xl border border-brand/20">
                  <img 
                    src="/Annoucement_Banner.png" 
                    alt="Featured News"
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
              
              {/* FAQ List */}
              <div className="space-y-3">
                {faqData.map((faq, index) => (
                  <div key={faq.id} className="group cursor-pointer" onClick={() => setSelectedFaq({question: faq.question, answer: faq.answer})}>
                    <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-spekter-surface/40 via-spekter-glass/30 to-spekter-surface/40 backdrop-blur-md rounded-xl border border-brand/20 hover:border-brand/40 transition-all duration-300 hover:from-spekter-surface/60 hover:via-spekter-glass/50 hover:to-spekter-surface/60 shadow-lg hover:shadow-spekter-glow">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-brand/20 border border-brand/30 rounded-lg flex items-center justify-center group-hover:bg-brand/30 transition-colors">
                          <svg className="w-4 h-4 text-brand" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.894A1 1 0 0018 16V3z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold text-base leading-relaxed group-hover:text-brand transition-colors">{faq.question}</h4>
                      </div>
                      <div className="flex-shrink-0">
                        <svg className="w-4 h-4 text-white/40 group-hover:text-brand transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Public Leaderboard Preview */}
        <div className="relative overflow-hidden rounded-xl">
          {/* Enhanced Background Gradients */}
          <div className="absolute inset-0 bg-spekter-blue-glow"></div>
          <div className="absolute inset-0 bg-spekter-purple-glow"></div>
          <div className="absolute inset-0 bg-spekter-grid bg-grid opacity-15"></div>
          <div className="absolute inset-0 bg-spekter-diagonal opacity-20"></div>
          
          <div className="samsung-card p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-white tracking-tight" style={{fontSize: '24px'}}>Top Spirit Hunters</h3>
              <Link href="/leaderboard" className="samsung-btn-primary">
                VIEW FULL LEADERBOARD
              </Link>
            </div>
            <div className="space-y-4">
              {creatorsLoading ? (
                [...Array(10)].map((_, index) => (
                  <div key={index} className="relative">
                    {/* Rank highlight for top 3 */}
                    {index < 3 && (
                      <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-brand to-brand/50 rounded-full"></div>
                    )}
                    <div className="samsung-card p-6">
                      <div className="flex items-center space-x-6">
                        {/* Rank */}
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-r from-spekter-surface/30 via-spekter-surface/50 to-spekter-surface/30 animate-pulse rounded-full"></div>
                        </div>
                        
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gradient-to-r from-spekter-surface/30 via-spekter-surface/50 to-spekter-surface/30 animate-pulse rounded-full"></div>
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 space-y-2">
                          <div className="w-32 h-6 bg-gradient-to-r from-spekter-surface/30 via-spekter-surface/50 to-spekter-surface/30 animate-pulse rounded"></div>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 h-5 bg-gradient-to-r from-spekter-surface/30 via-spekter-surface/50 to-spekter-surface/30 animate-pulse rounded-full"></div>
                            <div className="w-12 h-5 bg-gradient-to-r from-spekter-surface/30 via-spekter-surface/50 to-spekter-surface/30 animate-pulse rounded-full"></div>
                          </div>
                        </div>
                        
                        {/* Points */}
                        <div className="flex-shrink-0">
                          <div className="w-24 h-8 bg-gradient-to-r from-spekter-surface/30 via-spekter-surface/50 to-spekter-surface/30 animate-pulse rounded-lg"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                topCreators.map((creator, index) => (
                  <div key={creator.id} className="relative">
                    {/* Rank highlight for top 3 */}
                    {index < 3 && (
                      <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-brand to-brand/50 rounded-full"></div>
                    )}
                    <CreatorCard 
                      creator={creator} 
                      rank={index + 1}
                      compact={true}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* FAQ Modal */}
      {selectedFaq && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="samsung-card max-w-2xl w-full mx-4 p-6">
            {/* Header */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-white">{selectedFaq.question}</h3>
            </div>

            {/* Answer */}
            <div className="mb-6">
              <p className="text-delabs-text leading-relaxed">{selectedFaq.answer}</p>
            </div>

            {/* Close Button */}
            <div className="flex justify-center">
              <button
                onClick={() => setSelectedFaq(null)}
                className="samsung-btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
