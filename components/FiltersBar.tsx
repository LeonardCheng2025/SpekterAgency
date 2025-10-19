interface FilterOption {
  value: string;
  label: string;
}

interface FiltersBarProps {
  regions: FilterOption[];
  platforms: FilterOption[];
  selectedRegion: string;
  selectedPlatform: string;
  onRegionChange: (region: string) => void;
  onPlatformChange: (platform: string) => void;
}

export default function FiltersBar({
  regions,
  platforms,
  selectedRegion,
  selectedPlatform,
  onRegionChange,
  onPlatformChange
}: FiltersBarProps) {
  return (
    <div className="samsung-card p-6 mb-8">
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center space-x-3">
          <label className="text-sm font-medium text-muted">Region:</label>
          <select 
            value={selectedRegion}
            onChange={(e) => onRegionChange(e.target.value)}
            className="bg-accent border border-line rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 min-h-[44px] backdrop-blur-md font-medium"
          >
            {regions.map(region => (
              <option key={region.value} value={region.value}>
                {region.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-3">
          <label className="text-sm font-medium text-muted">Platform:</label>
          <select 
            value={selectedPlatform}
            onChange={(e) => onPlatformChange(e.target.value)}
            className="bg-accent border border-line rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 min-h-[44px] backdrop-blur-md font-medium"
          >
            {platforms.map(platform => (
              <option key={platform.value} value={platform.value}>
                {platform.label}
              </option>
            ))}
          </select>
        </div>
        

        
        <div className="ml-auto">
          <button 
            onClick={() => {
              onRegionChange('All');
              onPlatformChange('All');
            }}
            className="samsung-btn-secondary"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
