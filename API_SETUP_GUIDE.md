# 🔑 API 設置指南

## 📺 YouTube API 設置

### 已提供的資訊
- **API Key**: `AIzaSyCzGd_nkabU1oZco79PK7f9YsJWCToWi5A`

### 還需要設置的 OAuth 憑證

1. **前往 Google Cloud Console**
   - 訪問: https://console.cloud.google.com/
   - 選擇你的項目或創建新項目

2. **啟用必要的 API**
   - 在左側菜單選擇「API 和服務」>「庫」
   - 搜索並啟用以下 API：
     - **YouTube Data API v3** ✅ (已有 API Key)
     - **YouTube Analytics API** (需要 OAuth)

3. **創建 OAuth 2.0 憑證**
   - 前往「API 和服務」>「憑證」
   - 點擊「創建憑證」>「OAuth 2.0 用戶端 ID」
   - 選擇「網路應用程式」
   - 設置重新導向 URI:
     ```
     https://ragnaroklibre-clutch-production.up.railway.app/api/auth/youtube/callback
     http://localhost:3000/api/auth/youtube/callback (開發用)
     ```
   - 記錄 **Client ID** 和 **Client Secret**

### 所需權限範圍
```
https://www.googleapis.com/auth/youtube.readonly
https://www.googleapis.com/auth/yt-analytics.readonly
```

---

## 🎮 Twitch API 設置

### 已提供的資訊
- **Client ID**: `7kyzo0p5di36m1cbyyk452khhwx5gc`

### 還需要獲取的資訊

1. **前往 Twitch Developers Console**
   - 訪問: https://dev.twitch.tv/console
   - 登入你的 Twitch 帳號

2. **找到你的應用程式**
   - 在應用程式列表中找到對應的應用
   - 點擊「管理」

3. **獲取 Client Secret**
   - 在應用詳情頁面可以看到 **Client Secret**
   - 如果看不到，點擊「新增密鑰」

4. **設置 OAuth 重新導向 URL**
   - 確保設置了以下重新導向 URL：
     ```
     https://ragnaroklibre-clutch-production.up.railway.app/api/auth/twitch/callback
     http://localhost:3000/api/auth/twitch/callback
     ```

### 所需權限範圍
```
user:read:email
channel:read:subscriptions
analytics:read:games
analytics:read:extensions
```

---

## 🔧 環境變數更新

獲得所有憑證後，請更新以下環境變數：

### 本地開發 (.env.local)
```bash
# YouTube API
YOUTUBE_CLIENT_ID="你的_Google_OAuth_Client_ID"
YOUTUBE_CLIENT_SECRET="你的_Google_OAuth_Client_Secret"
YOUTUBE_API_KEY="AIzaSyCzGd_nkabU1oZco79PK7f9YsJWCToWi5A"

# Twitch API  
TWITCH_CLIENT_ID="7kyzo0p5di36m1cbyyk452khhwx5gc"
TWITCH_CLIENT_SECRET="你的_Twitch_Client_Secret"
```

### Railway 生產環境
在 Railway 項目設置中添加相同的環境變數

---

## 🧪 測試 API 連接

### 測試 YouTube API
```bash
# 測試基本 API Key
curl "https://www.googleapis.com/youtube/v3/channels?part=snippet&forUsername=GoogleDevelopers&key=AIzaSyCzGd_nkabU1oZco79PK7f9YsJWCToWi5A"
```

### 測試 Twitch API
```bash
# 獲取應用程式 Token
curl -X POST 'https://id.twitch.tv/oauth2/token' \
-H 'Content-Type: application/x-www-form-urlencoded' \
-d 'client_id=7kyzo0p5di36m1cbyyk452khhwx5gc&client_secret=你的_Client_Secret&grant_type=client_credentials'
```

---

## ⚡ 快速啟動流程

1. **獲取缺失的憑證**
   - YouTube OAuth Client ID & Secret
   - Twitch Client Secret

2. **更新環境變數**
   - 更新 `.env.local`
   - 更新 Railway 環境變數

3. **測試連接**
   ```bash
   npm run dev
   # 訪問 http://localhost:3000/api/health
   ```

4. **測試 OAuth 流程**
   ```bash
   # 測試 YouTube OAuth (需要有效的 creatorId)
   http://localhost:3000/api/connect/youtube?creatorId=test123
   
   # 測試 Twitch OAuth
   http://localhost:3000/api/connect/twitch?creatorId=test123
   ```

---

## 📊 API 配額和限制

### YouTube API
- **每日配額**: 10,000 點
- **搜索請求**: 100 點/次
- **影片詳情**: 1 點/次
- **Analytics**: 5 點/次

### Twitch API
- **速率限制**: 每分鐘 800 請求
- **用戶令牌**: 需要定期刷新
- **應用令牌**: 60 天有效期

---

## 🔒 安全建議

1. **永不在前端暴露 API Secret**
2. **使用環境變數存儲敏感信息**
3. **定期輪換 API 密鑰**
4. **監控 API 使用量**
5. **設置適當的 OAuth 範圍**

完成這些設置後，你的項目就可以開始同步 YouTube 和 Twitch 數據了！🚀
