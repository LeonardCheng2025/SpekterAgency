import { NextApiRequest, NextApiResponse } from 'next'
import { SyncService } from '../../../lib/sync-service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { creatorId } = req.query

    if (!creatorId || typeof creatorId !== 'string') {
      return res.status(400).json({ error: 'Creator ID is required' })
    }

    const syncService = new SyncService()
    await syncService.syncCreator(creatorId)

    res.status(200).json({ 
      success: true, 
      message: 'Creator data synced successfully' 
    })
  } catch (error) {
    console.error('Error syncing creator:', error)
    res.status(500).json({ 
      error: 'Failed to sync creator data',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
