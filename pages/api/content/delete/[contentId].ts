import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/db'
import { getCurrentUser } from '../../../../lib/auth'
import { withCors } from '../../../../lib/cors'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 驗證用戶身份
    const user = await getCurrentUser(req)
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { contentId } = req.query

    if (!contentId || typeof contentId !== 'string') {
      return res.status(400).json({ error: 'Content ID is required' })
    }

    // 檢查內容是否存在
    const content = await prisma.content.findUnique({
      where: { id: contentId },
      select: { 
        id: true, 
        creatorId: true, 
        title: true 
      }
    })

    if (!content) {
      return res.status(404).json({ error: 'Content not found' })
    }

    // 檢查權限：只有內容擁有者或 super admin 可以刪除
    if (content.creatorId !== user.id && !user.isSuperAdmin) {
      return res.status(403).json({ error: 'You can only delete your own content' })
    }

    // 在事務中刪除內容和相關的指標
    await prisma.$transaction(async (tx) => {
      // 先刪除相關的 ContentMetrics
      await tx.contentMetrics.deleteMany({
        where: { contentId: contentId }
      })

      // 然後刪除 Content
      await tx.content.delete({
        where: { id: contentId }
      })
    })

    return res.status(200).json({
      message: 'Content deleted successfully',
      deletedContent: {
        id: content.id,
        title: content.title
      }
    })
  } catch (error) {
    console.error('Error deleting content:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export default withCors(handler)
