import { NextApiRequest, NextApiResponse } from 'next'
import { FacebookService } from '../../../../lib/api/facebook'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { code, state } = req.query

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Authorization code is required' })
    }

    // state 應該包含 creatorId
    const creatorId = state as string
    if (!creatorId) {
      return res.status(400).json({ error: 'Creator ID is required' })
    }

    const facebookService = new FacebookService()
    const result = await facebookService.handleCallback(code, creatorId)

    // 重定向到成功頁面
    res.redirect(`/dashboard?connected=facebook&pages=${result.pages.length}`)
  } catch (error) {
    console.error('Facebook OAuth callback error:', error)
    res.redirect('/dashboard?error=facebook_connection_failed')
  }
}
