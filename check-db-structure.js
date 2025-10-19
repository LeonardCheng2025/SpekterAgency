const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:hpIrKqTjeSbNycBpXRBSlKdlhfMEZTHi@yamabiko.proxy.rlwy.net:40559/railway'
    }
  }
})

async function checkDatabaseStructure() {
  try {
    console.log('🔍 Checking database structure...\n')
    
    // Check creators table
    console.log('📊 CREATORS TABLE:')
    const creators = await prisma.creator.findMany({
      take: 3,
      include: {
        platforms: true,
        contents: {
          take: 2,
          include: {
            metrics: {
              take: 1,
              orderBy: { retrievedAt: 'desc' }
            }
          }
        }
      }
    })
    console.log(`Total creators found: ${creators.length}`)
    creators.forEach(creator => {
      console.log(`- ${creator.name} (${creator.region}) - Platforms: ${creator.platforms.length}, Contents: ${creator.contents.length}`)
      if (creator.contents.length > 0) {
        creator.contents.forEach(content => {
          console.log(`  └ ${content.title} (${content.platform}) - Thumbnail: ${content.thumbnailUrl ? 'YES' : 'NO'}`)
        })
      }
    })
    
    console.log('\n📊 PLATFORM CONNECTIONS:')
    const platformConnections = await prisma.platformConnection.findMany({
      take: 5,
      include: {
        creator: {
          select: { name: true }
        }
      }
    })
    console.log(`Total platform connections: ${platformConnections.length}`)
    platformConnections.forEach(conn => {
      console.log(`- ${conn.creator.name}: ${conn.platform} (${conn.username}) - Active: ${conn.isActive}`)
    })
    
    console.log('\n📊 CONTENT TABLE:')
    const contents = await prisma.content.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        creator: {
          select: { name: true }
        },
        metrics: {
          take: 1,
          orderBy: { retrievedAt: 'desc' }
        }
      }
    })
    console.log(`Total contents found: ${contents.length}`)
    contents.forEach(content => {
      console.log(`- ${content.creator.name}: "${content.title}" (${content.platform})`)
      console.log(`  └ Thumbnail: ${content.thumbnailUrl || 'NULL'}`)
      console.log(`  └ Original URL: ${content.originalUrl || 'NULL'}`)
      console.log(`  └ Validation: ${content.validationStatus}`)
      if (content.metrics.length > 0) {
        console.log(`  └ Views: ${content.metrics[0].views}`)
      }
      console.log('')
    })
    
    console.log('📊 CONTENT METRICS:')
    const metricsCount = await prisma.contentMetrics.count()
    console.log(`Total content metrics records: ${metricsCount}`)
    
    // Check recent submissions
    console.log('\n📊 RECENT SUBMISSIONS (Last 7 days):')
    const recentContents = await prisma.content.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        creator: {
          select: { name: true }
        }
      }
    })
    console.log(`Recent submissions: ${recentContents.length}`)
    recentContents.forEach(content => {
      console.log(`- ${content.createdAt.toISOString()}: ${content.creator.name} - ${content.title}`)
      console.log(`  └ Platform: ${content.platform}, Thumbnail: ${content.thumbnailUrl ? 'YES' : 'NO'}`)
    })
    
  } catch (error) {
    console.error('❌ Error checking database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabaseStructure()

