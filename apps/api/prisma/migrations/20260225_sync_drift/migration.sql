-- DropForeignKey
ALTER TABLE "public"."bid" DROP CONSTRAINT "bid_requirid_fkey";

-- DropForeignKey
ALTER TABLE "public"."bid_agree" DROP CONSTRAINT "bid_agree_bidid_fkey";

-- DropIndex
DROP INDEX "public"."bid_agree_bidid_key";

-- AlterTable
ALTER TABLE "public"."requirements" ALTER COLUMN "requirements" SET DATA TYPE VARCHAR,
ALTER COLUMN "eligibility" SET DATA TYPE VARCHAR,
ALTER COLUMN "doc_url" SET DATA TYPE VARCHAR,
ALTER COLUMN "audio_url" SET DATA TYPE VARCHAR,
ALTER COLUMN "video_url" SET DATA TYPE VARCHAR,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."offerings" ALTER COLUMN "offerings" SET DATA TYPE VARCHAR,
ALTER COLUMN "doc_url" SET DATA TYPE VARCHAR,
ALTER COLUMN "audio_url" SET DATA TYPE VARCHAR,
ALTER COLUMN "video_url" SET DATA TYPE VARCHAR,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."bid" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."bid_agree" ALTER COLUMN "agreement" SET DATA TYPE VARCHAR,
ALTER COLUMN "client_sign" SET DATA TYPE VARCHAR,
ALTER COLUMN "provider_sign" SET DATA TYPE VARCHAR,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "idx_requirements_marketed" ON "public"."requirements"("marketed" ASC);

-- CreateIndex
CREATE INDEX "idx_requirements_userid" ON "public"."requirements"("userid" ASC);

-- CreateIndex
CREATE INDEX "idx_offerings_marketed" ON "public"."offerings"("marketed" ASC);

-- CreateIndex
CREATE INDEX "idx_offerings_userid" ON "public"."offerings"("userid" ASC);

-- CreateIndex
CREATE INDEX "idx_bid_requirid" ON "public"."bid"("requirid" ASC);

-- CreateIndex
CREATE INDEX "idx_bid_userid" ON "public"."bid"("userid" ASC);

-- CreateIndex
CREATE INDEX "idx_bid_agree_bidid" ON "public"."bid_agree"("bidid" ASC);

-- AddForeignKey
ALTER TABLE "public"."bid" ADD CONSTRAINT "fk_bid_requirement" FOREIGN KEY ("requirid") REFERENCES "public"."requirements"("requirid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bid_agree" ADD CONSTRAINT "fk_bid_agree_bid" FOREIGN KEY ("bidid") REFERENCES "public"."bid"("bidid") ON DELETE NO ACTION ON UPDATE NO ACTION;

