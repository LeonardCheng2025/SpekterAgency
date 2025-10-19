import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import ContentTile from '@/components/ContentTile';
import Pagination from '@/components/Pagination';
import { useAuth } from '@/lib/hooks/useAuth';
import { Creator } from '@/data/mockData';
import { CreatorPageSkeleton } from '@/components/SkeletonLoader';

// 使用與 EmbeddedContent 相同的介面
interface ContentItem {
  id: string
  title: string
  description?: string
  platform: string
  platformVideoId: string
  contentType: string
  thumbnailUrl?: string
  duration?: number
  publishedAt: string
  isLive: boolean
  embedUrl?: string
  originalUrl?: string
  latestMetrics?: {
    views: number
    likes: number
    comments: number
  } | null
}

export default function CreatorProfile() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  
  const [creator, setCreator] = useState<Creator | null>(null);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;
  
  // Check if this is the current user's own profile
  const isOwnProfile = user && creator && user.name === creator.name;

  // Fetch creator data
  useEffect(() => {
    const fetchCreatorData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://ragnaroklibre-clutch-production.up.railway.app';
        
        // Fetch creator info
        const creatorResponse = await fetch(`${backendUrl}/api/leaderboard/creators`);
        if (!creatorResponse.ok) {
          throw new Error('Failed to fetch creator data');
        }
        
        const creatorsData = await creatorResponse.json();
        const foundCreator = creatorsData.creators.find((c: Creator) => c.id === id);
        
        if (!foundCreator) {
          throw new Error('Creator not found');
        }
        
        setCreator(foundCreator);
        
        // Fetch creator's content using the new API
        try {
          const contentResponse = await fetch(`${backendUrl}/api/content/creator/${id}`);
          if (contentResponse.ok) {
            const contentData = await contentResponse.json();
            setContent(contentData.contents || []);
          } else {
            console.warn('Failed to fetch creator content:', contentResponse.status);
            setContent([]);
          }
        } catch (contentError) {
          console.error('Error fetching creator content:', contentError);
          setContent([]);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching creator:', err);
        setError('Failed to load creator profile');
        setCreator(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorData();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <CreatorPageSkeleton />
      </Layout>
    );
  }

  if (error || !creator) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error || 'Creator not found'}</p>
            <button 
              onClick={() => router.push('/leaderboard')} 
              className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/80 transition-colors"
            >
              Back to Leaderboard
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Calculate rank (for now, just use a placeholder since we don't have sorted data)
  const rank = 1; // This would need to be calculated from the full leaderboard
  const totalPages = Math.ceil(content.length / itemsPerPage);
  const paginatedContent = content.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getTierBadge = (tier: string) => {
    const baseClasses = "px-3 py-1 rounded-md text-sm font-bold";
    switch (tier) {
      case 'Best': return `${baseClasses} tier-best`;
      case 'Partner': return `${baseClasses} tier-partner`;
      case 'Normal': return `${baseClasses} tier-normal`;
      default: return `${baseClasses} bg-gray-600`;
    }
  };

  const getPlatformBadge = (platform: string) => {
    const baseClasses = "platform-badge";
    switch (platform) {
      case 'YouTube': return `${baseClasses} platform-youtube`;
      case 'Facebook': return `${baseClasses} platform-facebook`;
      case 'Twitch': return `${baseClasses} platform-twitch`;
      default: return `${baseClasses} bg-gray-600`;
    }
  };




  return (
    <Layout>
      <div className="space-y-12">
        {/* Profile Header */}
        <div className="samsung-card p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
            <div className="relative">
              <img 
                src={creator.avatar} 
                alt={creator.name}
                className="w-24 h-24 rounded-full"
              />
              {creator.isLive && (
                <div className="absolute -bottom-2 -right-2 bg-red-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                  LIVE
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h1 className="text-3xl font-semibold text-fg tracking-tight">{creator.name}</h1>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {creator.platforms.map(platform => (
                  <span key={platform} className={getPlatformBadge(platform)}>
                    {platform}
                  </span>
                ))}
              </div>
              
              <div className="grid grid-cols-1 gap-8 text-sm">
                <div>
                  <p className="text-muted mb-2">Region</p>
                  <p className="font-semibold text-fg text-lg">{creator.region}</p>
                </div>
              </div>
            </div>
            

          </div>
        </div>


      {/* Content Section */}
      <div className="samsung-card">
        <div className="border-b border-line p-6">
          <h3 className="text-lg font-semibold text-fg">Videos/Streams ({content.length})</h3>
        </div>

        <div className="p-8">
          {content.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted text-lg">No content available yet</p>
              <p className="text-muted text-sm mt-2">Check back later for videos and streams</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedContent.map(item => {
                  // 轉換數據格式以匹配 ContentTile 組件的期望
                  const adaptedContent = {
                    id: item.id,
                    platform: item.platform as 'Telegram' | 'Mobile' | 'Web',
                    type: item.contentType as 'Spirit Hunt' | 'Mission' | 'Combo',
                    title: item.title,
                    date: item.publishedAt,
                    duration: item.duration ? `${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}` : '0:00',
                    spiritsHunted: item.latestMetrics?.views || 0,
                    sparkEarned: item.latestMetrics?.likes || 0,
                    combos: item.latestMetrics?.comments || 0,
                    valid: true, // 由於我們只顯示已批准的內容，所以都是有效的
                    thumbnail: item.thumbnailUrl || '/default-thumbnail.jpg',
                    originalUrl: item.originalUrl // 添加 originalUrl 以支持點擊跳轉
                  };
                  return (
                    <ContentTile key={item.id} content={adaptedContent} />
                  );
                })}
              </div>
              
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={content.length}
                />
              )}
            </>
          )}
        </div>
        </div>
      </div>
    </Layout>
  );
}

