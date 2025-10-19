import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from './db'

export interface AuthUser {
  id: string
  name: string
  email?: string
  avatar?: string
  tier?: string
  isSuperAdmin?: boolean
  totalPoints?: number
  contentPoints?: number
  referralPoints?: number
  // Game Referral System Fields
  referralLink?: string
  uidHEX?: string
  referralCount?: number
  purchaseAmountTotal?: number
  lastReferralSync?: Date
  platforms: {
    platform: string
    username: string
    platformId: string
  }[]
}

export interface JWTPayload {
  userId: string
  iat?: number
  exp?: number
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'

// 生成 JWT Token
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

// 驗證 JWT Token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

// 從請求中獲取當前用戶
export async function getCurrentUser(req: NextApiRequest): Promise<AuthUser | null> {
  try {
    // 從 Cookie 或 Authorization header 獲取 token
    let token = req.cookies.auth_token
    
    // 如果 cookie 中沒有，檢查 Authorization header
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.replace('Bearer ', '')
      }
    }
    
    if (!token) return null

    const payload = verifyToken(token)
    if (!payload) return null

    // 從數據庫獲取用戶信息
    const creator = await prisma.creator.findUnique({
      where: { id: payload.userId },
      include: {
        platforms: {
          where: { isActive: true },
          select: {
            platform: true,
            username: true,
            platformId: true
          }
        }
      }
    })

    if (!creator) return null

    return {
      id: creator.id,
      name: creator.name,
      email: creator.email || undefined,
      avatar: creator.avatar || undefined,
      tier: creator.tier,
      isSuperAdmin: creator.isSuperAdmin,
      totalPoints: creator.totalPoints,
      contentPoints: creator.contentPoints,
      referralPoints: creator.referralPoints,
      // Game Referral System Fields
      referralLink: creator.referralLink || undefined,
      uidHEX: creator.uidHEX || undefined,
      referralCount: creator.referralCount,
      purchaseAmountTotal: creator.purchaseAmountTotal,
      lastReferralSync: creator.lastReferralSync || undefined,
      platforms: creator.platforms.map(p => ({
        platform: p.platform,
        username: p.username,
        platformId: p.platformId
      }))
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// 設置認證 Cookie
export function setAuthCookie(res: NextApiResponse, token: string) {
  const isProduction = process.env.NODE_ENV === 'production'
  
  // 設置跨域 cookie，適用於 Railway 後端 + Vercel 前端
  res.setHeader('Set-Cookie', [
    `auth_token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=None${
      isProduction ? '; Secure' : ''
    }`
  ])
}

// 清除認證 Cookie
export function clearAuthCookie(res: NextApiResponse) {
  res.setHeader('Set-Cookie', [
    'auth_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax'
  ])
}

// 中間件：檢查用戶是否已認證
export async function requireAuth(req: NextApiRequest, res: NextApiResponse): Promise<AuthUser | null> {
  const user = await getCurrentUser(req)
  
  if (!user) {
    res.status(401).json({ error: 'Authentication required' })
    return null
  }
  
  return user
}

// 創建或更新用戶
export async function createOrUpdateUser(platformData: {
  platform: 'YOUTUBE' | 'TWITCH'
  platformId: string
  username: string
  name: string
  email?: string
  avatar?: string
  accessToken: string
  refreshToken?: string
  tokenExpiry?: Date
}): Promise<AuthUser> {
  // 檢查是否已存在該平台的連接
  let creator = await prisma.creator.findFirst({
    where: {
      platforms: {
        some: {
          platform: platformData.platform,
          platformId: platformData.platformId
        }
      }
    },
    include: {
      platforms: {
        where: { isActive: true }
      }
    }
  })

  if (!creator) {
    // 創建新用戶
    creator = await prisma.creator.create({
      data: {
        name: platformData.name,
        email: platformData.email,
        avatar: platformData.avatar,
        region: 'Thailand', // 默認地區
        tier: 'Normal'
      },
      include: {
        platforms: true
      }
    })
  } else {
    // 更新現有用戶信息
    creator = await prisma.creator.update({
      where: { id: creator.id },
      data: {
        name: platformData.name,
        email: platformData.email || creator.email,
        avatar: platformData.avatar || creator.avatar
      },
      include: {
        platforms: {
          where: { isActive: true }
        }
      }
    })
  }

  // 更新或創建平台連接
  await prisma.platformConnection.upsert({
    where: {
      creatorId_platform: {
        creatorId: creator.id,
        platform: platformData.platform
      }
    },
    create: {
      creatorId: creator.id,
      platform: platformData.platform,
      platformId: platformData.platformId,
      username: platformData.username,
      accessToken: platformData.accessToken,
      refreshToken: platformData.refreshToken,
      tokenExpiry: platformData.tokenExpiry,
      isActive: true,
      lastSync: new Date()
    },
    update: {
      username: platformData.username,
      accessToken: platformData.accessToken,
      refreshToken: platformData.refreshToken,
      tokenExpiry: platformData.tokenExpiry,
      isActive: true,
      lastSync: new Date()
    }
  })

  // 重新獲取完整的用戶數據
  const updatedCreator = await prisma.creator.findUnique({
    where: { id: creator.id },
    include: {
      platforms: {
        where: { isActive: true },
        select: {
          platform: true,
          username: true,
          platformId: true
        }
      }
    }
  })

  return {
    id: updatedCreator!.id,
    name: updatedCreator!.name,
    email: updatedCreator!.email || undefined,
    avatar: updatedCreator!.avatar || undefined,
    tier: updatedCreator!.tier,
    isSuperAdmin: updatedCreator!.isSuperAdmin,
    totalPoints: updatedCreator!.totalPoints,
    contentPoints: updatedCreator!.contentPoints,
    referralPoints: updatedCreator!.referralPoints,
    // Game Referral System Fields
    referralLink: updatedCreator!.referralLink || undefined,
    uidHEX: updatedCreator!.uidHEX || undefined,
    referralCount: updatedCreator!.referralCount,
    purchaseAmountTotal: updatedCreator!.purchaseAmountTotal,
    lastReferralSync: updatedCreator!.lastReferralSync || undefined,
    platforms: updatedCreator!.platforms.map(p => ({
      platform: p.platform,
      username: p.username,
      platformId: p.platformId
    }))
  }
}
