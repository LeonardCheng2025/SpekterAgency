const { PrismaClient } = require('@prisma/client');

// Load environment variables
require('dotenv').config();

const prisma = new PrismaClient();

/**
 * 手動更新所有創作者的排行榜分數
 * 
 * 計分公式：
 * - 正規化: norm = (value - min) / (max - min)
 * - 加權計分: 0.3 × (Normalized Referral Count) + 0.7 × (Normalized Purchase Amount)
 * - 內容分數: 每個已提交影片 = 300 分 (直接加分，不正規化)
 * - 最終分數: 正規化分數 × 10000 + 內容分數
 * 
 * 使用方法：
 * node lc手動更新排行榜分數.js
 */

async function updateLeaderboardScores() {
  try {
    console.log('🏆 手動更新排行榜分數系統');
    console.log('═'.repeat(60));
    console.log('📊 計分公式: 0.3 × (推薦數正規化) + 0.7 × (消費金額正規化)');
    console.log('🎬 內容加分: 每個已提交影片 = 300 分 (直接加分)');
    console.log('📏 最終分數: 正規化分數 × 10000 + 內容分數\n');
    
    // Step 1: 獲取所有創作者數據
    console.log('🔍 Step 1: 獲取所有創作者數據...');
    const creators = await prisma.creator.findMany({
      select: {
        id: true,
        name: true,
        region: true,
        referralCount: true,
        purchaseAmountTotal: true,
        leaderboardScore: true, // 當前分數用於比較
        _count: {
          select: {
            contents: true // 計算每個創作者的內容數量
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    console.log(`✅ 找到 ${creators.length} 位創作者\n`);
    
    // Step 2: 計算正規化所需的 min/max 值
    console.log('📐 Step 2: 計算正規化參數...');
    
    const referralCounts = creators.map(c => c.referralCount);
    const purchaseAmounts = creators.map(c => c.purchaseAmountTotal);
    const contentCounts = creators.map(c => c._count.contents);
    
    const referralCountMin = Math.min(...referralCounts);
    const referralCountMax = Math.max(...referralCounts);
    const purchaseAmountMin = Math.min(...purchaseAmounts);
    const purchaseAmountMax = Math.max(...purchaseAmounts);
    
    console.log(`推薦數範圍: ${referralCountMin} - ${referralCountMax}`);
    console.log(`消費金額範圍: $${purchaseAmountMin} - $${purchaseAmountMax}`);
    console.log(`內容數範圍: ${Math.min(...contentCounts)} - ${Math.max(...contentCounts)} (僅用於顯示，不參與正規化)\n`);
    
    // 檢查是否有除零情況
    const referralCountRange = referralCountMax - referralCountMin;
    const purchaseAmountRange = purchaseAmountMax - purchaseAmountMin;
    
    if (referralCountRange === 0) {
      console.log('⚠️  警告: 所有創作者推薦數相同，推薦數權重將設為 0');
    }
    if (purchaseAmountRange === 0) {
      console.log('⚠️  警告: 所有創作者消費金額相同，消費金額權重將設為 0');
    }
    
    // Step 3: 計算每位創作者的新分數
    console.log('⚖️  Step 3: 計算新的排行榜分數...');
    
    const scoredCreators = creators.map(creator => {
      // 正規化推薦數 (處理除零情況)
      let normalizedReferralCount = 0;
      if (referralCountRange > 0) {
        normalizedReferralCount = (creator.referralCount - referralCountMin) / referralCountRange;
      }
      
      // 正規化消費金額 (處理除零情況)
      let normalizedPurchaseAmount = 0;
      if (purchaseAmountRange > 0) {
        normalizedPurchaseAmount = (creator.purchaseAmountTotal - purchaseAmountMin) / purchaseAmountRange;
      }
      
      // 計算加權正規化分數 (回到原始權重)
      const normalizedScore = (0.3 * normalizedReferralCount) + (0.7 * normalizedPurchaseAmount);
      
      // 內容分數：每個影片 300 分
      const contentScore = creator._count.contents * 300;
      
      // 最終分數：正規化分數 × 10000 + 內容分數
      const newLeaderboardScore = Math.round(normalizedScore * 10000) + contentScore;
      
      return {
        ...creator,
        contentCount: creator._count.contents,
        normalizedReferralCount,
        normalizedPurchaseAmount,
        normalizedScore,
        contentScore,
        newLeaderboardScore,
        scoreChange: newLeaderboardScore - creator.leaderboardScore
      };
    });
    
    // 按新分數排序顯示前 10 名
    const topCreators = [...scoredCreators].sort((a, b) => b.newLeaderboardScore - a.newLeaderboardScore);
    
    console.log('🏆 前 10 名新排行榜分數:');
    topCreators.slice(0, 10).forEach((creator, index) => {
      const changeIndicator = creator.scoreChange > 0 ? '↑' : creator.scoreChange < 0 ? '↓' : '→';
      console.log(`   ${index + 1}. ${creator.name} (${creator.region})`);
      console.log(`      推薦數: ${creator.referralCount} (正規化: ${creator.normalizedReferralCount.toFixed(3)})`);
      console.log(`      消費額: $${creator.purchaseAmountTotal} (正規化: ${creator.normalizedPurchaseAmount.toFixed(3)})`);
      console.log(`      內容數: ${creator.contentCount} 個`);
      console.log(`      內容分數: ${creator.contentScore} (${creator.contentCount} × 300)`);
      console.log(`      新分數: ${creator.newLeaderboardScore} ${changeIndicator} (原: ${creator.leaderboardScore})`);
      console.log('');
    });
    
    console.log('─'.repeat(60));
    
    // Step 4: 更新數據庫
    console.log('💾 Step 4: 更新數據庫中的排行榜分數...');
    
    let updateCount = 0;
    let changedCount = 0;
    
    for (const creator of scoredCreators) {
      try {
        await prisma.creator.update({
          where: { id: creator.id },
          data: {
            leaderboardScore: creator.newLeaderboardScore
          }
        });
        
        updateCount++;
        if (creator.scoreChange !== 0) {
          changedCount++;
        }
      } catch (error) {
        console.error(`❌ 更新 ${creator.name} 時發生錯誤:`, error.message);
      }
    }
    
    console.log(`✅ 成功更新 ${updateCount}/${creators.length} 位創作者`);
    console.log(`📈 其中 ${changedCount} 位創作者分數有變化\n`);
    
    // Step 5: 最終統計
    console.log('📊 Step 5: 更新後統計資訊...');
    
    const allNewScores = scoredCreators.map(c => c.newLeaderboardScore);
    const avgScore = (allNewScores.reduce((sum, score) => sum + score, 0) / allNewScores.length).toFixed(0);
    const maxScore = Math.max(...allNewScores);
    const minScore = Math.min(...allNewScores);
    const scoresAboveZero = allNewScores.filter(score => score > 0).length;
    
    console.log(`平均分數: ${avgScore}`);
    console.log(`最高分數: ${maxScore}`);
    console.log(`最低分數: ${minScore}`);
    console.log(`有分數創作者: ${scoresAboveZero}/${creators.length} (${((scoresAboveZero/creators.length)*100).toFixed(1)}%)`);
    
    // 顯示分數變化最大的創作者
    const biggestChanges = [...scoredCreators]
      .filter(c => c.scoreChange !== 0)
      .sort((a, b) => Math.abs(b.scoreChange) - Math.abs(a.scoreChange))
      .slice(0, 5);
    
    if (biggestChanges.length > 0) {
      console.log('\n📈 分數變化最大的創作者:');
      biggestChanges.forEach((creator, index) => {
        const changeType = creator.scoreChange > 0 ? '增加' : '減少';
        console.log(`   ${index + 1}. ${creator.name}: ${changeType} ${Math.abs(creator.scoreChange)} 分`);
      });
    }
    
    console.log('\n🎯 排行榜分數更新完成！');
    console.log(`📅 更新時間: ${new Date().toLocaleString('zh-TW')}`);
    console.log('💡 提示: 可隨時重新運行此腳本來更新分數');
    
  } catch (error) {
    console.error('❌ 更新排行榜分數時發生錯誤:', error.message);
    console.error('請檢查數據庫連接和環境變數設定');
  } finally {
    await prisma.$disconnect();
  }
}

// 執行更新
if (require.main === module) {
  updateLeaderboardScores();
}

module.exports = { updateLeaderboardScores };
