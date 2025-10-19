import { Creator } from '@/data/mockData';

interface CreatorCardProps {
  creator: Creator;
  rank?: number;
  compact?: boolean;
}

export default function CreatorCard({ creator, rank, compact = false }: CreatorCardProps) {
  // Check if this is the current user's card
  const currentUserId = 'ares'; // This would normally come from auth context
  const isOwnCard = creator.id === currentUserId;

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

  if (compact) {
    return (
      <div className="samsung-card p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-shrink-0">
              {rank && (
                <div className="absolute -top-2 -left-2 bg-brand text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                  {rank}
                </div>
              )}
              <img 
                src={creator.avatar} 
                alt={creator.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              {creator.isLive && (
                <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs px-1 rounded">
                  LIVE
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-fg truncate">{creator.name}</h3>
                <span className={getRegionBadge(creator.region)}>{creator.region}</span>
              </div>
            <div className="flex items-center space-x-1">
              {creator.platforms.map(platform => (
                <span key={platform} className={getPlatformBadge(platform)}>
                  {platform}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <div className="text-right">
              <div className="text-2xl font-bold text-brand mb-1">
                {creator.leaderboardScore?.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-fg-muted">Total Score</div>
            </div>
          </div>

        </div>
        </div>
    );
  }

  return (
    <div className="samsung-card p-6">
        <div className="flex items-start space-x-6">
          <div className="relative flex-shrink-0">
            {rank && (
              <div className="absolute -top-3 -left-3 bg-brand text-white text-sm rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                {rank}
              </div>
            )}
            <img 
              src={creator.avatar} 
              alt={creator.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            {creator.isLive && (
              <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded">
                LIVE
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <h3 className="text-lg font-semibold text-fg">{creator.name}</h3>
              <span className={getRegionBadge(creator.region)}>{creator.region}</span>
            </div>
            
            <div className="flex items-center space-x-2 mb-4">
              {creator.platforms.map(platform => (
                <span key={platform} className={getPlatformBadge(platform)}>
                  {platform}
                </span>
              ))}
            </div>
            

          </div>
          
          <div className="flex-shrink-0">
            <div className="text-right">
              <div className="text-3xl font-bold text-brand mb-1">
                {creator.leaderboardScore?.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-fg-muted">Total Score</div>
            </div>
          </div>

        </div>
      </div>
  );
}
