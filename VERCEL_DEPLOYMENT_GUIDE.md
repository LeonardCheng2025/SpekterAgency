# 🚀 Vercel Deployment Guide for Spekter Agency

## 📋 Prerequisites

1. **GitHub Repository**: Ensure your code is pushed to GitHub
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Environment Variables**: Prepare all required environment variables

## 🔧 Deployment Steps

### 1. Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository: `LeonardCheng2025/SpekterAgency`
4. Vercel will automatically detect it's a Next.js project

### 2. Configure Project Settings

**Framework Preset**: Next.js (auto-detected)
**Root Directory**: `./` (default)
**Build Command**: `npm run build` (default)
**Output Directory**: `.next` (auto-detected)
**Install Command**: `npm install` (default)

### 3. Environment Variables

Add the following environment variables in Vercel Dashboard:

#### Required Variables:
```bash
# Database
DATABASE_URL=your_database_connection_string

# YouTube API
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_REDIRECT_URI=https://your-vercel-app.vercel.app/api/auth/youtube/callback

# Twitch API
TWITCH_CLIENT_ID=your_twitch_client_id
TWITCH_CLIENT_SECRET=your_twitch_client_secret
TWITCH_REDIRECT_URI=https://your-vercel-app.vercel.app/api/auth/twitch/callback

# Facebook API (if using)
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_REDIRECT_URI=https://your-vercel-app.vercel.app/api/auth/facebook/callback

# Security
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key
NEXTAUTH_SECRET=your_nextauth_secret

# App Configuration
NODE_ENV=production
NEXT_PUBLIC_FRONTEND_URL=https://your-vercel-app.vercel.app
NEXT_PUBLIC_BACKEND_URL=https://your-vercel-app.vercel.app
```

### 4. Deploy

1. Click "Deploy" button
2. Wait for the build to complete
3. Your app will be available at `https://your-project-name.vercel.app`

## 🔍 Troubleshooting

### Common Issues:

#### 1. "No Output Directory named 'public' found"
**Solution**: This project uses Next.js with API routes, not static export. The `vercel.json` file has been configured to handle this properly.

#### 2. Build Failures
**Check**:
- All environment variables are set
- Database connection is working
- API credentials are valid

#### 3. API Routes Not Working
**Check**:
- Environment variables are properly set
- CORS configuration in `next.config.js`
- API route handlers are properly exported

#### 4. Database Connection Issues
**Check**:
- `DATABASE_URL` is correctly formatted
- Database is accessible from Vercel's servers
- Prisma client is generated (`npm run build` includes this)

## 📊 Project Structure

```
├── pages/
│   ├── api/           # API routes (serverless functions)
│   ├── dashboard.tsx  # Dashboard page
│   ├── leaderboard.tsx # Leaderboard page
│   └── ...
├── components/        # React components
├── lib/              # Utility functions
├── prisma/           # Database schema
├── vercel.json       # Vercel configuration
└── next.config.js    # Next.js configuration
```

## 🔐 Security Notes

1. **Environment Variables**: Never commit sensitive data to Git
2. **CORS**: Configured to use environment variables
3. **API Keys**: Store securely in Vercel environment variables
4. **Database**: Use connection pooling for production

## 🚀 Post-Deployment

1. **Test API Endpoints**: Verify all API routes work
2. **Test OAuth**: Ensure social login works
3. **Database**: Run migrations if needed
4. **Monitoring**: Set up Vercel Analytics

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test locally with `npm run build && npm start`
4. Check GitHub repository for latest changes

---

**Note**: This is a full-stack Next.js application with API routes, not a static site. Vercel will automatically handle the serverless functions for your API routes.
