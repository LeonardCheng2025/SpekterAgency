import React from 'react'

// 基礎骨架屏組件
export const Skeleton = ({ 
  className = "", 
  width = "w-full", 
  height = "h-4",
  rounded = "rounded"
}: { 
  className?: string
  width?: string
  height?: string
  rounded?: string
}) => (
  <div 
    className={`${width} ${height} ${rounded} bg-gradient-to-r from-delabs-surface/30 via-delabs-surface/50 to-delabs-surface/30 animate-pulse ${className}`}
  />
)

// Hero Section 骨架屏
export const HeroSkeleton = () => (
  <div className="relative overflow-hidden rounded-xl">
    {/* Background with red glow and grid */}
    <div className="absolute inset-0 bg-delabs-hero"></div>
    <div className="absolute inset-0 bg-delabs-grid bg-grid opacity-30"></div>
    <div className="absolute inset-0 bg-delabs-diagonal opacity-20"></div>
    
    <div className="relative z-10 p-12 text-center">
      {/* Season Info Skeleton */}
      <div className="mb-8 flex justify-center">
        <div className="inline-flex items-center space-x-3 bg-black/20 backdrop-blur-md rounded-full px-6 py-3 border border-brand/20">
          <Skeleton width="w-16" height="h-6" rounded="rounded-full" />
          <Skeleton width="w-12" height="h-4" rounded="rounded" />
          <Skeleton width="w-24" height="h-4" rounded="rounded" />
        </div>
      </div>
      
      {/* Prize Pool Skeleton */}
      <div className="mb-8">
        <div className="mb-4">
          <Skeleton width="w-32" height="h-20" rounded="rounded-lg" className="mx-auto" />
        </div>
        <Skeleton width="w-48" height="h-6" rounded="rounded" className="mx-auto mb-6" />
        <Skeleton width="w-64" height="h-8" rounded="rounded" className="mx-auto" />
      </div>
      
      {/* Days Remaining Skeleton */}
      <div className="flex justify-center">
        <div className="inline-flex items-center bg-black/30 backdrop-blur-md rounded-full px-6 py-3 border border-brand/30">
          <div className="w-2.5 h-2.5 bg-brand/50 rounded-full mr-2.5 animate-pulse"></div>
          <Skeleton width="w-16" height="h-4" rounded="rounded" />
        </div>
      </div>
    </div>
  </div>
)

// FAQ Section 骨架屏
export const FAQSkeleton = () => (
  <div className="relative overflow-hidden rounded-xl">
    {/* Background */}
    <div className="absolute inset-0 bg-delabs-red-glow"></div>
    <div className="absolute inset-0 bg-delabs-grid bg-grid opacity-20"></div>
    
    <div className="samsung-card p-8">
      <Skeleton width="w-64" height="h-8" rounded="rounded" className="mb-8" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Featured Image Skeleton */}
        <div className="relative">
          <div className="overflow-hidden rounded-xl border border-brand/20">
            <Skeleton width="w-full" height="h-80" rounded="rounded-xl" />
          </div>
        </div>
        
        {/* FAQ List Skeleton */}
        <div className="space-y-3">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-black/20 backdrop-blur-md rounded-xl border border-brand/10">
              <div className="flex-shrink-0">
                <Skeleton width="w-8" height="h-8" rounded="rounded-lg" />
              </div>
              <div className="flex-1">
                <Skeleton width="w-full" height="h-5" rounded="rounded" />
              </div>
              <div className="flex-shrink-0">
                <Skeleton width="w-4" height="h-4" rounded="rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

// Creator Card 骨架屏
export const CreatorCardSkeleton = ({ compact = false }: { compact?: boolean }) => (
  <div className="samsung-card p-6">
    <div className="flex items-center space-x-6">
      {/* Rank */}
      <div className="flex-shrink-0">
        <Skeleton width="w-8" height="h-8" rounded="rounded-full" />
      </div>
      
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Skeleton width="w-16" height="h-16" rounded="rounded-full" />
      </div>
      
      {/* Info */}
      <div className="flex-1 space-y-2">
        <Skeleton width="w-32" height="h-6" rounded="rounded" />
        <div className="flex items-center space-x-2">
          <Skeleton width="w-16" height="h-5" rounded="rounded-full" />
          <Skeleton width="w-12" height="h-5" rounded="rounded-full" />
        </div>
      </div>
      
      {/* Stats */}
      {!compact && (
        <div className="flex-shrink-0 space-y-1">
          <Skeleton width="w-20" height="h-4" rounded="rounded" />
          <Skeleton width="w-16" height="h-4" rounded="rounded" />
        </div>
      )}
      
      {/* Points */}
      <div className="flex-shrink-0">
        <Skeleton width="w-24" height="h-8" rounded="rounded-lg" />
      </div>
    </div>
  </div>
)

