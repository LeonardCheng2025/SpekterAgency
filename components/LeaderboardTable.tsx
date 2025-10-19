import { Creator } from '@/data/mockData';
import CreatorCard from './CreatorCard';

interface LeaderboardTableProps {
  creators: Creator[];
  currentPage: number;
  itemsPerPage: number;
}

export default function LeaderboardTable({ creators, currentPage, itemsPerPage }: LeaderboardTableProps) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCreators = creators.slice(startIndex, endIndex);

  const getGlobalRank = (index: number) => startIndex + index + 1;

  // All cards use the same size (no compact mode)
  const isTopTwenty = (rank: number) => rank <= 20;

  return (
    <div className="space-y-4">
      {paginatedCreators.map((creator, index) => {
        const rank = getGlobalRank(index);
        const isTop20 = isTopTwenty(rank);
        
        return (
          <div key={creator.id} className={isTop20 ? '' : 'opacity-90'}>
            <CreatorCard 
              creator={creator} 
              rank={rank}
              compact={false}
            />
          </div>
        );
      })}
    </div>
  );
}
