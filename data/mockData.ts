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

// Mock creators data - 50 creators with diverse profiles
export const mockCreators: Creator[] = [
  // Top Tier Creators (Best)
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
    id: "game-master-th",
    name: "GameMaster TH",
    platforms: ["YouTube", "Facebook"],
    followers: 123456,
    supporters: 1234,
    contentPoints: 38900,
    referralPoints: 45600,
    iapSpending: 67800,
    onchainSpending: 38900,
    newPlayers: 1456,
    totalPoints: 84500,
    tier: "Best",
    isLive: true,
    avatar: "/Creator/Thumbnail1.jpg",
    region: "Thailand"
  },
  {
    id: "ro-legend-tw",
    name: "RO傳奇台灣",
    platforms: ["YouTube", "Twitch"],
    followers: 98765,
    supporters: 987,
    contentPoints: 31200,
    referralPoints: 38900,
    iapSpending: 45600,
    onchainSpending: 31200,
    newPlayers: 1123,
    totalPoints: 70100,
    tier: "Best",
    isLive: false,
    avatar: "/Creator/Thumbnail2.jpg",
    region: "Taiwan"
  },
  {
    id: "thai-gamer-pro",
    name: "ThaiGamer Pro",
    platforms: ["Facebook", "Twitch"],
    followers: 87654,
    supporters: 876,
    contentPoints: 26700,
    referralPoints: 33400,
    iapSpending: 38900,
    onchainSpending: 26700,
    newPlayers: 987,
    totalPoints: 60100,
    tier: "Best",
    isLive: true,
    avatar: "/Creator/Thumbnail3.jpg",
    region: "Thailand"
  },
  {
    id: "ro-king-tw",
    name: "RO王者台灣",
    platforms: ["YouTube"],
    followers: 76543,
    supporters: 765,
    contentPoints: 24500,
    referralPoints: 31200,
    iapSpending: 34500,
    onchainSpending: 24500,
    newPlayers: 876,
    totalPoints: 55700,
    tier: "Best",
    isLive: false,
    avatar: "/Creator/Thumbnail1.jpg",
    region: "Taiwan"
  },

  // Partner Tier Creators
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
    id: "thai-streamer-1",
    name: "ThaiStreamer01",
    platforms: ["YouTube", "Facebook"],
    followers: 54321,
    supporters: 543,
    contentPoints: 19800,
    referralPoints: 24500,
    iapSpending: 31200,
    onchainSpending: 19800,
    newPlayers: 654,
    totalPoints: 44300,
    tier: "Partner",
    isLive: false,
    avatar: "/Creator/Thumbnail2.jpg",
    region: "Thailand"
  },
  {
    id: "ro-expert-tw",
    name: "RO專家台灣",
    platforms: ["YouTube", "Twitch"],
    followers: 43210,
    supporters: 432,
    contentPoints: 16700,
    referralPoints: 21200,
    iapSpending: 26700,
    onchainSpending: 16700,
    newPlayers: 543,
    totalPoints: 37900,
    tier: "Partner",
    isLive: true,
    avatar: "/Creator/Thumbnail3.jpg",
    region: "Taiwan"
  },
  {
    id: "gaming-thai",
    name: "Gaming Thai",
    platforms: ["Facebook", "Twitch"],
    followers: 32109,
    supporters: 321,
    contentPoints: 13400,
    referralPoints: 17800,
    iapSpending: 22300,
    onchainSpending: 13400,
    newPlayers: 432,
    totalPoints: 31200,
    tier: "Partner",
    isLive: false,
    avatar: "/Creator/Thumbnail1.jpg",
    region: "Thailand"
  },
  {
    id: "ro-master-tw",
    name: "RO大師台灣",
    platforms: ["YouTube"],
    followers: 21098,
    supporters: 210,
    contentPoints: 11200,
    referralPoints: 14500,
    iapSpending: 17800,
    onchainSpending: 11200,
    newPlayers: 321,
    totalPoints: 25700,
    tier: "Partner",
    isLive: true,
    avatar: "/Creator/Thumbnail2.jpg",
    region: "Taiwan"
  },
  {
    id: "thai-gamer-2",
    name: "ThaiGamer02",
    platforms: ["YouTube", "Facebook", "Twitch"],
    followers: 19876,
    supporters: 198,
    contentPoints: 9800,
    referralPoints: 12300,
    iapSpending: 14500,
    onchainSpending: 9800,
    newPlayers: 210,
    totalPoints: 22100,
    tier: "Partner",
    isLive: false,
    avatar: "/Creator/Thumbnail3.jpg",
    region: "Thailand"
  },
  {
    id: "ro-legend-tw-2",
    name: "RO傳說台灣",
    platforms: ["Facebook"],
    followers: 18765,
    supporters: 187,
    contentPoints: 8900,
    referralPoints: 11200,
    iapSpending: 13400,
    onchainSpending: 8900,
    newPlayers: 198,
    totalPoints: 20100,
    tier: "Partner",
    isLive: true,
    avatar: "/Creator/Thumbnail1.jpg",
    region: "Taiwan"
  },
  {
    id: "thai-ro-player",
    name: "ThaiRO Player",
    platforms: ["Twitch"],
    followers: 17654,
    supporters: 176,
    contentPoints: 7800,
    referralPoints: 9800,
    iapSpending: 11200,
    onchainSpending: 7800,
    newPlayers: 187,
    totalPoints: 17600,
    tier: "Partner",
    isLive: false,
    avatar: "/Creator/Thumbnail2.jpg",
    region: "Thailand"
  },
  {
    id: "ro-hero-tw",
    name: "RO英雄台灣",
    platforms: ["YouTube", "Facebook"],
    followers: 16543,
    supporters: 165,
    contentPoints: 6700,
    referralPoints: 8900,
    iapSpending: 9800,
    onchainSpending: 6700,
    newPlayers: 176,
    totalPoints: 15600,
    tier: "Partner",
    isLive: true,
    avatar: "/Creator/Thumbnail3.jpg",
    region: "Taiwan"
  },

  // Normal Tier Creators
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
  },
  {
    id: "thai-gamer-3",
    name: "ThaiGamer03",
    platforms: ["YouTube"],
    followers: 15432,
    supporters: 154,
    contentPoints: 5600,
    referralPoints: 7800,
    iapSpending: 9800,
    onchainSpending: 5600,
    newPlayers: 165,
    totalPoints: 13400,
    tier: "Normal",
    isLive: false,
    avatar: "/Creator/Thumbnail1.jpg",
    region: "Thailand"
  },
  {
    id: "ro-newbie-tw",
    name: "RO新手台灣",
    platforms: ["Facebook"],
    followers: 14321,
    supporters: 143,
    contentPoints: 4500,
    referralPoints: 6700,
    iapSpending: 7800,
    onchainSpending: 4500,
    newPlayers: 154,
    totalPoints: 11200,
    tier: "Normal",
    isLive: true,
    avatar: "/Creator/Thumbnail2.jpg",
    region: "Taiwan"
  },
  {
    id: "thai-streamer-2",
    name: "ThaiStreamer02",
    platforms: ["Twitch"],
    followers: 13210,
    supporters: 132,
    contentPoints: 3400,
    referralPoints: 5600,
    iapSpending: 6700,
    onchainSpending: 3400,
    newPlayers: 143,
    totalPoints: 9000,
    tier: "Normal",
    isLive: false,
    avatar: "/Creator/Thumbnail3.jpg",
    region: "Thailand"
  },
  {
    id: "ro-fan-tw",
    name: "RO粉絲台灣",
    platforms: ["YouTube", "Facebook"],
    followers: 12109,
    supporters: 121,
    contentPoints: 2800,
    referralPoints: 4500,
    iapSpending: 5600,
    onchainSpending: 2800,
    newPlayers: 132,
    totalPoints: 7300,
    tier: "Normal",
    isLive: true,
    avatar: "/Creator/Thumbnail1.jpg",
    region: "Taiwan"
  },
  {
    id: "thai-gamer-4",
    name: "ThaiGamer04",
    platforms: ["Facebook", "Twitch"],
    followers: 11098,
    supporters: 110,
    contentPoints: 2200,
    referralPoints: 3400,
    iapSpending: 4500,
    onchainSpending: 2200,
    newPlayers: 121,
    totalPoints: 5600,
    tier: "Normal",
    isLive: false,
    avatar: "/Creator/Thumbnail2.jpg",
    region: "Thailand"
  },
  {
    id: "ro-player-tw",
    name: "RO玩家台灣",
    platforms: ["YouTube"],
    followers: 10987,
    supporters: 109,
    contentPoints: 1800,
    referralPoints: 2800,
    iapSpending: 3400,
    onchainSpending: 1800,
    newPlayers: 110,
    totalPoints: 4600,
    tier: "Normal",
    isLive: true,
    avatar: "/Creator/Thumbnail3.jpg",
    region: "Taiwan"
  },
  {
    id: "thai-ro-fan",
    name: "ThaiRO Fan",
    platforms: ["Twitch"],
    followers: 9876,
    supporters: 98,
    contentPoints: 1400,
    referralPoints: 2200,
    iapSpending: 2800,
    onchainSpending: 1400,
    newPlayers: 109,
    totalPoints: 3600,
    tier: "Normal",
    isLive: false,
    avatar: "/Creator/Thumbnail1.jpg",
    region: "Thailand"
  },
  {
    id: "ro-beginner-tw",
    name: "RO初學者台灣",
    platforms: ["Facebook"],
    followers: 8765,
    supporters: 87,
    contentPoints: 1000,
    referralPoints: 1800,
    iapSpending: 2200,
    onchainSpending: 1000,
    newPlayers: 98,
    totalPoints: 2800,
    tier: "Normal",
    isLive: true,
    avatar: "/Creator/Thumbnail2.jpg",
    region: "Taiwan"
  },
  {
    id: "thai-gamer-5",
    name: "ThaiGamer05",
    platforms: ["YouTube", "Facebook"],
    followers: 7654,
    supporters: 76,
    contentPoints: 800,
    referralPoints: 1400,
    iapSpending: 1800,
    onchainSpending: 800,
    newPlayers: 87,
    totalPoints: 2200,
    tier: "Normal",
    isLive: false,
    avatar: "/Creator/Thumbnail3.jpg",
    region: "Thailand"
  },
  {
    id: "ro-casual-tw",
    name: "RO休閒台灣",
    platforms: ["Twitch"],
    followers: 6543,
    supporters: 65,
    contentPoints: 600,
    referralPoints: 1000,
    iapSpending: 1400,
    onchainSpending: 600,
    newPlayers: 76,
    totalPoints: 1600,
    tier: "Normal",
    isLive: true,
    avatar: "/Creator/Thumbnail1.jpg",
    region: "Taiwan"
  },
  {
    id: "thai-streamer-3",
    name: "ThaiStreamer03",
    platforms: ["Facebook"],
    followers: 5432,
    supporters: 54,
    contentPoints: 400,
    referralPoints: 800,
    iapSpending: 1000,
    onchainSpending: 400,
    newPlayers: 65,
    totalPoints: 1200,
    tier: "Normal",
    isLive: false,
    avatar: "/Creator/Thumbnail2.jpg",
    region: "Thailand"
  },
  {
    id: "ro-fanatic-tw",
    name: "RO狂熱台灣",
    platforms: ["YouTube", "Twitch"],
    followers: 4321,
    supporters: 43,
    contentPoints: 300,
    referralPoints: 600,
    iapSpending: 800,
    onchainSpending: 300,
    newPlayers: 54,
    totalPoints: 900,
    tier: "Normal",
    isLive: true,
    avatar: "/Creator/Thumbnail3.jpg",
    region: "Taiwan"
  },
  {
    id: "thai-gamer-6",
    name: "ThaiGamer06",
    platforms: ["YouTube"],
    followers: 3210,
    supporters: 32,
    contentPoints: 200,
    referralPoints: 400,
    iapSpending: 600,
    onchainSpending: 200,
    newPlayers: 43,
    totalPoints: 600,
    tier: "Normal",
    isLive: false,
    avatar: "/Creator/Thumbnail1.jpg",
    region: "Thailand"
  },
  {
    id: "ro-enthusiast-tw",
    name: "RO愛好者台灣",
    platforms: ["Facebook", "Twitch"],
    followers: 2109,
    supporters: 21,
    contentPoints: 150,
    referralPoints: 300,
    iapSpending: 400,
    onchainSpending: 150,
    newPlayers: 32,
    totalPoints: 450,
    tier: "Normal",
    isLive: true,
    avatar: "/Creator/Thumbnail2.jpg",
    region: "Taiwan"
  },
  {
    id: "thai-ro-newbie",
    name: "ThaiRO Newbie",
    platforms: ["Twitch"],
    followers: 1098,
    supporters: 10,
    contentPoints: 100,
    referralPoints: 200,
    iapSpending: 300,
    onchainSpending: 100,
    newPlayers: 21,
    totalPoints: 300,
    tier: "Normal",
    isLive: false,
    avatar: "/Creator/Thumbnail3.jpg",
    region: "Thailand"
  },
  {
    id: "ro-starter-tw",
    name: "RO新手台灣2",
    platforms: ["YouTube"],
    followers: 987,
    supporters: 9,
    contentPoints: 80,
    referralPoints: 150,
    iapSpending: 200,
    onchainSpending: 80,
    newPlayers: 10,
    totalPoints: 230,
    tier: "Normal",
    isLive: true,
    avatar: "/Creator/Thumbnail1.jpg",
    region: "Taiwan"
  },
  {
    id: "thai-gamer-7",
    name: "ThaiGamer07",
    platforms: ["Facebook"],
    followers: 876,
    supporters: 8,
    contentPoints: 60,
    referralPoints: 100,
    iapSpending: 150,
    onchainSpending: 60,
    newPlayers: 9,
    totalPoints: 160,
    tier: "Normal",
    isLive: false,
    avatar: "/Creator/Thumbnail2.jpg",
    region: "Thailand"
  },
  {
    id: "ro-explorer-tw",
    name: "RO探索者台灣",
    platforms: ["YouTube", "Facebook", "Twitch"],
    followers: 765,
    supporters: 7,
    contentPoints: 40,
    referralPoints: 80,
    iapSpending: 100,
    onchainSpending: 40,
    newPlayers: 8,
    totalPoints: 120,
    tier: "Normal",
    isLive: true,
    avatar: "/Creator/Thumbnail3.jpg",
    region: "Taiwan"
  },
  {
    id: "thai-streamer-4",
    name: "ThaiStreamer04",
    platforms: ["Twitch"],
    followers: 654,
    supporters: 6,
    contentPoints: 30,
    referralPoints: 60,
    iapSpending: 80,
    onchainSpending: 30,
    newPlayers: 7,
    totalPoints: 90,
    tier: "Normal",
    isLive: false,
    avatar: "/Creator/Thumbnail1.jpg",
    region: "Thailand"
  },
  {
    id: "ro-adventurer-tw",
    name: "RO冒險者台灣",
    platforms: ["Facebook"],
    followers: 543,
    supporters: 5,
    contentPoints: 20,
    referralPoints: 40,
    iapSpending: 60,
    onchainSpending: 20,
    newPlayers: 6,
    totalPoints: 60,
    tier: "Normal",
    isLive: true,
    avatar: "/Creator/Thumbnail2.jpg",
    region: "Taiwan"
  },
  {
    id: "thai-gamer-8",
    name: "ThaiGamer08",
    platforms: ["YouTube"],
    followers: 432,
    supporters: 4,
    contentPoints: 15,
    referralPoints: 30,
    iapSpending: 40,
    onchainSpending: 15,
    newPlayers: 5,
    totalPoints: 45,
    tier: "Normal",
    isLive: false,
    avatar: "/Creator/Thumbnail3.jpg",
    region: "Thailand"
  },
  {
    id: "ro-wanderer-tw",
    name: "RO漫遊者台灣",
    platforms: ["YouTube", "Twitch"],
    followers: 321,
    supporters: 3,
    contentPoints: 10,
    referralPoints: 20,
    iapSpending: 30,
    onchainSpending: 10,
    newPlayers: 4,
    totalPoints: 30,
    tier: "Normal",
    isLive: true,
    avatar: "/Creator/Thumbnail1.jpg",
    region: "Taiwan"
  },
  {
    id: "thai-ro-casual",
    name: "ThaiRO Casual",
    platforms: ["Facebook", "Twitch"],
    followers: 210,
    supporters: 2,
    contentPoints: 8,
    referralPoints: 15,
    iapSpending: 20,
    onchainSpending: 8,
    newPlayers: 3,
    totalPoints: 23,
    tier: "Normal",
    isLive: false,
    avatar: "/Creator/Thumbnail2.jpg",
    region: "Thailand"
  },
  {
    id: "ro-traveler-tw",
    name: "RO旅行者台灣",
    platforms: ["YouTube"],
    followers: 109,
    supporters: 1,
    contentPoints: 5,
    referralPoints: 10,
    iapSpending: 15,
    onchainSpending: 5,
    newPlayers: 2,
    totalPoints: 15,
    tier: "Normal",
    isLive: true,
    avatar: "/Creator/Thumbnail3.jpg",
    region: "Taiwan"
  },
  {
    id: "thai-gamer-9",
    name: "ThaiGamer09",
    platforms: ["Facebook"],
    followers: 98,
    supporters: 1,
    contentPoints: 3,
    referralPoints: 8,
    iapSpending: 10,
    onchainSpending: 3,
    newPlayers: 1,
    totalPoints: 11,
    tier: "Normal",
    isLive: false,
    avatar: "/Creator/Thumbnail1.jpg",
    region: "Thailand"
  },
  {
    id: "ro-pioneer-tw",
    name: "RO先驅者台灣",
    platforms: ["Twitch"],
    followers: 87,
    supporters: 1,
    contentPoints: 2,
    referralPoints: 5,
    iapSpending: 8,
    onchainSpending: 2,
    newPlayers: 1,
    totalPoints: 7,
    tier: "Normal",
    isLive: true,
    avatar: "/Creator/Thumbnail2.jpg",
    region: "Taiwan"
  },
  {
    id: "thai-streamer-5",
    name: "ThaiStreamer05",
    platforms: ["YouTube", "Facebook"],
    followers: 76,
    supporters: 1,
    contentPoints: 1,
    referralPoints: 3,
    iapSpending: 5,
    onchainSpending: 1,
    newPlayers: 1,
    totalPoints: 4,
    tier: "Normal",
    isLive: false,
    avatar: "/Creator/Thumbnail3.jpg",
    region: "Thailand"
  }
];

