import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const apiKey = process.env.YOUTUBE_API_KEY
    
    if (!apiKey) {
      return res.status(500).json({ error: 'YouTube API key not configured' })
    }

    // 測試基本 API 調用 - 獲取 Google Developers 頻道信息
    const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
      params: {
        part: 'snippet,statistics',
        forUsername: 'GoogleDevelopers',
        key: apiKey
      }
    })

    const channel = response.data.items?.[0]

    res.status(200).json({
      success: true,
      message: 'YouTube API connection successful',
      testData: {
        channelTitle: channel?.snippet?.title,
        subscriberCount: channel?.statistics?.subscriberCount,
        videoCount: channel?.statistics?.videoCount,
        viewCount: channel?.statistics?.viewCount
      },
      apiKey: `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}` // 只顯示部分密鑰
    })
  } catch (error) {
    console.error('YouTube API test error:', error)
    
    if (axios.isAxiosError(error)) {
      return res.status(500).json({
        error: 'YouTube API request failed',
        details: error.response?.data || error.message,
        status: error.response?.status
      })
    }

    res.status(500).json({
      error: 'Unexpected error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
