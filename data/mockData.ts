export interface Creator {
  id: string;
  name: string;
  platforms: ('YouTube' | 'Facebook' | 'Twitch')[];
  followers: number;
  supporters: number;
  contentPoints: number;
  referralPoints: number;
  iapSpending: number;
  onchainSpending: number;
  newPlayers: number;
  totalPoints: number;
  tier: 'Best' | 'Partner' | 'Normal';
  isLive: boolean;
  avatar: string;
  region: 'Taiwan' | 'Thailand';
  leaderboardScore?: number;
  referralCount?: number;
  purchaseAmountTotal?: number;
}

export interface ContentItem {
  id: string;
  platform: 'YouTube' | 'Facebook' | 'Twitch';
  type: 'Edited Video' | 'Stream' | 'Short';
  title: string;
  date: string;
  duration: string;
  views: number;
  likes: number;
  comments: number;
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



// Mock creators data
export const mockCreators: Creator[] = [

  {
    id: "shorty-bluejova",
    name: "Shorty Bluejova",
    platforms: ["YouTube"],
    followers: 89543,
    supporters: 892,

    contentPoints: 28900,
    referralPoints: 34200,
    iapSpending: 45600,
    onchainSpending: 28900,
    newPlayers: 1240,
    totalPoints: 63100,
    tier: "Best",
    isLive: false,
    avatar: "/Creator/Shorty Bluejova.png",
    region: "Thailand"
  },
  {
    id: "stanley",
    name: "Stanley 史丹利",
    platforms: ["Facebook", "Twitch"],
    followers: 23890,
    supporters: 234,

    contentPoints: 8900,
    referralPoints: 12400,
    iapSpending: 18900,
    onchainSpending: 9800,
    newPlayers: 456,
    totalPoints: 21300,
    tier: "Partner",
    isLive: true,
    avatar: "/Creator/Stanley 史丹利.png",
    region: "Taiwan"
  },
  {
    id: "twro-meet",
    name: "twro相見",
    platforms: ["YouTube", "Twitch"],
    followers: 156789,
    supporters: 1423,

    contentPoints: 45600,
    referralPoints: 67800,
    iapSpending: 89400,
    onchainSpending: 56700,
    newPlayers: 2134,
    totalPoints: 113400,
    tier: "Best",
    isLive: false,
    avatar: "/Creator/twro相見.png",
    region: "Taiwan"
  },
  {
    id: "daching-otaku",
    name: "大晴小宅男Daching",
    platforms: ["Facebook"],
    followers: 34567,
    supporters: 345,

    contentPoints: 15600,
    referralPoints: 19800,
    iapSpending: 28900,
    onchainSpending: 15600,
    newPlayers: 678,
    totalPoints: 35400,
    tier: "Partner",
    isLive: true,
    avatar: "/Creator/大晴小宅男Daching.png",
    region: "Taiwan"
  },
  {
    id: "smile",
    name: "微笑",
    platforms: ["YouTube", "Facebook", "Twitch"],
    followers: 67890,
    supporters: 567,

    contentPoints: 23400,
    referralPoints: 28900,
    iapSpending: 34500,
    onchainSpending: 23400,
    newPlayers: 890,
    totalPoints: 52300,
    tier: "Best",
    isLive: false,
    avatar: "/Creator/微笑.png",
    region: "Taiwan"
  },
  {
    id: "barry",
    name: "貝瑞Barry",
    platforms: ["YouTube"],
    followers: 12345,
    supporters: 123,

    contentPoints: 4500,
    referralPoints: 6700,
    iapSpending: 8900,
    onchainSpending: 4500,
    newPlayers: 234,
    totalPoints: 11200,
    tier: "Normal",
    isLive: false,
    avatar: "/Creator/貝瑞Barry.png",
    region: "Taiwan"
  },
  {
    id: "achang-boss",
    name: "阿昌老闆",
    platforms: ["Twitch"],
    followers: 45678,
    supporters: 456,

    contentPoints: 18900,
    referralPoints: 23400,
    iapSpending: 29800,
    onchainSpending: 18900,
    newPlayers: 567,
    totalPoints: 42300,
    tier: "Partner",
    isLive: true,
    avatar: "/Creator/阿昌老闆.png",
    region: "Taiwan"
  },
  {
    id: "ares",
    name: "阿瑞斯Ares",
    platforms: ["YouTube", "Facebook"],
    followers: 78901,
    supporters: 789,

    contentPoints: 34500,
    referralPoints: 45600,
    iapSpending: 56700,
    onchainSpending: 34500,
    newPlayers: 1123,
    totalPoints: 80100,
    tier: "Best",
    isLive: false,
    avatar: "/Creator/阿瑞斯Ares.png",
    region: "Taiwan"
  },
  {
    id: "ayi",
    name: "阿翊",
    platforms: ["Facebook", "Twitch"],
    followers: 23456,
    supporters: 234,

    contentPoints: 8900,
    referralPoints: 12300,
    iapSpending: 15600,
    onchainSpending: 8900,
    newPlayers: 345,
    totalPoints: 21200,
    tier: "Normal",
    isLive: true,
    avatar: "/Creator/阿翊.png",
    region: "Taiwan"
  }
];

// Mock content data
export const mockContent: { [creatorId: string]: ContentItem[] } = {
  "ares": [
    {
      id: "ares_vid_001",
      platform: "YouTube",
      type: "Edited Video",
      title: "【Ragnarok Libre】全台最大監督台《首日開服-敏爆騎士開局》第17版本回到最粗的感動！超無腦完全不肝 區塊鏈遊戲",
      date: "2025-01-15",
      duration: "14:22",
      views: 35420,
      likes: 2890,
      comments: 456,
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
      comments: 234,
      valid: true,
      thumbnail: "/Creator/Thumbnail2.jpg"
    },
    {
      id: "ares_vid_003",
      platform: "YouTube",
      type: "Edited Video",
      title: "【Ragnarok Libre】我就看如何刮分9百萬台幣《第三天-敏爆技能騎士》準備打爆東南亞PVP課長群，單吃個100隻MVP！",
      date: "2025-01-11",
      duration: "18:55",
      views: 28900,
      likes: 2340,
      comments: 378,
      valid: true,
      thumbnail: "/Creator/Thumbnail3.jpg"
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
  }
];



// Current season/round info
export const currentSeason = {
  season: "Beta",
  round: 1,
  startDate: "2025-09-15",
  endDate: "2025-10-10",
  daysLeft: "Ongoing"
};

// Calculate total points as simple sum
export const calculateTotalPoints = (contentPoints: number, referralPoints: number) => {
  return contentPoints + referralPoints;
};

// Update total points for all creators
mockCreators.forEach(creator => {
  creator.totalPoints = calculateTotalPoints(creator.contentPoints, creator.referralPoints);
});

// Sort creators by total points for leaderboard
export const sortedCreators = [...mockCreators].sort((a, b) => b.totalPoints - a.totalPoints);