// Top Creators Section 骨架屏
export const TopCreatorsSkeleton = () => (
  <div className="relative overflow-hidden rounded-xl">
    {/* Background */}
    <div className="absolute inset-0 bg-delabs-red-glow"></div>
    <div className="absolute inset-0 bg-delabs-diagonal opacity-10"></div>
    
    <div className="samsung-card p-8">
      <div className="flex items-center justify-between mb-8">
        <Skeleton width="w-32" height="h-8" rounded="rounded" />
        <Skeleton width="w-48" height="h-10" rounded="rounded-lg" />
      </div>
      
      <div className="space-y-4">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="relative">
            {/* Rank highlight for top 3 */}
            {index < 3 && (
              <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-brand to-brand/50 rounded-full"></div>
            )}
            <CreatorCardSkeleton compact={true} />
          </div>
        ))}
      </div>
    </div>
  </div>
)

// 完整的 Dashboard 骨架屏
export const DashboardSkeleton = () => (
  <div className="space-y-12">
    <HeroSkeleton />
    <FAQSkeleton />
    <TopCreatorsSkeleton />
  </div>
)

// Current User Rank 骨架屏
export const CurrentUserRankSkeleton = () => (
  <div className="samsung-card p-6">
    <div className="flex items-center justify-between mb-4">
      <Skeleton width="w-32" height="h-6" rounded="rounded" />
      <Skeleton width="w-24" height="h-8" rounded="rounded-lg" />
    </div>
    
    <div className="flex items-center space-x-6">
      {/* Rank */}
      <div className="flex-shrink-0">
        <Skeleton width="w-12" height="h-12" rounded="rounded-full" />
      </div>
      
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Skeleton width="w-20" height="h-20" rounded="rounded-full" />
      </div>
      
      {/* Info */}
      <div className="flex-1 space-y-3">
        <Skeleton width="w-40" height="h-7" rounded="rounded" />
        <div className="flex items-center space-x-2">
          <Skeleton width="w-20" height="h-5" rounded="rounded-full" />
          <Skeleton width="w-16" height="h-5" rounded="rounded-full" />
        </div>
      </div>
      
      {/* Stats */}
      <div className="flex-shrink-0 space-y-2">
        <Skeleton width="w-24" height="h-5" rounded="rounded" />
        <Skeleton width="w-20" height="h-5" rounded="rounded" />
      </div>
      
      {/* Points */}
      <div className="flex-shrink-0">
        <Skeleton width="w-32" height="h-10" rounded="rounded-lg" />
      </div>
    </div>
  </div>
)

// Filters Bar 骨架屏
export const FiltersBarSkeleton = () => (
  <div className="samsung-card p-6">
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <Skeleton width="w-32" height="h-6" rounded="rounded" />
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton width="w-40" height="h-10" rounded="rounded-lg" />
        <Skeleton width="w-40" height="h-10" rounded="rounded-lg" />
      </div>
    </div>
  </div>
)

// Leaderboard Table 骨架屏
export const LeaderboardTableSkeleton = ({ itemCount = 20 }: { itemCount?: number }) => (
  <div className="space-y-4">
    {[...Array(itemCount)].map((_, index) => (
      <CreatorCardSkeleton key={index} compact={index >= 20} />
    ))}
  </div>
)

// Pagination 骨架屏
export const PaginationSkeleton = () => (
  <div className="flex items-center justify-center space-x-2">
    <Skeleton width="w-20" height="h-10" rounded="rounded-lg" />
    <Skeleton width="w-8" height="h-10" rounded="rounded-lg" />
    <Skeleton width="w-8" height="h-10" rounded="rounded-lg" />
    <Skeleton width="w-8" height="h-10" rounded="rounded-lg" />
    <Skeleton width="w-20" height="h-10" rounded="rounded-lg" />
  </div>
)

