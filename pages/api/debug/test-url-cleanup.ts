import { NextApiRequest, NextApiResponse } from 'next'
import { withCors } from '../../../lib/cors'

// 清理和修正 URL (複製自 submit.ts)
function cleanUrl(url: string): string {
  if (!url) return url
  
  // 先處理模板變量
  let cleanedUrl = url
    .replace('%{width}', '1280')
    .replace('%{height}', '720')
  
  // 修正路徑中的多個斜杠，但保留協議部分的雙斜杠
  const protocolMatch = cleanedUrl.match(/^(https?:\/\/)/)
  if (protocolMatch) {
    const protocol = protocolMatch[1]
    const rest = cleanedUrl.substring(protocol.length)
    // 更強力的清理：移除所有連續的斜杠，包括 //thumb/thumb 這種情況
    cleanedUrl = protocol + rest.replace(/\/+/g, '/')
  }
  
  // 特別處理 Twitch 縮圖 URL 中的重複路徑問題
  if (cleanedUrl.includes('//thumb/thumb')) {
    cleanedUrl = cleanedUrl.replace('//thumb/thumb', '/thumb')
  }
  
  // 移除其他可能的重複路徑段
  cleanedUrl = cleanedUrl.replace(/\/([^\/]+)\/\1/g, '/$1')
  
  return cleanedUrl
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // 測試 URL
  const testUrls = [
    'https://static-cdn.jtvnw.net/cf_vods/d3vd9lfkzbru3h/3e4f7d61da919222b286_chainchallenger_28413253627_3011586900//thumb/thumb2017154762-1280x720.jpg',
    'https://example.com//path//to//file.jpg',
    'https://test.com/folder/folder/image.png',
    'https://static-cdn.jtvnw.net/previews-ttv/live_user_test-%{width}x%{height}.jpg'
  ]

  const results = testUrls.map(url => ({
    original: url,
    cleaned: cleanUrl(url),
    fixed: cleanUrl(url) !== url
  }))

  return res.status(200).json({
    message: 'URL cleanup test results',
    results
  })
}

export default withCors(handler)
