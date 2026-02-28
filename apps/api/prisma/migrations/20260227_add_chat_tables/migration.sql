-- Saubh.Tech Chat Tables Migration
-- Date: 2026-02-27
-- Safe: No DROP statements

-- CreateEnum
CREATE TYPE "ChatRoomType" AS ENUM ('DM', 'GROUP');
CREATE TYPE "ChatMessageType" AS ENUM ('TEXT', 'VOICE');

-- CreateTable: chat_room
CREATE TABLE "chat_room" (
    "id" BIGSERIAL NOT NULL,
    "type" "ChatRoomType" NOT NULL DEFAULT 'DM',
    "title" VARCHAR(200),
    "created_by" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_room_pkey" PRIMARY KEY ("id")
);

-- CreateTable: chat_room_member
CREATE TABLE "chat_room_member" (
    "room_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "role" VARCHAR(20) NOT NULL DEFAULT 'member',
    "preferred_lang" VARCHAR(10) NOT NULL DEFAULT 'hi',
    "is_muted" BOOLEAN NOT NULL DEFAULT false,
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_room_member_pkey" PRIMARY KEY ("room_id","user_id")
);

-- CreateTable: chat_room_map
CREATE TABLE "chat_room_map" (
    "room_id" BIGINT NOT NULL,
    "matrix_room_id" VARCHAR(255) NOT NULL,
    "livekit_room" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_room_map_pkey" PRIMARY KEY ("room_id")
);

-- CreateTable: chat_enrichment
CREATE TABLE "chat_enrichment" (
    "id" BIGSERIAL NOT NULL,
    "room_id" BIGINT NOT NULL,
    "matrix_event_id" VARCHAR(255) NOT NULL,
    "message_type" "ChatMessageType" NOT NULL,
    "original_lang" VARCHAR(10),
    "transcript_text" TEXT,
    "transcript_confidence" DOUBLE PRECISION,
    "original_media_url" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_enrichment_pkey" PRIMARY KEY ("id")
);

-- CreateTable: chat_translation
CREATE TABLE "chat_translation" (
    "enrichment_id" BIGINT NOT NULL,
    "target_lang" VARCHAR(10) NOT NULL,
    "translated_text" TEXT NOT NULL,
    "engine" VARCHAR(50) NOT NULL,
    "quality_score" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_translation_pkey" PRIMARY KEY ("enrichment_id","target_lang")
);

-- CreateTable: chat_tts
CREATE TABLE "chat_tts" (
    "enrichment_id" BIGINT NOT NULL,
    "target_lang" VARCHAR(10) NOT NULL,
    "tts_audio_url" VARCHAR(500) NOT NULL,
    "voice_name" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_tts_pkey" PRIMARY KEY ("enrichment_id","target_lang")
);

-- CreateTable: chat_report
CREATE TABLE "chat_report" (
    "id" BIGSERIAL NOT NULL,
    "room_id" BIGINT NOT NULL,
    "matrix_event_id" VARCHAR(255) NOT NULL,
    "reporter_user_id" BIGINT NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_report_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE INDEX "chat_room_member_user_id_idx" ON "chat_room_member"("user_id");
CREATE UNIQUE INDEX "chat_room_map_matrix_room_id_key" ON "chat_room_map"("matrix_room_id");
CREATE UNIQUE INDEX "chat_room_map_livekit_room_key" ON "chat_room_map"("livekit_room");
CREATE UNIQUE INDEX "chat_enrichment_matrix_event_id_key" ON "chat_enrichment"("matrix_event_id");
CREATE INDEX "chat_enrichment_room_id_created_at_idx" ON "chat_enrichment"("room_id", "created_at" DESC);
CREATE INDEX "chat_report_room_id_created_at_idx" ON "chat_report"("room_id", "created_at" DESC);

-- Foreign Keys
ALTER TABLE "chat_room_member" ADD CONSTRAINT "chat_room_member_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "chat_room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "chat_room_member" ADD CONSTRAINT "chat_room_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("userid") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "chat_room_map" ADD CONSTRAINT "chat_room_map_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "chat_room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "chat_enrichment" ADD CONSTRAINT "chat_enrichment_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "chat_room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "chat_translation" ADD CONSTRAINT "chat_translation_enrichment_id_fkey" FOREIGN KEY ("enrichment_id") REFERENCES "chat_enrichment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "chat_tts" ADD CONSTRAINT "chat_tts_enrichment_id_fkey" FOREIGN KEY ("enrichment_id") REFERENCES "chat_enrichment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "chat_report" ADD CONSTRAINT "chat_report_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "chat_room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