// 完整的 Leaderboard 骨架屏
export const LeaderboardSkeleton = () => (
  <div className="space-y-12">
    <CurrentUserRankSkeleton />
    <FiltersBarSkeleton />
    <LeaderboardTableSkeleton />
    <PaginationSkeleton />
  </div>
)

// User Basic Information 骨架屏
export const UserBasicInfoSkeleton = () => (
  <div className="samsung-card p-6 mb-8">
    <div className="flex items-center space-x-6">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Skeleton width="w-20" height="h-20" rounded="rounded-full" />
      </div>
      
      {/* User Info */}
      <div className="flex-1 space-y-3">
        <Skeleton width="w-48" height="h-8" rounded="rounded" />
        <Skeleton width="w-64" height="h-5" rounded="rounded" />
        <Skeleton width="w-32" height="h-4" rounded="rounded" />
      </div>
    </div>
  </div>
)

// Platform Connections 骨架屏
export const PlatformConnectionsSkeleton = () => (
  <div className="samsung-card p-6">
    <Skeleton width="w-40" height="h-6" rounded="rounded" className="mb-4" />
    
    <div className="space-y-4">
      {[...Array(2)].map((_, index) => (
        <div key={index} className="flex items-center justify-between p-4 bg-delabs-surface/50 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-delabs-surface">
              <Skeleton width="w-6" height="h-6" rounded="rounded" />
            </div>
            <div className="space-y-1">
              <Skeleton width="w-20" height="h-5" rounded="rounded" />
              <Skeleton width="w-24" height="h-4" rounded="rounded" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton width="w-16" height="h-4" rounded="rounded" />
            <Skeleton width="w-2" height="h-2" rounded="rounded-full" />
          </div>
        </div>
      ))}
    </div>
  </div>
)

// Referral Status 骨架屏
export const ReferralStatusSkeleton = () => (
  <div className="samsung-card p-6">
    <Skeleton width="w-32" height="h-6" rounded="rounded" className="mb-4" />
    
    <div className="space-y-4">
      {/* Referral Link Manager */}
      <div className="space-y-2">
        <Skeleton width="w-full" height="h-10" rounded="rounded-lg" />
        <Skeleton width="w-24" height="h-8" rounded="rounded-lg" />
      </div>
      
      {/* Stats */}
      <div className="border-t border-delabs-surface pt-4 space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton width="w-40" height="h-4" rounded="rounded" />
          <Skeleton width="w-8" height="h-4" rounded="rounded" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton width="w-48" height="h-4" rounded="rounded" />
          <Skeleton width="w-16" height="h-4" rounded="rounded" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton width="w-20" height="h-3" rounded="rounded" />
          <Skeleton width="w-24" height="h-3" rounded="rounded" />
        </div>
      </div>
    </div>
  </div>
)

// Content Submission Form 骨架屏
export const ContentSubmissionFormSkeleton = () => (
  <div className="samsung-card p-6">
    <Skeleton width="w-36" height="h-6" rounded="rounded" className="mb-6" />
    
    <div className="space-y-4">
      {/* Platform */}
      <div>
        <Skeleton width="w-16" height="h-4" rounded="rounded" className="mb-2" />
        <Skeleton width="w-full" height="h-12" rounded="rounded-lg" />
      </div>
      
      {/* URL Input */}
      <div className="flex-grow">
        <Skeleton width="w-24" height="h-4" rounded="rounded" className="mb-2" />
        <Skeleton width="w-full" height="h-12" rounded="rounded-lg" />
      </div>
      
      {/* Submit Button */}
      <Skeleton width="w-full" height="h-12" rounded="rounded-lg" />
    </div>
  </div>
)

