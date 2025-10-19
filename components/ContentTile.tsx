import { ContentItem } from '@/data/mockData';
import { PlayIcon, VideoCameraIcon, TvIcon } from '@heroicons/react/24/solid';

interface ContentTileProps {
  content: ContentItem & { originalUrl?: string };
}

export default function ContentTile({ content }: ContentTileProps) {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'YouTube': return <PlayIcon className="w-4 h-4" />;
      case 'Facebook': return <VideoCameraIcon className="w-4 h-4" />;
      case 'Twitch': return <TvIcon className="w-4 h-4" />;
      default: return <VideoCameraIcon className="w-4 h-4" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    const baseStyle = 'text-white font-semibold backdrop-blur-md border border-white/20 uppercase tracking-wide';
    switch (platform) {
      case 'YouTube': return `bg-black/60 ${baseStyle}`;
      case 'Facebook': return `bg-black/60 ${baseStyle}`;
      case 'Twitch': return `bg-black/60 ${baseStyle}`;
      default: return `bg-black/60 ${baseStyle}`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CardWrapper = content.originalUrl ? 'a' : 'article';
  const wrapperProps = content.originalUrl ? {
    href: content.originalUrl,
    target: '_blank',
    rel: 'noopener noreferrer',
    className: 'samsung-card block hover:shadow-glow-red transition-all duration-300 cursor-pointer'
  } : {
    className: 'samsung-card'
  };

  return (
    <CardWrapper {...wrapperProps}>
      <div className="relative">
        <img 
          src={content.thumbnail} 
          alt={content.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3 flex space-x-2">
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPlatformColor(content.platform)} flex items-center space-x-1`}>
            {getPlatformIcon(content.platform)} <span>{content.platform}</span>
          </span>
          <span className="bg-black/80 text-white px-2 py-1 rounded-md text-xs font-medium">
            {content.duration}
          </span>
        </div>
        {content.originalUrl && (
          <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <PlayIcon className="w-8 h-8 text-white" />
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="font-semibold text-fg mb-3 line-clamp-2 leading-tight">{content.title}</h3>
        
        <div className="flex items-center justify-between text-sm text-muted mb-4">
          <span className="font-medium">{content.type}</span>
          <span>{formatDate(content.date)}</span>
        </div>
        

      </div>
    </CardWrapper>
  );
}
