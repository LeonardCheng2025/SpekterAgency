export interface Creator {
  id: string;
  name: string;
  platforms: ('YouTube' | 'Twitch' | 'Facebook' | 'X')[];
  contentCount: number;
  totalViews: number;
  referralCount: number;
  iapGenerated: number;
  iapSpending: number;
  onchainSpending: number;
  newPlayers: number;
  totalPoints: number;
  tier: 'Master' | 'Expert' | 'Creator';
  isLive: boolean;
  avatar: string;
  region: 'Global' | 'Asia' | 'Americas';
  leaderboardScore?: number;
  purchaseAmountTotal?: number;
}

export interface ContentItem {
  id: string;
  platform: 'YouTube' | 'Twitch' | 'Facebook' | 'X';
  type: 'Video' | 'Stream' | 'Post';
  title: string;
  date: string;
  duration: string;
  views: number;
  likes: number;
  shares: number;
  valid: boolean;
  thumbnail: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'info' | 'warning' | 'success';
}

// Helper function to generate random scores between 100-5500
const generateRandomScore = () => Math.floor(Math.random() * 5400) + 100;

// Helper function to generate random avatar URL
const generateAvatar = (seed: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;

// Mock creators data - 50 content creators with diverse profiles
export const mockCreators: Creator[] = [
  // Top Tier Content Creators (Master)
  {
    id: "twro-meet",
    name: "twro相見",
    platforms: ["YouTube", "Twitch"],
    contentCount: 156789,
    totalViews: 1423,
    referralCount: 45600,
    iapGenerated: 67800,
    iapSpending: 89400,
    onchainSpending: 56700,
    newPlayers: 2134,
    totalPoints: 0, // Will be set below
    tier: "Master",
    isLive: false,
    avatar: generateAvatar("twro-meet"),
    region: "Asia"
  },
  {
    id: "shorty-bluejova",
    name: "Shorty Bluejova",
    platforms: ["YouTube"],
    contentCount: 89543,
    totalViews: 892,
    referralCount: 28900,
    iapGenerated: 34200,
    iapSpending: 45600,
    onchainSpending: 28900,
    newPlayers: 1240,
    totalPoints: 0, // Will be set below
    tier: "Master",
    isLive: false,
    avatar: generateAvatar("shorty-bluejova"),
    region: "Global"
  },
  {
    id: "ares",
    name: "阿瑞斯Ares",
    platforms: ["YouTube", "Facebook"],
    contentCount: 78901,
    totalViews: 789,
    referralCount: 34500,
    iapGenerated: 45600,
    iapSpending: 56700,
    onchainSpending: 34500,
    newPlayers: 1123,
    totalPoints: 0, // Will be set below
    tier: "Master",
    isLive: false,
    avatar: generateAvatar("ares"),
    region: "Asia"
  },
  {
    id: "smile",
    name: "微笑",
    platforms: ["YouTube", "Facebook", "Twitch"],
    contentCount: 67890,
    totalViews: 567,
    referralCount: 23400,
    iapGenerated: 28900,
    iapSpending: 34500,
    onchainSpending: 23400,
    newPlayers: 890,
    totalPoints: 0, // Will be set below
    tier: "Master",
    isLive: false,
    avatar: generateAvatar("smile"),
    region: "Asia"
  },
  {
    id: "game-master-th",
    name: "GameMaster TH",
    platforms: ["YouTube", "Facebook"],
    contentCount: 123456,
    totalViews: 1234,
    referralCount: 38900,
    iapGenerated: 45600,
    iapSpending: 67800,
    onchainSpending: 38900,
    newPlayers: 1456,
    totalPoints: 0, // Will be set below
    tier: "Master",
    isLive: true,
    avatar: generateAvatar("game-master-th"),
    region: "Global"
  },
  {
    id: "ro-legend-tw",
    name: "RO傳奇台灣",
    platforms: ["YouTube", "Twitch"],
    contentCount: 98765,
    totalViews: 987,
    referralCount: 31200,
    iapGenerated: 38900,
    iapSpending: 45600,
    onchainSpending: 31200,
    newPlayers: 1123,
    totalPoints: 0, // Will be set below
    tier: "Master",
    isLive: false,
    avatar: generateAvatar("ro-legend-tw"),
    region: "Asia"
  },
  {
    id: "thai-gamer-pro",
    name: "ThaiGamer Pro",
    platforms: ["Facebook", "Twitch"],
    contentCount: 87654,
    totalViews: 876,
    referralCount: 26700,
    iapGenerated: 33400,
    iapSpending: 38900,
    onchainSpending: 26700,
    newPlayers: 987,
    totalPoints: 0, // Will be set below
    tier: "Master",
    isLive: true,
    avatar: generateAvatar("thai-gamer-pro"),
    region: "Global"
  },
  {
    id: "ro-king-tw",
    name: "RO王者台灣",
    platforms: ["YouTube"],
    contentCount: 76543,
    totalViews: 765,
    referralCount: 24500,
    iapGenerated: 31200,
    iapSpending: 34500,
    onchainSpending: 24500,
    newPlayers: 876,
    totalPoints: 0, // Will be set below
    tier: "Master",
    isLive: false,
    avatar: generateAvatar("ro-king-tw"),
    region: "Asia"
  },

  // Partner Tier Creators
  {
    id: "stanley",
    name: "Stanley 史丹利",
    platforms: ["Facebook", "Twitch"],
    contentCount: 23890,
    totalViews: 234,
    referralCount: 8900,
    iapGenerated: 12400,
    iapSpending: 18900,
    onchainSpending: 9800,
    newPlayers: 456,
    totalPoints: 0, // Will be set below
    tier: "Expert",
    isLive: true,
    avatar: generateAvatar("stanley"),
    region: "Asia"
  },
  {
    id: "daching-otaku",
    name: "大晴小宅男Daching",
    platforms: ["Facebook"],
    contentCount: 34567,
    totalViews: 345,
    referralCount: 15600,
    iapGenerated: 19800,
    iapSpending: 28900,
    onchainSpending: 15600,
    newPlayers: 678,
    totalPoints: 0, // Will be set below
    tier: "Expert",
    isLive: true,
    avatar: generateAvatar("daching-otaku"),
    region: "Asia"
  },
  {
    id: "achang-boss",
    name: "阿昌老闆",
    platforms: ["Twitch"],
    contentCount: 45678,
    totalViews: 456,
    referralCount: 18900,
    iapGenerated: 23400,
    iapSpending: 29800,
    onchainSpending: 18900,
    newPlayers: 567,
    totalPoints: 0, // Will be set below
    tier: "Expert",
    isLive: true,
    avatar: generateAvatar("achang-boss"),
    region: "Asia"
  },
  {
    id: "thai-streamer-1",
    name: "ThaiStreamer01",
    platforms: ["YouTube", "Facebook"],
    contentCount: 54321,
    totalViews: 543,
    referralCount: 19800,
    iapGenerated: 24500,
    iapSpending: 31200,
    onchainSpending: 19800,
    newPlayers: 654,
    totalPoints: 0, // Will be set below
    tier: "Expert",
    isLive: false,
    avatar: generateAvatar("thai-streamer-1"),
    region: "Global"
  },
  {
    id: "ro-expert-tw",
    name: "RO專家台灣",
    platforms: ["YouTube", "Twitch"],
    contentCount: 43210,
    totalViews: 432,
    referralCount: 16700,
    iapGenerated: 21200,
    iapSpending: 26700,
    onchainSpending: 16700,
    newPlayers: 543,
    totalPoints: 0, // Will be set below
    tier: "Expert",
    isLive: true,
    avatar: generateAvatar("ro-expert-tw"),
    region: "Asia"
  },
  {
    id: "gaming-thai",
    name: "Gaming Thai",
    platforms: ["Facebook", "Twitch"],
    contentCount: 32109,
    totalViews: 321,
    referralCount: 13400,
    iapGenerated: 17800,
    iapSpending: 22300,
    onchainSpending: 13400,
    newPlayers: 432,
    totalPoints: 0, // Will be set below
    tier: "Expert",
    isLive: false,
    avatar: generateAvatar("gaming-thai"),
    region: "Global"
  },
  {
    id: "ro-master-tw",
    name: "RO大師台灣",
    platforms: ["YouTube"],
    contentCount: 21098,
    totalViews: 210,
    referralCount: 11200,
    iapGenerated: 14500,
    iapSpending: 17800,
    onchainSpending: 11200,
    newPlayers: 321,
    totalPoints: 0, // Will be set below
    tier: "Expert",
    isLive: true,
    avatar: generateAvatar("ro-master-tw"),
    region: "Asia"
  },
  {
    id: "thai-gamer-2",
    name: "ThaiGamer02",
    platforms: ["YouTube", "Facebook", "Twitch"],
    contentCount: 19876,
    totalViews: 198,
    referralCount: 9800,
    iapGenerated: 12300,
    iapSpending: 14500,
    onchainSpending: 9800,
    newPlayers: 210,
    totalPoints: 0, // Will be set below
    tier: "Expert",
    isLive: false,
    avatar: generateAvatar("thai-gamer-2"),
    region: "Global"
  },
  {
    id: "ro-legend-tw-2",
    name: "RO傳說台灣",
    platforms: ["Facebook"],
    contentCount: 18765,
    totalViews: 187,
    referralCount: 8900,
    iapGenerated: 11200,
    iapSpending: 13400,
    onchainSpending: 8900,
    newPlayers: 198,
    totalPoints: 0, // Will be set below
    tier: "Expert",
    isLive: true,
    avatar: generateAvatar("ro-legend-tw-2"),
    region: "Asia"
  },
  {
    id: "thai-ro-player",
    name: "ThaiRO Player",
    platforms: ["Twitch"],
    contentCount: 17654,
    totalViews: 176,
    referralCount: 7800,
    iapGenerated: 9800,
    iapSpending: 11200,
    onchainSpending: 7800,
    newPlayers: 187,
    totalPoints: 0, // Will be set below
    tier: "Expert",
    isLive: false,
    avatar: generateAvatar("thai-ro-player"),
    region: "Global"
  },
  {
    id: "ro-hero-tw",
    name: "RO英雄台灣",
    platforms: ["YouTube", "Facebook"],
    contentCount: 16543,
    totalViews: 165,
    referralCount: 6700,
    iapGenerated: 8900,
    iapSpending: 9800,
    onchainSpending: 6700,
    newPlayers: 176,
    totalPoints: 0, // Will be set below
    tier: "Expert",
    isLive: true,
    avatar: generateAvatar("ro-hero-tw"),
    region: "Asia"
  },

  // Normal Tier Creators
  {
    id: "barry",
    name: "貝瑞Barry",
    platforms: ["YouTube"],
    contentCount: 12345,
    totalViews: 123,
    referralCount: 4500,
    iapGenerated: 6700,
    iapSpending: 8900,
    onchainSpending: 4500,
    newPlayers: 234,
    totalPoints: 0, // Will be set below
    tier: "Creator",
    isLive: false,
    avatar: generateAvatar("barry"),
    region: "Asia"
  },
  {
    id: "ayi",
    name: "阿翊",
    platforms: ["Facebook", "Twitch"],
    contentCount: 23456,
    totalViews: 234,
    referralCount: 8900,
    iapGenerated: 12300,
    iapSpending: 15600,
    onchainSpending: 8900,
    newPlayers: 345,
    totalPoints: 0, // Will be set below
    tier: "Creator",
    isLive: true,
    avatar: generateAvatar("ayi"),
    region: "Asia"
  },
  {
    id: "thai-gamer-3",
    name: "ThaiGamer03",
    platforms: ["YouTube"],
    contentCount: 15432,
    totalViews: 154,
    referralCount: 5600,
    iapGenerated: 7800,
    iapSpending: 9800,
    onchainSpending: 5600,
    newPlayers: 165,
    totalPoints: 0, // Will be set below
    tier: "Creator",
    isLive: false,
    avatar: generateAvatar("thai-gamer-3"),
    region: "Global"
  },
  {
    id: "ro-newbie-tw",
    name: "RO新手台灣",
    platforms: ["Facebook"],
    contentCount: 14321,
    totalViews: 143,
    referralCount: 4500,
    iapGenerated: 6700,
    iapSpending: 7800,
    onchainSpending: 4500,
    newPlayers: 154,
    totalPoints: 0, // Will be set below
    tier: "Creator",
    isLive: true,
    avatar: generateAvatar("ro-newbie-tw"),
    region: "Asia"
  },
  {
    id: "thai-streamer-2",
    name: "ThaiStreamer02",
    platforms: ["Twitch"],
    contentCount: 13210,
    totalViews: 132,
    referralCount: 3400,
    iapGenerated: 5600,
    iapSpending: 6700,
    onchainSpending: 3400,
    newPlayers: 143,
    totalPoints: 0, // Will be set below
    tier: "Creator",
    isLive: false,
    avatar: generateAvatar("thai-streamer-2"),
    region: "Global"
  },
  {
    id: "ro-fan-tw",
    name: "RO粉絲台灣",
    platforms: ["YouTube", "Facebook"],
    contentCount: 12109,
    totalViews: 121,
    referralCount: 2800,
    iapGenerated: 4500,
    iapSpending: 5600,
    onchainSpending: 2800,
    newPlayers: 132,
    totalPoints: 0, // Will be set below
    tier: "Creator",
    isLive: true,
    avatar: generateAvatar("ro-fan-tw"),
    region: "Asia"
  },
  {
    id: "thai-gamer-4",
    name: "ThaiGamer04",
    platforms: ["Facebook", "Twitch"],
    contentCount: 11098,
    totalViews: 110,
    referralCount: 2200,
    iapGenerated: 3400,
    iapSpending: 4500,
    onchainSpending: 2200,
    newPlayers: 121,
    totalPoints: 0, // Will be set below
    tier: "Creator",
    isLive: false,
    avatar: generateAvatar("thai-gamer-4"),
    region: "Global"
  },
  {
    id: "ro-player-tw",
    name: "RO玩家台灣",
    platforms: ["YouTube"],
    contentCount: 10987,
    totalViews: 109,
    referralCount: 1800,
    iapGenerated: 2800,
    iapSpending: 3400,
    onchainSpending: 1800,
    newPlayers: 110,
    totalPoints: 0, // Will be set below
    tier: "Creator",
    isLive: true,
    avatar: generateAvatar("ro-player-tw"),
    region: "Asia"
  },
  {
    id: "thai-ro-fan",
    name: "ThaiRO Fan",
    platforms: ["Twitch"],
    contentCount: 9876,
    totalViews: 98,
    referralCount: 1400,
    iapGenerated: 2200,
    iapSpending: 2800,
    onchainSpending: 1400,
    newPlayers: 109,
    totalPoints: 0, // Will be set below
    tier: "Creator",
    isLive: false,
    avatar: generateAvatar("thai-ro-fan"),
    region: "Global"
  },
  {
    id: "ro-beginner-tw",
    name: "RO初學者台灣",
    platforms: ["Facebook"],
    contentCount: 8765,
    totalViews: 87,
    referralCount: 1000,
    iapGenerated: 1800,
    iapSpending: 2200,
    onchainSpending: 1000,
    newPlayers: 98,
    totalPoints: 0, // Will be set below
    tier: "Creator",
    isLive: true,
    avatar: generateAvatar("ro-beginner-tw"),
    region: "Asia"
  },
  {
    id: "thai-gamer-5",
    name: "ThaiGamer05",
    platforms: ["YouTube", "Facebook"],
    contentCount: 7654,
    totalViews: 76,
    referralCount: 800,
    iapGenerated: 1400,
    iapSpending: 1800,
    onchainSpending: 800,
    newPlayers: 87,
    totalPoints: 0, // Will be set below
    tier: "Creator",
    isLive: false,
    avatar: generateAvatar("thai-gamer-5"),
    region: "Global"
  },
  {
    id: "ro-casual-tw",
    name: "RO休閒台灣",
    platforms: ["Twitch"],
    contentCount: 6543,
    totalViews: 65,
    referralCount: 600,
    iapGenerated: 1000,
    iapSpending: 1400,
    onchainSpending: 600,
    newPlayers: 76,
    totalPoints: 0, // Will be set below
    tier: "Creator",
    isLive: true,
    avatar: generateAvatar("ro-casual-tw"),
    region: "Asia"
  },
  {
    id: "thai-streamer-3",
    name: "ThaiStreamer03",
    platforms: ["Facebook"],
    contentCount: 5432,
    totalViews: 54,
    referralCount: 400,
    iapGenerated: 800,
    iapSpending: 1000,
    onchainSpending: 400,
    newPlayers: 65,
    totalPoints: 0, // Will be set below
    tier: "Creator",
    isLive: false,
    avatar: generateAvatar("thai-streamer-3"),
    region: "Global"
  },
  {
    id: "ro-fanatic-tw",
    name: "RO狂熱台灣",
    platforms: ["YouTube", "Twitch"],
    contentCount: 4321,
    totalViews: 43,
    referralCount: 300,
    iapGenerated: 600,
    iapSpending: 800,
    onchainSpending: 300,
    newPlayers: 54,
    totalPoints: 0, // Will be set below
    tier: "Creator",
    isLive: true,
    avatar: generateAvatar("ro-fanatic-tw"),
    region: "Asia"
  },
  {
    id: "thai-gamer-6",
    name: "ThaiGamer06",
    platforms: ["YouTube"],
    contentCount: 3210,
    totalViews: 32,
    referralCount: 200,
    iapGenerated: 400,
    iapSpending: 600,
    onchainSpending: 200,
    newPlayers: 43,
    totalPoints: 0, // Will be set below
    tier: "Creator",
    isLive: false,
    avatar: generateAvatar("thai-gamer-6"),
    region: "Global"
  },
  {
    id: "ro-enthusiast-tw",
    name: "RO愛好者台灣",
    platforms: ["Facebook", "Twitch"],
    contentCount: 2109,
    totalViews: 21,
    referralCount: 150,
    iapGenerated: 300,
    iapSpending: 400,
    onchainSpending: 150,
    newPlayers: 32,
    totalPoints: 0, // Will be set below
    tier: "Creator",
    isLive: true,
    avatar: generateAvatar("ro-enthusiast-tw"),
    region: "Asia"
  },
  {
    id: "thai-ro-newbie",
    name: "ThaiRO Newbie",
    platforms: ["Twitch"],
    contentCount: 1098,
    totalViews: 10,
    referralCount: 100,
    iapGenerated: 200,
    iapSpending: 300,
    onchainSpending: 100,
    newPlayers: 21,
    totalPoints: 0, // Will be set below
    tier: "Creator",
    isLive: false,
    avatar: generateAvatar("thai-ro-newbie"),
    region: "Global"
  },
  {
    id: "ro-starter-tw",
    name: "RO新手台灣2",
    platforms: ["YouTube"],
    contentCount: 987,
    totalViews: 9,
    referralCount: 80,
    iapGenerated: 150,
    iapSpending: 200,
    onchainSpending: 80,
    newPlayers: 10,
    totalPoints: 0, // Will be set below
    tier: "Creator",
    isLive: true,
    avatar: generateAvatar("ro-starter-tw"),
    region: "Asia"
  },
  {
    id: "thai-gamer-7",
    name: "ThaiGamer07",
    platforms: ["Facebook"],
    contentCount: 876,
    totalViews: 8,
    referralCount: 60,
    iapGenerated: 100,
    iapSpending: 150,
    onchainSpending: 60,
    newPlayers: 9,
    totalPoints: 0, // Will be set below
    tier: "Creator",
    isLive: false,
    avatar: generateAvatar("thai-gamer-7"),
    region: "Global"
  },
  {
    id: "ro-explorer-tw",
    name: "RO探索者台灣",
    platforms: ["YouTube", "Facebook", "Twitch"],
    contentCount: 765,
    totalViews: 7,
    referralCount: 40,
    iapGenerated: 80,
    iapSpending: 100,
    onchainSpending: 40,
    newPlayers: 8,
    totalPoints: 0, // Will be set below
    tier: "Creator",
    isLive: true,
    avatar: generateAvatar("ro-explorer-tw"),
    region: "Asia"
  },
  {
    id: "thai-streamer-4",
    name: "ThaiStreamer04",
    platforms: ["Twitch"],
    contentCount: 654,
    totalViews: 6,
    referralCount: 30,
    iapGenerated: 60,
    iapSpending: 80,
    onchainSpending: 30,
    newPlayers: 7,
    totalPoints: 0, // Will be set below
    tier: "Creator",
    isLive: false,
    avatar: generateAvatar("thai-streamer-4"),
    region: "Global"
  },
  {
    id: "ro-adventurer-tw",
    name: "RO冒險者台灣",
    platforms: ["Facebook"],
    contentCount: 543,
    totalViews: 5,
    referralCount: 20,
    iapGenerated: 40,
    iapSpending: 60,
    onchainSpending: 20,
    newPlayers: 6,
    totalPoints: 0, // Will be set below
    tier: "Creator",
    isLive: true,
    avatar: generateAvatar("ro-adventurer-tw"),
    region: "Asia"
  },
  {
    id: "thai-gamer-8",
    name: "ThaiGamer08",
    platforms: ["YouTube"],
    contentCount: 432,
    totalViews: 4,
    referralCount: 15,
    iapGenerated: 30,
    iapSpending: 40,
    onchainSpending: 15,
    newPlayers: 5,
    totalPoints: 0, // Will be set below
    tier: "Creator",
    isLive: false,
    avatar: generateAvatar("thai-gamer-8"),
    region: "Global"
  },
  {
    id: "ro-wanderer-tw",
    name: "RO漫遊者台灣",
    platforms: ["YouTube", "Twitch"],
    contentCount: 321,
    totalViews: 3,
    referralCount: 10,
    iapGenerated: 20,
    iapSpending: 30,
    onchainSpending: 10,
    newPlayers: 4,
    totalPoints: 0, // Will be set below
    tier: "Creator",
    isLive: true,
    avatar: generateAvatar("ro-wanderer-tw"),
    region: "Asia"
  },
  {
    id: "thai-ro-casual",
    name: "ThaiRO Casual",
    platforms: ["Facebook", "Twitch"],
    contentCount: 210,
    totalViews: 2,
    referralCount: 8,
    iapGenerated: 15,
    iapSpending: 20,
    onchainSpending: 8,
    newPlayers: 3,
    totalPoints: 0, // Will be set below
    tier: "Creator",
    isLive: false,
    avatar: generateAvatar("thai-ro-casual"),
    region: "Global"
  },
  {
    id: "ro-traveler-tw",
    name: "RO旅行者台灣",
    platforms: ["YouTube"],
    contentCount: 109,
    totalViews: 1,
    referralCount: 5,
    iapGenerated: 10,
    iapSpending: 15,
    onchainSpending: 5,
    newPlayers: 2,
    totalPoints: 0, // Will be set below
    tier: "Creator",
    isLive: true,
    avatar: generateAvatar("ro-traveler-tw"),
    region: "Asia"
  },
  {
    id: "thai-gamer-9",
    name: "ThaiGamer09",
    platforms: ["Facebook"],
    contentCount: 98,
    totalViews: 1,
    referralCount: 3,
    iapGenerated: 8,
    iapSpending: 10,
    onchainSpending: 3,
    newPlayers: 1,
    totalPoints: 0, // Will be set below
    tier: "Creator",
    isLive: false,
    avatar: generateAvatar("thai-gamer-9"),
    region: "Global"
  },
  {
    id: "ro-pioneer-tw",
    name: "RO先驅者台灣",
    platforms: ["Twitch"],
    contentCount: 87,
    totalViews: 1,
    referralCount: 2,
    iapGenerated: 5,
    iapSpending: 8,
    onchainSpending: 2,
    newPlayers: 1,
    totalPoints: 0, // Will be set below
    tier: "Creator",
    isLive: true,
    avatar: generateAvatar("ro-pioneer-tw"),
    region: "Asia"
  },
  {
    id: "thai-streamer-5",
    name: "ThaiStreamer05",
    platforms: ["YouTube", "Facebook"],
    contentCount: 76,
    totalViews: 1,
    referralCount: 1,
    iapGenerated: 3,
    iapSpending: 5,
    onchainSpending: 1,
    newPlayers: 1,
    totalPoints: 0, // Will be set below
    tier: "Creator",
    isLive: false,
    avatar: generateAvatar("thai-streamer-5"),
    region: "Global"
  }
];

// Mock content data for top creators
export const mockContent: { [creatorId: string]: ContentItem[] } = {
  "twro-meet": [
    {
      id: "twro_vid_001",
      platform: "YouTube",
      type: "Video",
      title: "【Ragnarok Libre】全台最大監督台《首日開服-敏爆騎士開局》第17版本回到最粗的感動！超無腦完全不肝 區塊鏈遊戲",
      date: "2025-01-15",
      duration: "14:22",
      views: 35420,
      likes: 2890,
      shares: 456,
      valid: true,
      thumbnail: "/Creator/Thumbnail1.jpg"
    },
    {
      id: "twro_vid_002",
      platform: "Twitch",
      type: "Stream",
      title: "【Ragnarok Libre】全台最大監督台《第二天-三轉敏爆騎》挑戰東南亞PVP課長群",
      date: "2025-01-13",
      duration: "3:45:10",
      views: 12800,
      likes: 1560,
      shares: 234,
      valid: true,
      thumbnail: "/Creator/Thumbnail2.jpg"
    }
  ],
  "ares": [
    {
      id: "ares_vid_001",
      platform: "YouTube",
      type: "Video",
      title: "【Ragnarok Libre】全台最大監督台《首日開服-敏爆騎士開局》第17版本回到最粗的感動！超無腦完全不肝 區塊鏈遊戲",
      date: "2025-01-15",
      duration: "14:22",
      views: 35420,
      likes: 2890,
      shares: 456,
      valid: true,
      thumbnail: "/Creator/Thumbnail1.jpg"
    },
    {
      id: "ares_vid_002",
      platform: "Facebook",
      type: "Stream",
      title: "【Ragnarok Libre】全台最大監督台《第二天-三轉敏爆騎》挑戰東南亞PVP課長群，不RO3沒抽到的來這玩，不課會小卡關慢慢農",
      date: "2025-01-13",
      duration: "3:45:10",
      views: 12800,
      likes: 1560,
      shares: 234,
      valid: true,
      thumbnail: "/Creator/Thumbnail2.jpg"
    },
    {
      id: "ares_vid_003",
      platform: "YouTube",
      type: "Video",
      title: "【Ragnarok Libre】我就看如何刮分9百萬台幣《第三天-敏爆技能騎士》準備打爆東南亞PVP課長群，單吃個100隻MVP！",
      date: "2025-01-11",
      duration: "18:55",
      views: 28900,
      likes: 2340,
      shares: 378,
      valid: true,
      thumbnail: "/Creator/Thumbnail3.jpg"
    }
  ],
  "shorty-bluejova": [
    {
      id: "shorty_vid_001",
      platform: "YouTube",
      type: "Video",
      title: "【Ragnarok Libre】Thai Server - Best Build Guide for New Players",
      date: "2025-01-14",
      duration: "12:30",
      views: 28900,
      likes: 2340,
      shares: 378,
      valid: true,
      thumbnail: "/Creator/Thumbnail1.jpg"
    }
  ],
  "game-master-th": [
    {
      id: "gm_vid_001",
      platform: "YouTube",
      type: "Video",
      title: "【Ragnarok Libre】Thai Server - Ultimate PvP Guide",
      date: "2025-01-12",
      duration: "16:45",
      views: 45600,
      likes: 3450,
      shares: 567,
      valid: true,
      thumbnail: "/Creator/Thumbnail2.jpg"
    }
  ]
};

// Mock announcements
export const mockAnnouncements: Announcement[] = [
  {
    id: "ann_001",
    title: "Beta Season Round 2 Starting Soon!",
    content: "Get ready for the next round of competition. New rewards and challenges await!",
    date: "2025-01-16",
    type: "info"
  },
  {
    id: "ann_002",
    title: "Content Validation Updates",
    content: "We've improved our content validation system. Check your recent submissions.",
    date: "2025-01-15",
    type: "warning"
  },
  {
    id: "ann_003",
    title: "Top 10 Rewards Distributed",
    content: "Congratulations to our top performers! Rewards have been sent to your accounts.",
    date: "2025-01-14",
    type: "success"
  },
  {
    id: "ann_004",
    title: "New Platform Integration: TikTok",
    content: "We're working on TikTok integration. Stay tuned for updates!",
    date: "2025-01-13",
    type: "info"
  },
  {
    id: "ann_005",
    title: "Referral System Enhancement",
    content: "Track your referral performance with our new detailed analytics dashboard.",
    date: "2025-01-12",
    type: "info"
  },
  {
    id: "ann_006",
    title: "50 Creators Milestone Reached!",
    content: "We've reached 50 active creators across Taiwan and Thailand! Thank you for your support.",
    date: "2025-01-11",
    type: "success"
  },
  {
    id: "ann_007",
    title: "New Tier System Implementation",
    content: "The new Best/Partner/Normal tier system is now active. Check your current status!",
    date: "2025-01-10",
    type: "info"
  }
];

// Current game version info
export const currentSeason = {
  season: "Launch",
  round: 1,
  startDate: "2025-01-15",
  endDate: "Ongoing",
  daysLeft: "Live Now"
};

// Calculate total points as simple sum
export const calculateTotalPoints = (referralCount: number, iapGenerated: number) => {
  return referralCount + iapGenerated;
};

// Generate random scores for all creators and assign them
const generateRandomScores = () => {
  const scores: number[] = [];
  
  // Generate 50 unique random scores between 100-5500
  while (scores.length < 50) {
    const score = generateRandomScore();
    if (!scores.includes(score)) {
      scores.push(score);
    }
  }
  
  // Sort scores in descending order (highest to lowest)
  scores.sort((a, b) => b - a);
  
  return scores;
};

// Assign random scores to creators
const randomScores = generateRandomScores();
mockCreators.forEach((creator, index) => {
  creator.totalPoints = randomScores[index];
  // Update referral count and IAP generated based on total
  creator.referralCount = Math.floor(creator.totalPoints * 0.6);
  creator.iapGenerated = Math.floor(creator.totalPoints * 0.4);
});

// Sort creators by total points for leaderboard
export const sortedCreators = [...mockCreators].sort((a, b) => b.totalPoints - a.totalPoints);