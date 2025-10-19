# Spekter Agency - Creator Competition Platform

A modern web application for the Spekter Agency Creator Competition, built with Next.js, React, and Tailwind CSS.

## Features

### 🎮 Game-Inspired Dark Theme
- Modern dark theme with subtle gradient backgrounds
- Soft glow accents and rounded corners
- Game-style UI components with hover effects

### 📊 Creator Dashboard
- Season/Round progress tracking
- KPI cards showing Total Points, Content Points, Referral Points, and Estimated Rewards
- Live announcements and news feed
- Mini leaderboard with top 8 creators
- Quick action buttons

### 🏆 Global Leaderboard
- Filter by Region (Taiwan/Thailand) and Platform (YouTube/Facebook/Twitch)
- Sort by different metrics (Total Points, Content Points, Referral Points, etc.)
- Tier system (Best/Partner/Normal) with visual badges
- Live streaming indicators
- Pagination support

### 👤 Creator Profiles
- Comprehensive creator information and statistics
- Content grid with validation status
- Referral analytics (IAP vs On-chain spending)
- Supporting comments from players
- Manual mode toggle for content submission

### 🔐 Social Login
- Facebook, YouTube, and Twitch login options
- Privacy-focused messaging

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Heroicons
- **Deployment**: Static export ready

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── components/          # Reusable UI components
│   ├── KpiCard.tsx     # Dashboard KPI display cards
│   ├── CreatorCard.tsx # Creator profile cards
│   ├── ContentTile.tsx # Content item displays
│   ├── FiltersBar.tsx  # Leaderboard filtering
│   ├── LeaderboardTable.tsx # Ranking display
│   ├── Layout.tsx      # Main app layout
│   └── Pagination.tsx  # Page navigation
├── data/
│   └── mockData.ts     # Dummy data for demo
├── pages/
│   ├── login.tsx       # Social media login page
│   ├── dashboard.tsx   # Creator dashboard
│   ├── leaderboard.tsx # Global rankings
│   └── creator/[id].tsx # Individual creator profiles
├── styles/
│   └── globals.css     # Global styles and theme
└── public/             # Static assets including logos
```

## Key Features Implemented

### ✅ Complete UI Mock-up
- All 4 pages implemented with responsive design
- Working navigation and routing
- Interactive filters and pagination

### ✅ Comprehensive Data Model
- 10+ mock creators with realistic data
- Content items with platform-specific metadata
- Supporting comments and announcements
- Regional and platform diversity

### ✅ Advanced Filtering & Sorting
- Multi-criteria filtering (Region, Platform, Sort)
- Real-time results update
- Pagination with proper state management

### ✅ Visual Polish
- Tier-based color coding (Best/Partner/Normal)
- Platform badges and live indicators
- Hover effects and smooth transitions
- Mobile-responsive design

## Demo Data

The application includes comprehensive mock data:
- **10 Creators** across Taiwan and Thailand
- **Multiple platforms** (YouTube, Facebook, Twitch)
- **Content items** with validation status
- **Supporting comments** from players
- **Season/Round** progress tracking

## Customization

### Theme Colors
Edit `tailwind.config.js` to customize the color scheme:
```javascript
colors: {
  'game-dark': '#0a0a0b',
  'game-accent': '#6366f1',
  // ... other colors
}
```

### Mock Data
Update `data/mockData.ts` to modify creators, content, or other demo data.

## Deployment

Build for production:
```bash
npm run build
npm run start
```

The application is optimized for static deployment and can be easily deployed to platforms like Vercel, Netlify, or any static hosting service.

## License

This project is a demo/mock-up for DELABS presentation purposes.
