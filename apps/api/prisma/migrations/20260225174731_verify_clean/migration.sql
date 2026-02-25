/*
  Warnings:

  - A unique constraint covering the columns `[bidid]` on the table `bid_agree` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "bid" DROP CONSTRAINT "fk_bid_requirement";

-- DropForeignKey
ALTER TABLE "bid_agree" DROP CONSTRAINT "fk_bid_agree_bid";

-- DropIndex
DROP INDEX "idx_bid_requirid";

-- DropIndex
DROP INDEX "idx_bid_userid";

-- DropIndex
DROP INDEX "idx_bid_agree_bidid";

-- DropIndex
DROP INDEX "idx_offerings_marketed";

-- DropIndex
DROP INDEX "idx_offerings_userid";

-- DropIndex
DROP INDEX "idx_requirements_marketed";

-- DropIndex
DROP INDEX "idx_requirements_userid";

-- AlterTable
ALTER TABLE "bid" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "bid_agree" ALTER COLUMN "agreement" SET DATA TYPE TEXT,
ALTER COLUMN "client_sign" SET DATA TYPE TEXT,
ALTER COLUMN "provider_sign" SET DATA TYPE TEXT,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "offerings" ALTER COLUMN "offerings" SET DATA TYPE TEXT,
ALTER COLUMN "doc_url" SET DATA TYPE TEXT,
ALTER COLUMN "audio_url" SET DATA TYPE TEXT,
ALTER COLUMN "video_url" SET DATA TYPE TEXT,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "requirements" ALTER COLUMN "requirements" SET DATA TYPE TEXT,
ALTER COLUMN "eligibility" SET DATA TYPE TEXT,
ALTER COLUMN "doc_url" SET DATA TYPE TEXT,
ALTER COLUMN "audio_url" SET DATA TYPE TEXT,
ALTER COLUMN "video_url" SET DATA TYPE TEXT,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "bid_agree_bidid_key" ON "bid_agree"("bidid");

-- AddForeignKey
ALTER TABLE "bid" ADD CONSTRAINT "bid_requirid_fkey" FOREIGN KEY ("requirid") REFERENCES "requirements"("requirid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bid_agree" ADD CONSTRAINT "bid_agree_bidid_fkey" FOREIGN KEY ("bidid") REFERENCES "bid"("bidid") ON DELETE RESTRICT ON UPDATE CASCADE;
