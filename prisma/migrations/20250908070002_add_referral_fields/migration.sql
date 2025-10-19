-- AlterTable
ALTER TABLE "public"."creators" ADD COLUMN     "lastReferralSync" TIMESTAMP(3),
ADD COLUMN     "purchaseAmountTotal" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "referralCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "referralLink" TEXT,
ADD COLUMN     "uidHEX" TEXT;