// Mock content data for top creators
export const mockContent: { [creatorId: string]: ContentItem[] } = {
  "twro-meet": [
    {
      id: "twro_vid_001",
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
      id: "twro_vid_002",
      platform: "Twitch",
      type: "Stream",
      title: "【Ragnarok Libre】全台最大監督台《第二天-三轉敏爆騎》挑戰東南亞PVP課長群",
      date: "2025-01-13",
      duration: "3:45:10",
      views: 12800,
      likes: 1560,
      comments: 234,
      valid: true,
      thumbnail: "/Creator/Thumbnail2.jpg"
    }
  ],
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
  ],
  "shorty-bluejova": [
    {
      id: "shorty_vid_001",
      platform: "YouTube",
      type: "Edited Video",
      title: "【Ragnarok Libre】Thai Server - Best Build Guide for New Players",
      date: "2025-01-14",
      duration: "12:30",
      views: 28900,
      likes: 2340,
      comments: 378,
      valid: true,
      thumbnail: "/Creator/Thumbnail1.jpg"
    }
  ],
  "game-master-th": [
    {
      id: "gm_vid_001",
      platform: "YouTube",
      type: "Edited Video",
      title: "【Ragnarok Libre】Thai Server - Ultimate PvP Guide",
      date: "2025-01-12",
      duration: "16:45",
      views: 45600,
      likes: 3450,
      comments: 567,
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