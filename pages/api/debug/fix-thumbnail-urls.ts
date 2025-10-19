import { NextApiRequest, NextApiResponse } from 'next'
import { withCors } from '../../../lib/cors'
import { prisma } from '../../../lib/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 獲取所有需要修復的 Twitch 內容
    const contents = await prisma.content.findMany({
      where: {
        platform: 'TWITCH',
        thumbnailUrl: {
          not: null,
          contains: '/thumb2017154762-1280x720.jpg'
        }
      },
      select: {
        id: true,
        title: true,
        thumbnailUrl: true
      }
    })

    console.log(`Found ${contents.length} contents to fix`)

    const updates = []
    
    for (const content of contents) {
      if (content.thumbnailUrl) {
        // 修復 URL：將 /thumb2017154762 改為 /thumb/thumb2017154762
        const fixedUrl = content.thumbnailUrl.replace(
          '/thumb2017154762-1280x720.jpg',
          '/thumb/thumb2017154762-1280x720.jpg'
        )
        
        if (fixedUrl !== content.thumbnailUrl) {
          updates.push({
            id: content.id,
            title: content.title,
            oldUrl: content.thumbnailUrl,
            newUrl: fixedUrl
          })
        }
      }
    }

    console.log(`Will update ${updates.length} URLs`)

    // 執行批量更新
    for (const update of updates) {
      await prisma.content.update({
        where: { id: update.id },
        data: { thumbnailUrl: update.newUrl }
      })
    }

    return res.status(200).json({
      message: 'Thumbnail URLs fixed successfully',
      totalFound: contents.length,
      totalUpdated: updates.length,
      updates: updates
    })
  } catch (error) {
    console.error('Error fixing thumbnail URLs:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export default withCors(handler)
