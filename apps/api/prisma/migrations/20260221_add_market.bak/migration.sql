-- CreateTable: market in master schema
CREATE TABLE "master"."market" (
    "marketid" BIGSERIAL NOT NULL,
    "sectorid" INTEGER NOT NULL,
    "fieldid" INTEGER NOT NULL,
    "p_s_ps" CHAR(2) NOT NULL,
    "item" VARCHAR(200) NOT NULL,

    CONSTRAINT "market_pkey" PRIMARY KEY ("marketid")
);

-- CreateIndexes
CREATE INDEX "market_sectorid_idx" ON "master"."market"("sectorid");
CREATE INDEX "market_fieldid_idx" ON "master"."market"("fieldid");
CREATE INDEX "market_p_s_ps_idx" ON "master"."market"("p_s_ps");

-- AddForeignKeys
ALTER TABLE "master"."market" ADD CONSTRAINT "market_sectorid_fkey" FOREIGN KEY ("sectorid") REFERENCES "master"."sector"("sectorid") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "master"."market" ADD CONSTRAINT "market_fieldid_fkey" FOREIGN KEY ("fieldid") REFERENCES "master"."field"("fieldid") ON DELETE CASCADE ON UPDATE CASCADE;
