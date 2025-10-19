import { Creator } from '@/data/mockData';

interface CurrentUserRankProps {
  currentUser: Creator;
  allCreators: Creator[];
}

export default function CurrentUserRank({ currentUser, allCreators }: CurrentUserRankProps) {
  // Calculate user's rank in the full leaderboard
  const sortedCreators = [...allCreators].sort((a, b) => b.totalPoints - a.totalPoints);
  const currentRank = sortedCreators.findIndex(c => c.id === currentUser.id) + 1;

  const getRegionBadge = (region: string) => {
    const baseClasses = "px-3 py-1 rounded-md text-sm font-semibold";
    switch (region) {
      case 'Taiwan': return `${baseClasses} bg-blue-600 text-white`;
      case 'Thailand': return `${baseClasses} bg-green-600 text-white`;
      default: return `${baseClasses} bg-gray-500 text-white`;
    }
  };

  const getPlatformBadge = (platform: string) => {
    const baseClasses = "platform-badge";
    switch (platform) {
      case 'YouTube': return `${baseClasses} platform-youtube`;
      case 'Facebook': return `${baseClasses} platform-facebook`;
      case 'Twitch': return `${baseClasses} platform-twitch`;
      default: return `${baseClasses} bg-gray-100 text-gray-700 border-gray-300`;
    }
  };

  return (
    <div className="mt-12">
      {/* Section Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-fg">Your Current Ranking</h2>
      </div>

      {/* Current User Card */}
      <div className="samsung-card p-6 border-2 border-brand/30 bg-gradient-to-r from-brand/5 to-transparent">
        <div className="flex items-start space-x-6">
          {/* Rank Badge */}
          <div className="relative flex-shrink-0">
            <div className="absolute -top-3 -left-3 bg-brand text-white text-base rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-glow-red">
              #{currentRank}
            </div>
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-brand/50"
            />
            {currentUser.isLive && (
              <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded font-medium">
                LIVE
              </div>
            )}
          </div>
          
          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <h3 className="text-xl font-semibold text-fg">{currentUser.name}</h3>
              <span className={getRegionBadge(currentUser.region)}>{currentUser.region}</span>
            </div>
            
            <div className="flex items-center space-x-2 mb-6">
              {currentUser.platforms.map(platform => (
                <span key={platform} className={getPlatformBadge(platform)}>
                  {platform}
                </span>
              ))}
            </div>
            
            {/* Optimized Stats Layout - Single Row */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-delabs-surface/30 rounded-xl p-3 border border-delabs-surface/50 hover:border-brand/30 transition-all duration-200">
                <p className="text-delabs-text text-xs mb-1 font-medium">Referred Players</p>
                <p className="font-bold text-white text-xl">{(currentUser as any).referralCount || 0}</p>
              </div>
              <div className="bg-delabs-surface/30 rounded-xl p-3 border border-delabs-surface/50 hover:border-brand/30 transition-all duration-200">
                <p className="text-delabs-text text-xs mb-1 font-medium">Total Spend</p>
                <p className="font-bold text-white text-xl">${((currentUser as any).purchaseAmountTotal || 0).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
