import { useState, useMemo, useEffect } from 'react';
import Layout from '@/components/Layout';
import FiltersBar from '@/components/FiltersBar';
import LeaderboardTable from '@/components/LeaderboardTable';
import Pagination from '@/components/Pagination';
import CurrentUserRank from '@/components/CurrentUserRank';
import { Creator } from '@/data/mockData';
import { useAuth } from '@/lib/hooks/useAuth';
import { LeaderboardSkeleton } from '@/components/SkeletonLoader';

export default function Leaderboard() {
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 100;
  
  const { user } = useAuth();

  // Fetch creators data
  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setLoading(true);
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://ragnaroklibre-clutch-production.up.railway.app';
        const response = await fetch(`${backendUrl}/api/leaderboard/creators?region=${selectedRegion}&platform=${selectedPlatform}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch creators');
        }
        
        const data = await response.json();
        setCreators(data.creators || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching creators:', err);
        setError('Failed to load leaderboard data');
        setCreators([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, [selectedRegion, selectedPlatform]);

  const filterOptions = {
    regions: [
      { value: 'All', label: 'All Regions' },
      { value: 'Taiwan', label: 'Taiwan' },
      { value: 'Thailand', label: 'Thailand' }
    ],
    platforms: [
      { value: 'All', label: 'All Platforms' },
      { value: 'YouTube', label: 'YouTube' },
      { value: 'Twitch', label: 'Twitch' }
    ]
  };

  // Find current user from creators list
  const currentUser = useMemo(() => {
    if (!user || !creators.length) return null;
    return creators.find(creator => creator.name === user.name) || null;
  }, [user, creators]);

  const filteredCreators = useMemo(() => {
    // Data is already filtered from API, just return it
    return creators;
  }, [creators]);

  const totalPages = Math.ceil(filteredCreators.length / itemsPerPage);

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [selectedRegion, selectedPlatform]);

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/80 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-12">
        {/* Current User Ranking - Moved to top */}
        {currentUser && (
          <CurrentUserRank 
            currentUser={currentUser}
            allCreators={creators}
          />
        )}

        {/* Filters */}
        <FiltersBar
          regions={filterOptions.regions}
          platforms={filterOptions.platforms}
          selectedRegion={selectedRegion}
          selectedPlatform={selectedPlatform}
          onRegionChange={setSelectedRegion}
          onPlatformChange={setSelectedPlatform}
        />

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(20)].map((_, index) => (
              <div key={index} className={index >= 20 ? 'opacity-90' : ''}>
                <div className="samsung-card p-6">
                  <div className="flex items-center space-x-6">
                    {/* Rank */}
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-r from-delabs-surface/30 via-delabs-surface/50 to-delabs-surface/30 animate-pulse rounded-full"></div>
                    </div>
                    
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-r from-delabs-surface/30 via-delabs-surface/50 to-delabs-surface/30 animate-pulse rounded-full"></div>
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 space-y-2">
                      <div className="w-32 h-6 bg-gradient-to-r from-delabs-surface/30 via-delabs-surface/50 to-delabs-surface/30 animate-pulse rounded"></div>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-5 bg-gradient-to-r from-delabs-surface/30 via-delabs-surface/50 to-delabs-surface/30 animate-pulse rounded-full"></div>
                        <div className="w-12 h-5 bg-gradient-to-r from-delabs-surface/30 via-delabs-surface/50 to-delabs-surface/30 animate-pulse rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    {index < 20 && (
                      <div className="flex-shrink-0 space-y-1">
                        <div className="w-20 h-4 bg-gradient-to-r from-delabs-surface/30 via-delabs-surface/50 to-delabs-surface/30 animate-pulse rounded"></div>
                        <div className="w-16 h-4 bg-gradient-to-r from-delabs-surface/30 via-delabs-surface/50 to-delabs-surface/30 animate-pulse rounded"></div>
                      </div>
                    )}
                    
                    {/* Points */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-8 bg-gradient-to-r from-delabs-surface/30 via-delabs-surface/50 to-delabs-surface/30 animate-pulse rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Leaderboard Table */}
            <LeaderboardTable 
              creators={filteredCreators}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
            />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredCreators.length}
            />
          </>
        )}
      </div>
    </Layout>
  );
}
