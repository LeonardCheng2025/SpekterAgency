import { ArrowUpIcon, ArrowDownIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export default function KpiCard({ title, value, subtitle, icon, trend, trendValue }: KpiCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-muted';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <ArrowUpIcon className="w-4 h-4" />;
      case 'down': return <ArrowDownIcon className="w-4 h-4" />;
      default: return <ArrowRightIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="samsung-card p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted">{title}</h3>
        {icon && <div className="text-brand">{icon}</div>}
      </div>
      
      <div className="flex items-baseline space-x-3">
        <p className="text-2xl font-semibold text-fg tracking-tight">{formatValue(value)}</p>
        {trend && trendValue && (
          <span className={`text-sm font-medium ${getTrendColor()} flex items-center space-x-1`}>
            {getTrendIcon()} <span>{trendValue}</span>
          </span>
        )}
      </div>
      
      {subtitle && (
        <p className="text-sm text-muted mt-2">{subtitle}</p>
      )}
    </div>
  );
}