// My Content Section 骨架屏 (類似 EmbeddedContent 的骨架屏)
export const MyContentSkeleton = () => (
  <div className="mt-8">
    <Skeleton width="w-32" height="h-6" rounded="rounded" className="mb-6" />
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="samsung-card p-4">
          {/* Thumbnail */}
          <Skeleton width="w-full" height="h-32" rounded="rounded-lg" className="mb-4" />
          
          {/* Platform Badge */}
          <div className="flex items-center justify-between mb-2">
            <Skeleton width="w-16" height="h-5" rounded="rounded-full" />
            <Skeleton width="w-12" height="h-4" rounded="rounded" />
          </div>
          
          {/* Title */}
          <Skeleton width="w-full" height="h-5" rounded="rounded" className="mb-2" />
          <Skeleton width="w-3/4" height="h-5" rounded="rounded" className="mb-3" />
          
          {/* Stats */}
          <div className="flex items-center justify-between text-xs">
            <Skeleton width="w-16" height="h-4" rounded="rounded" />
            <Skeleton width="w-12" height="h-4" rounded="rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
)

// 完整的 Profile 骨架屏
export const ProfileSkeleton = () => (
  <div className="min-h-screen">
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* User Basic Information */}
        <UserBasicInfoSkeleton />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <PlatformConnectionsSkeleton />
            <ReferralStatusSkeleton />
          </div>

          {/* Right Column */}
          <div>
            <ContentSubmissionFormSkeleton />
          </div>
        </div>

        {/* My Content Section */}
        <MyContentSkeleton />
      </div>
    </div>
  </div>
)

// Creator Profile Header 骨架屏
export const CreatorProfileHeaderSkeleton = () => (
  <div className="samsung-card p-8">
    <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
      {/* Avatar */}
      <div className="relative">
        <Skeleton width="w-24" height="h-24" rounded="rounded-full" />
      </div>
      
      {/* Creator Info */}
      <div className="flex-1">
        {/* Name and badges */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <Skeleton width="w-48" height="h-9" rounded="rounded" />
          <Skeleton width="w-16" height="h-7" rounded="rounded-md" />
          <Skeleton width="w-20" height="h-7" rounded="rounded-md" />
        </div>
        
        {/* Platform badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Skeleton width="w-20" height="h-6" rounded="rounded-full" />
          <Skeleton width="w-16" height="h-6" rounded="rounded-full" />
        </div>
        
        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <Skeleton width="w-16" height="h-4" rounded="rounded" className="mb-2" />
            <Skeleton width="w-20" height="h-6" rounded="rounded" />
          </div>
          <div>
            <Skeleton width="w-20" height="h-4" rounded="rounded" className="mb-2" />
            <Skeleton width="w-16" height="h-6" rounded="rounded" />
          </div>
          <div>
            <Skeleton width="w-12" height="h-4" rounded="rounded" className="mb-2" />
            <Skeleton width="w-16" height="h-6" rounded="rounded" />
          </div>
          <div>
            <Skeleton width="w-20" height="h-4" rounded="rounded" className="mb-2" />
            <Skeleton width="w-24" height="h-6" rounded="rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
)

// Creator Content Section 骨架屏
export const CreatorContentSectionSkeleton = () => (
  <div className="samsung-card">
    <div className="border-b border-line p-6">
      <Skeleton width="w-40" height="h-6" rounded="rounded" />
    </div>

    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="samsung-card">
            <div className="relative">
              {/* Thumbnail */}
              <Skeleton width="w-full" height="h-48" rounded="rounded" />
              
              {/* Platform and duration badges */}
              <div className="absolute top-3 left-3 flex space-x-2">
                <Skeleton width="w-20" height="h-6" rounded="rounded-md" />
                <Skeleton width="w-12" height="h-6" rounded="rounded-md" />
              </div>
            </div>

            <div className="p-4">
              {/* Title */}
              <Skeleton width="w-full" height="h-5" rounded="rounded" className="mb-2" />
              <Skeleton width="w-3/4" height="h-5" rounded="rounded" className="mb-3" />
              
              {/* Stats */}
              <div className="flex items-center justify-between text-sm">
                <Skeleton width="w-16" height="h-4" rounded="rounded" />
                <Skeleton width="w-20" height="h-4" rounded="rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination skeleton */}
      <div className="mt-8">
        <PaginationSkeleton />
      </div>
    </div>
  </div>
)

// 完整的 Creator 頁面骨架屏
export const CreatorPageSkeleton = () => (
  <div className="space-y-12">
    <CreatorProfileHeaderSkeleton />
    <CreatorContentSectionSkeleton />
  </div>
)
