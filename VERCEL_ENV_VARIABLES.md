# 🌐 Vercel 前端環境變數配置

## 📋 Vercel 環境變數列表

在 Vercel 項目設置中添加以下環境變數：

### 🔗 後端 API 配置
```bash
NEXT_PUBLIC_BACKEND_URL=https://your-app.railway.app
```

### 🌐 前端域名配置
```bash
NEXT_PUBLIC_FRONTEND_URL=https://your-frontend-domain.com
```

### 🌐 應用程式配置
```bash
NODE_ENV=production
```

## 🔧 設置步驟

### 1. 進入 Vercel Dashboard
- 訪問: https://vercel.com/dashboard
- 選擇你的前端項目

### 2. 設置環境變數
- 點擊項目 > Settings > Environment Variables
- 添加上述環境變數

### 3. 重新部署
- 環境變數設置完成後
- 觸發新的部署

## 📊 架構說明

```
Vercel (前端)
├── 使用 NEXT_PUBLIC_BACKEND_URL 調用後端 API
├── localStorage 存儲 JWT token
└── 跨域認證處理

Railway (後端)
├── 處理 OAuth 回調
├── 生成 JWT token
├── 重定向到前端並帶上 token
└── 提供 API 服務
```

## 🔐 認證流程

1. 用戶在前端點擊登入
2. 跳轉到 Railway 後端 OAuth
3. OAuth 成功後，後端生成 JWT token
4. 重定向到前端並在 URL 中帶上 token
5. 前端保存 token 到 localStorage
6. 後續 API 調用使用 Authorization header 傳送 token

這樣就解決了跨域 cookie 的問題！🚀