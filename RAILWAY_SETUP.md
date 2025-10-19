# Railway 部署設置指南

## 🚀 項目概述
這個項目已經配置好連接到 Railway PostgreSQL 數據庫，並設置了完整的 API 結構來支持：
- YouTube Analytics API 集成
- Facebook Graph API 集成  
- Twitch API 集成
- 創作者數據同步和計分系統

## 📊 數據庫結構
已創建的主要數據表：
- `creators` - 創作者基本信息
- `platform_connections` - OAuth 平台連接
- `contents` - 影片/直播內容
- `content_metrics` - 社交指標數據
- `content_analytics` - 詳細分析數據
- `creator_metrics` - 創作者整體指標
- `referrals` - 推薦轉介記錄
- `announcements` - 系統公告
- `seasons` - 賽季管理

## 🔧 環境變數設置

### Railway 部署環境變數
在 Railway 項目設置中添加以下環境變數：

```bash
# 數據庫 (使用內部 URL)
DATABASE_URL=postgresql://postgres:hpIrKqTjeSbNycBpXRBSlKdlhfMEZTHi@postgres.railway.internal:5432/railway

# YouTube API
YOUTUBE_CLIENT_ID=你的_youtube_client_id
YOUTUBE_CLIENT_SECRET=你的_youtube_client_secret
YOUTUBE_API_KEY=你的_youtube_api_key
YOUTUBE_REDIRECT_URI=https://ragnaroklibre-clutch-production.up.railway.app/api/auth/youtube/callback

# Facebook API
FACEBOOK_APP_ID=你的_facebook_app_id
FACEBOOK_APP_SECRET=你的_facebook_app_secret
FACEBOOK_REDIRECT_URI=https://ragnaroklibre-clutch-production.up.railway.app/api/auth/facebook/callback

# Twitch API
TWITCH_CLIENT_ID=你的_twitch_client_id
TWITCH_CLIENT_SECRET=你的_twitch_client_secret
TWITCH_REDIRECT_URI=https://ragnaroklibre-clutch-production.up.railway.app/api/auth/twitch/callback

# 安全設置
JWT_SECRET=你的超級安全JWT密鑰請在生產環境中更改
ENCRYPTION_KEY=你的32位加密密鑰請在這裡更改

# 應用配置
NODE_ENV=production
RAILWAY_PUBLIC_URL=https://ragnaroklibre-clutch-production.up.railway.app
SYNC_INTERVAL_MINUTES=60
BATCH_SIZE=10
```

## 🔑 API 密鑰獲取

### 1. YouTube API
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 創建新項目或選擇現有項目
3. 啟用 YouTube Data API v3 和 YouTube Analytics API
4. 創建 OAuth 2.0 憑證
5. 添加授權重定向 URI: `https://ragnaroklibre-clutch-production.up.railway.app/api/auth/youtube/callback`

### 2. Facebook Graph API
1. 前往 [Facebook Developers](https://developers.facebook.com/)
2. 創建新應用
3. 添加 Facebook Login 產品
4. 設置有效的 OAuth 重定向 URI: `https://ragnaroklibre-clutch-production.up.railway.app/api/auth/facebook/callback`
5. 申請以下權限：
   - `pages_read_engagement`
   - `pages_show_list`
   - `instagram_basic`
   - `instagram_manage_insights`

### 3. Twitch API
1. 前往 [Twitch Developers](https://dev.twitch.tv/)
2. 註冊應用
3. 設置 OAuth 重定向 URL: `https://ragnaroklibre-clutch-production.up.railway.app/api/auth/twitch/callback`
4. 獲取 Client ID 和 Client Secret

## 🚀 部署步驟

### 1. 連接 GitHub 到 Railway
1. 將代碼推送到 GitHub 倉庫
2. 在 Railway 中連接 GitHub 倉庫
3. Railway 會自動檢測到 Next.js 項目並開始構建

### 2. 設置環境變數
在 Railway 項目設置中添加上述所有環境變數

### 3. 部署驗證
部署完成後訪問：
- 主頁: `https://ragnaroklibre-clutch-production.up.railway.app`
- API 健康檢查: `https://ragnaroklibre-clutch-production.up.railway.app/api/health`

## 📋 API 端點

### 認證相關
- `GET /api/connect/youtube?creatorId={id}` - 啟動 YouTube OAuth
- `GET /api/connect/facebook?creatorId={id}` - 啟動 Facebook OAuth  
- `GET /api/connect/twitch?creatorId={id}` - 啟動 Twitch OAuth

### 數據同步
- `POST /api/sync/{creatorId}` - 手動同步創作者數據

### 回調端點
- `GET /api/auth/youtube/callback` - YouTube OAuth 回調
- `GET /api/auth/facebook/callback` - Facebook OAuth 回調
- `GET /api/auth/twitch/callback` - Twitch OAuth 回調

## 🔄 自動同步系統
系統會每小時自動同步所有已連接的創作者數據，包括：
- 影片/直播的最新指標
- 觀眾分析數據
- 創作者分數計算
- 排行榜更新

## 🛠️ 本地開發
```bash
# 安裝依賴
npm install

# 設置環境變數 (複製並編輯 .env.local)
cp .env.example .env.local

# 運行開發服務器
npm run dev

# 打開數據庫管理界面
npm run db:studio
```

## 📈 監控和維護
- 檢查 Railway 日誌以監控 API 調用和錯誤
- 定期檢查數據庫連接和同步狀態
- 監控 API 配額使用情況
- 更新 OAuth 令牌過期設置

## 🔧 故障排除

### 常見問題
1. **OAuth 回調失敗**: 檢查重定向 URI 是否正確設置
2. **API 限制**: 調整 `BATCH_SIZE` 和同步間隔
3. **數據庫連接**: 確認環境變數中的數據庫 URL 正確
4. **令牌過期**: 實現自動刷新機制

### 日誌檢查
```bash
# Railway CLI 查看日誌
railway logs

# 檢查特定服務日誌
railway logs --service your-service-name
```

## 📞 支持
如有問題，請檢查：
1. Railway 部署日誌
2. API 響應錯誤信息
3. 數據庫連接狀態
4. 環境變數配置
