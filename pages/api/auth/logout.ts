import { NextApiRequest, NextApiResponse } from 'next'
import { clearAuthCookie } from '../../../lib/auth'
import { withCors } from '../../../lib/cors'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 清除認證 cookie
    clearAuthCookie(res)
    
    res.status(200).json({ 
      success: true, 
      message: 'Logged out successfully' 
    })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({ 
      error: 'Failed to logout',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export default withCors(handler)
