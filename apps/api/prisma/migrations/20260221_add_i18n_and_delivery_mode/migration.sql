-- CreateEnum
CREATE TYPE "master"."DeliveryMode" AS ENUM ('PHYSICAL', 'DIGITAL', 'PHYGITAL');

-- AlterTable: Sector
ALTER TABLE "master"."sector" ADD COLUMN "code" VARCHAR(50);
ALTER TABLE "master"."sector" ADD COLUMN "sort_order" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "master"."sector" ADD COLUMN "is_active" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "master"."sector" ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "master"."sector" ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "master"."sector" SET "code" = UPPER(REPLACE(REPLACE(TRIM("sector"), ' ', '_'), '&', 'AND')) || '_' || "sectorid";

ALTER TABLE "master"."sector" ALTER COLUMN "code" SET NOT NULL;
CREATE UNIQUE INDEX "sector_code_key" ON "master"."sector"("code");

-- AlterTable: Field
ALTER TABLE "master"."field" ADD COLUMN "code" VARCHAR(50);
ALTER TABLE "master"."field" ADD COLUMN "sort_order" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "master"."field" ADD COLUMN "is_active" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "master"."field" ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "master"."field" ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "master"."field" SET "code" = UPPER(REPLACE(REPLACE(TRIM("field"), ' ', '_'), '&', 'AND')) || '_' || "fieldid";

ALTER TABLE "master"."field" ALTER COLUMN "code" SET NOT NULL;
CREATE UNIQUE INDEX "field_code_key" ON "master"."field"("code");

-- AlterTable: Market
ALTER TABLE "master"."market" ADD COLUMN "code" VARCHAR(50);
ALTER TABLE "master"."market" ADD COLUMN "delivery_mode" "master"."DeliveryMode" NOT NULL DEFAULT 'PHYSICAL';
ALTER TABLE "master"."market" ADD COLUMN "sort_order" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "master"."market" ADD COLUMN "is_active" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "master"."market" ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "master"."market" ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "master"."market" SET "code" = UPPER(REPLACE(REPLACE(TRIM("item"), ' ', '_'), '&', 'AND')) || '_' || "marketid";

ALTER TABLE "master"."market" ALTER COLUMN "code" SET NOT NULL;
CREATE UNIQUE INDEX "market_code_key" ON "master"."market"("code");
CREATE INDEX "market_code_idx" ON "master"."market"("code");

-- CreateTable: SectorI18n
CREATE TABLE "master"."sector_i18n" (
    "id" SERIAL NOT NULL,
    "sectorid" INTEGER NOT NULL,
    "locale" VARCHAR(10) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" VARCHAR(500),
    "is_fallback" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "sector_i18n_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "sector_i18n_sectorid_locale_key" ON "master"."sector_i18n"("sectorid", "locale");
CREATE INDEX "sector_i18n_sectorid_idx" ON "master"."sector_i18n"("sectorid");
CREATE INDEX "sector_i18n_locale_idx" ON "master"."sector_i18n"("locale");
ALTER TABLE "master"."sector_i18n" ADD CONSTRAINT "sector_i18n_sectorid_fkey" FOREIGN KEY ("sectorid") REFERENCES "master"."sector"("sectorid") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: FieldI18n
CREATE TABLE "master"."field_i18n" (
    "id" SERIAL NOT NULL,
    "fieldid" INTEGER NOT NULL,
    "locale" VARCHAR(10) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" VARCHAR(500),
    "is_fallback" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "field_i18n_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "field_i18n_fieldid_locale_key" ON "master"."field_i18n"("fieldid", "locale");
CREATE INDEX "field_i18n_fieldid_idx" ON "master"."field_i18n"("fieldid");
CREATE INDEX "field_i18n_locale_idx" ON "master"."field_i18n"("locale");
ALTER TABLE "master"."field_i18n" ADD CONSTRAINT "field_i18n_fieldid_fkey" FOREIGN KEY ("fieldid") REFERENCES "master"."field"("fieldid") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: MarketI18n
CREATE TABLE "master"."market_i18n" (
    "id" SERIAL NOT NULL,
    "marketid" BIGINT NOT NULL,
    "locale" VARCHAR(10) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" VARCHAR(500),
    "is_fallback" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "market_i18n_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "market_i18n_marketid_locale_key" ON "master"."market_i18n"("marketid", "locale");
CREATE INDEX "market_i18n_marketid_idx" ON "master"."market_i18n"("marketid");
CREATE INDEX "market_i18n_locale_idx" ON "master"."market_i18n"("locale");
ALTER TABLE "master"."market_i18n" ADD CONSTRAINT "market_i18n_marketid_fkey" FOREIGN KEY ("marketid") REFERENCES "master"."market"("marketid") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed en-in fallback rows into i18n tables
INSERT INTO "master"."sector_i18n" ("sectorid", "locale", "name", "is_fallback")
SELECT "sectorid", 'en-in', "sector", true FROM "master"."sector";

INSERT INTO "master"."field_i18n" ("fieldid", "locale", "name", "is_fallback")
SELECT "fieldid", 'en-in', "field", true FROM "master"."field";

INSERT INTO "master"."market_i18n" ("marketid", "locale", "name", "is_fallback")
SELECT "marketid", 'en-in', "item", true FROM "master"."market";
