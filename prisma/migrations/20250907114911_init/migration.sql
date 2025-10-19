-- CreateEnum
CREATE TYPE "public"."Platform" AS ENUM ('YOUTUBE', 'FACEBOOK', 'TWITCH');

-- CreateEnum
CREATE TYPE "public"."ContentType" AS ENUM ('VIDEO', 'LIVE_STREAM', 'SHORT', 'POST');

-- CreateEnum
CREATE TYPE "public"."ValidationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW');

-- CreateEnum
CREATE TYPE "public"."ReferralType" AS ENUM ('IAP_SPENDING', 'ONCHAIN_SPENDING', 'REGISTRATION');

-- CreateEnum
CREATE TYPE "public"."AnnouncementType" AS ENUM ('INFO', 'WARNING', 'SUCCESS', 'PROMOTION');

-- CreateTable
CREATE TABLE "public"."creators" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "avatar" TEXT,
    "region" TEXT,
    "tier" TEXT NOT NULL DEFAULT 'Normal',
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "contentPoints" INTEGER NOT NULL DEFAULT 0,
    "referralPoints" INTEGER NOT NULL DEFAULT 0,
    "estimatedReward" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "manualMode" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "creators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."platform_connections" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "platform" "public"."Platform" NOT NULL,
    "platformId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "tokenExpiry" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSync" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contents" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "platformId" TEXT NOT NULL,
    "contentType" "public"."ContentType" NOT NULL,
    "platform" "public"."Platform" NOT NULL,
    "platformVideoId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "thumbnailUrl" TEXT,
    "duration" INTEGER,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "liveStatus" TEXT,
    "validationStatus" "public"."ValidationStatus" NOT NULL DEFAULT 'PENDING',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."content_metrics" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "dislikes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "subscribersGained" INTEGER,
    "impressions" INTEGER,
    "clickThroughRate" DOUBLE PRECISION,
    "averageViewDuration" INTEGER,
    "reach" INTEGER,
    "engagement" INTEGER,
    "reactions" INTEGER,
    "peakViewers" INTEGER,
    "averageViewers" INTEGER,
    "chatMessages" INTEGER,
    "followers" INTEGER,
    "retrievedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."content_analytics" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "audienceRetention" JSONB,
    "demographics" JSONB,
    "trafficSources" JSONB,
    "playbackLocations" JSONB,
    "deviceTypes" JSONB,
    "watchTimeMinutes" DOUBLE PRECISION,
    "averageWatchTime" DOUBLE PRECISION,
    "peakConcurrentViewers" INTEGER,
    "engagementRate" DOUBLE PRECISION,
    "commentSentiment" JSONB,
    "topComments" JSONB,
    "retrievedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."creator_metrics" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "platform" "public"."Platform" NOT NULL,
    "subscriberCount" INTEGER NOT NULL DEFAULT 0,
    "totalViews" INTEGER NOT NULL DEFAULT 0,
    "totalVideos" INTEGER NOT NULL DEFAULT 0,
    "contentScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "engagementScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "growthScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "retrievedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "creator_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."referrals" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "referredUserId" TEXT,
    "referralCode" TEXT,
    "type" "public"."ReferralType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "gameData" JSONB,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."support_comments" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "playerName" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "rating" INTEGER,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."announcements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "public"."AnnouncementType" NOT NULL DEFAULT 'INFO',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "linkUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."seasons" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "rewards" JSONB,
    "rules" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seasons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "creators_email_key" ON "public"."creators"("email");

-- CreateIndex
CREATE UNIQUE INDEX "platform_connections_creatorId_platform_key" ON "public"."platform_connections"("creatorId", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "contents_platform_platformVideoId_key" ON "public"."contents"("platform", "platformVideoId");

-- AddForeignKey
ALTER TABLE "public"."platform_connections" ADD CONSTRAINT "platform_connections_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."creators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contents" ADD CONSTRAINT "contents_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."creators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contents" ADD CONSTRAINT "contents_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "public"."platform_connections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."content_metrics" ADD CONSTRAINT "content_metrics_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "public"."contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."content_analytics" ADD CONSTRAINT "content_analytics_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "public"."contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."creator_metrics" ADD CONSTRAINT "creator_metrics_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."creators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."referrals" ADD CONSTRAINT "referrals_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."creators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."support_comments" ADD CONSTRAINT "support_comments_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."creators"("id") ON DELETE CASCADE ON UPDATE CASCADE;
