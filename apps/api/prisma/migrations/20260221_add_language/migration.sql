-- CreateTable: language in master schema
CREATE TABLE "master"."language" (
    "langid" SMALLSERIAL NOT NULL,
    "language" VARCHAR(200) NOT NULL,

    CONSTRAINT "language_pkey" PRIMARY KEY ("langid")
);

-- CreateIndex: unique language name
CREATE UNIQUE INDEX "language_language_key" ON "master"."language"("language");
