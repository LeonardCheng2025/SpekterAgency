import axios from 'axios'
import { prisma } from '../db'
import { encrypt, decrypt } from '../encryption'

export class FacebookService {
  private baseUrl = 'https://graph.facebook.com/v18.0'

  // 獲取 OAuth 授權 URL
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: process.env.FACEBOOK_APP_ID!,
      redirect_uri: process.env.FACEBOOK_REDIRECT_URI!,
      scope: 'pages_read_engagement,pages_show_list,instagram_basic,instagram_manage_insights',
      response_type: 'code'
    })

    return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`
  }

  // 處理 OAuth 回調
  async handleCallback(code: string, creatorId: string) {
    // 交換訪問令牌
    const tokenResponse = await axios.get(`${this.baseUrl}/oauth/access_token`, {
      params: {
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
        code
      }
    })

    const { access_token } = tokenResponse.data

    // 獲取用戶信息
    const userResponse = await axios.get(`${this.baseUrl}/me`, {
      params: {
        access_token,
        fields: 'id,name,accounts'
      }
    })

    const user = userResponse.data

    // 獲取頁面列表
    const pagesResponse = await axios.get(`${this.baseUrl}/me/accounts`, {
      params: {
        access_token,
        fields: 'id,name,access_token'
      }
    })

    const pages = pagesResponse.data.data || []

    // 為每個頁面創建連接
    for (const page of pages) {
      await prisma.platformConnection.upsert({
        where: {
          creatorId_platform: {
            creatorId,
            platform: 'FACEBOOK'
          }
        },
        create: {
          creatorId,
          platform: 'FACEBOOK',
          platformId: page.id,
          username: page.name,
          accessToken: encrypt(page.access_token),
          lastSync: new Date()
        },
        update: {
          accessToken: encrypt(page.access_token),
          lastSync: new Date(),
          isActive: true
        }
      })
    }

    return { user, pages }
  }

  // 同步頁面數據
  async syncPageData(platformConnectionId: string) {
    const connection = await prisma.platformConnection.findUnique({
      where: { id: platformConnectionId },
      include: { creator: true }
    })

    if (!connection) throw new Error('Platform connection not found')

    const accessToken = decrypt(connection.accessToken!)

    // 獲取頁面貼文
    const postsResponse = await axios.get(`${this.baseUrl}/${connection.platformId}/posts`, {
      params: {
        access_token: accessToken,
        fields: 'id,message,created_time,type,attachments,insights.metric(post_impressions,post_engaged_users,post_clicks)',
        limit: 50
      }
    })

    const posts = postsResponse.data.data || []

    // 處理每個貼文
    for (const post of posts) {
      await this.syncPostData(post, connection.id, connection.creatorId, accessToken)
    }

    // 更新最後同步時間
    await prisma.platformConnection.update({
      where: { id: platformConnectionId },
      data: { lastSync: new Date() }
    })
  }

  // 同步單個貼文數據
  async syncPostData(post: any, platformConnectionId: string, creatorId: string, accessToken: string) {
    // 判斷內容類型
    let contentType = 'POST'
    if (post.attachments?.data?.[0]?.type === 'video_inline') {
      contentType = 'VIDEO'
    }

    // 保存或更新貼文記錄
    const content = await prisma.content.upsert({
      where: {
        platform_platformVideoId: {
          platform: 'FACEBOOK',
          platformVideoId: post.id
        }
      },
      create: {
        creatorId,
        platformId: platformConnectionId,
        platform: 'FACEBOOK',
        platformVideoId: post.id,
        contentType: contentType as any,
        title: post.message?.substring(0, 100) || 'Facebook Post',
        description: post.message || '',
        publishedAt: new Date(post.created_time)
      },
      update: {
        title: post.message?.substring(0, 100) || 'Facebook Post',
        description: post.message || ''
      }
    })

    // 獲取詳細洞察數據
    try {
      const insightsResponse = await axios.get(`${this.baseUrl}/${post.id}/insights`, {
        params: {
          access_token: accessToken,
          metric: 'post_impressions,post_engaged_users,post_clicks,post_reactions_like_total,post_reactions_love_total,post_reactions_wow_total,post_reactions_haha_total,post_reactions_sorry_total,post_reactions_anger_total'
        }
      })

      const insights = insightsResponse.data.data || []
      const metricsData: any = {}

      // 處理洞察數據
      insights.forEach((insight: any) => {
        const value = insight.values?.[0]?.value || 0
        switch (insight.name) {
          case 'post_impressions':
            metricsData.impressions = value
            break
          case 'post_engaged_users':
            metricsData.engagement = value
            break
          case 'post_clicks':
            metricsData.shares = value
            break
          // 處理各種反應...
        }
      })

      // 保存指標數據
      await prisma.contentMetrics.create({
        data: {
          contentId: content.id,
          views: metricsData.impressions || 0,
          likes: metricsData.reactions || 0,
          shares: metricsData.shares || 0,
          reach: metricsData.reach || 0,
          engagement: metricsData.engagement || 0,
          reactions: metricsData.totalReactions || 0
        }
      })
    } catch (error) {
      console.error('Error fetching Facebook insights:', error)
    }
  }

  // 獲取頁面整體指標
  async syncPageInsights(platformConnectionId: string) {
    const connection = await prisma.platformConnection.findUnique({
      where: { id: platformConnectionId }
    })

    if (!connection) return

    const accessToken = decrypt(connection.accessToken!)

    try {
      const insightsResponse = await axios.get(`${this.baseUrl}/${connection.platformId}/insights`, {
        params: {
          access_token: accessToken,
          metric: 'page_fans,page_impressions,page_engaged_users',
          period: 'day',
          since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
          until: new Date().toISOString().split('T')[0]
        }
      })

      const insights = insightsResponse.data.data || []
      
      // 處理頁面級別的指標...
      // 可以保存到 CreatorMetrics 表
    } catch (error) {
      console.error('Error fetching page insights:', error)
    }
  }
}
