import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { query, maxResults = 10 } = req.query
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required' })
    }

    // 使用後端的 API Key (安全)
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: parseInt(maxResults as string),
        key: process.env.YOUTUBE_API_KEY // 只在後端可見
      }
    })

    res.status(200).json({
      success: true,
      data: response.data.items
    })
  } catch (error) {
    console.error('YouTube search error:', error)
    res.status(500).json({
      error: 'YouTube API request failed',
      details: axios.isAxiosError(error) ? error.response?.data : 'Unknown error'
    })
  }
}
