import { NextApiRequest, NextApiResponse } from 'next'
import { getCurrentUser } from '../../../lib/auth'
import { withCors } from '../../../lib/cors'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const user = await getCurrentUser(req)
    
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Get current user error:', error)
    res.status(500).json({ 
      error: 'Failed to get user information',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export default withCors(handler)
