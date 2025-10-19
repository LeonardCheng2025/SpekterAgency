import { NextApiRequest, NextApiResponse } from 'next'

// CORS 中間件，用於處理跨域請求
export function corsMiddleware(req: NextApiRequest, res: NextApiResponse) {
  const origin = req.headers.origin
  const allowedOrigins = [
    'https://ragnarok-libre.clutch-hub.xyz',
    'https://ragnarok-libre-clutch.vercel.app',
    'https://ragnarok-libre-clutch-git-main-leonardcheng2025s-projects.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ]

  // 檢查請求來源是否在允許列表中
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Cookie'
  )

  // 處理預檢請求
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return true
  }

  return false
}

// 高階函數，用於包裝 API 處理函數並自動添加 CORS
export function withCors(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // 添加 CORS headers
    const isPreflightHandled = corsMiddleware(req, res)
    
    // 如果是預檢請求，直接返回
    if (isPreflightHandled) {
      return
    }

    // 執行原始處理函數
    return handler(req, res)
  }
}
