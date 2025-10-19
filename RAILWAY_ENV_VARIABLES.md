# 🚂 Railway 環境變數配置

## 📋 完整的 Railway 環境變數列表

複製以下所有環境變數到你的 Railway 項目設置：

### 🗄️ 數據庫配置
```bash
DATABASE_URL=postgresql://postgres:YOUR_DB_PASSWORD@postgres.railway.internal:5432/railway
```

### 📺 YouTube API 配置
```bash
YOUTUBE_CLIENT_ID=your_youtube_client_id.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_REDIRECT_URI=https://your-app.railway.app/api/auth/youtube/callback
```

### 🎮 Twitch API 配置
```bash
TWITCH_CLIENT_ID=your_twitch_client_id
TWITCH_CLIENT_SECRET=your_twitch_client_secret
TWITCH_REDIRECT_URI=https://your-app.railway.app/api/auth/twitch/callback
```

### 📘 Facebook API 配置 (未來使用)
```bash
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_REDIRECT_URI=https://your-app.railway.app/api/auth/facebook/callback
```

### 🌐 應用程式配置
```bash
NODE_ENV=production
RAILWAY_PUBLIC_URL=https://your-app.railway.app
NEXTAUTH_URL=https://your-app.railway.app
FRONTEND_URL=https://your-frontend-domain.com
```

### 🔐 安全配置 (請生成新的密鑰)
```bash
JWT_SECRET=your_jwt_secret_here
ENCRYPTION_KEY=your_encryption_key_here
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### ⚙️ API 同步配置
```bash
SYNC_INTERVAL_MINUTES=60
BATCH_SIZE=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🔧 設置步驟

### 1. 進入 Railway Dashboard
- 訪問: https://railway.app/dashboard
- 選擇你的項目: `dependable-reflection`

### 2. 設置環境變數
- 點擊項目 > Settings > Variables
- 逐個添加上述所有變數

### 3. 部署
- 環境變數設置完成後
- 觸發新的部署

## ⚠️ 重要提醒

### 1. 內部 vs 公開 URL
- `postgres.railway.internal` - Railway 內部網絡 (生產環境)
- `yamabiko.proxy.rlwy.net:40559` - 公開訪問 (開發/測試)

### 2. 域名配置
- 所有 `REDIRECT_URI` 都指向 Vercel 域名
- 確保在各平台開發者控制台中添加這些 URI

### 3. 安全密鑰
- 這些密鑰是唯一生成的，請妥善保管
- 不要在公開代碼庫中暴露

## 🧪 測試部署

設置完成後，測試這些端點：
```bash
# 健康檢查
curl https://你的railway域名.railway.app/api/health

# OAuth 測試 (需要有效的 creatorId)
https://你的railway域名.railway.app/api/connect/youtube?creatorId=test123
https://你的railway域名.railway.app/api/connect/twitch?creatorId=test123
```

## 📊 架構說明

```
Vercel (前端)
└── API 調用 → Railway (後端 API)
                ├── PostgreSQL 數據庫
                ├── OAuth 處理
                ├── 數據同步服務
                └── 創作者分數計算
```

所有變數配置完成後，你的 Railway 後端就可以為 Vercel 前端提供完整的 API 服務了！🚀
