-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "crm";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "master";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "master"."DeliveryMode" AS ENUM ('PHYSICAL', 'DIGITAL', 'PHYGITAL');

-- CreateEnum
CREATE TYPE "public"."CallDirection" AS ENUM ('INBOUND', 'OUTBOUND');

-- CreateEnum
CREATE TYPE "public"."CallStatus" AS ENUM ('INITIATED', 'RINGING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'BUSY', 'NO_ANSWER', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."ConversationType" AS ENUM ('DM', 'GROUP', 'BROADCAST');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('M', 'F', 'T', 'O');

-- CreateEnum
CREATE TYPE "public"."MemberRole" AS ENUM ('ADMIN', 'MEMBER', 'OBSERVER');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'VIEWER');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('A', 'S', 'B', 'D');

-- CreateEnum
CREATE TYPE "public"."VerifiedType" AS ENUM ('D', 'P', 'PD');

-- CreateTable
CREATE TABLE "crm"."bot_config" (
    "id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT false,
    "system_prompt" TEXT,
    "handoff_keywords" TEXT[] DEFAULT ARRAY['agent', 'human', 'help', 'support', 'talk']::TEXT[],
    "greeting_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bot_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm"."wa_broadcast" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "channel_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "scheduled_at" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),
    "status" VARCHAR(10) NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wa_broadcast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm"."wa_broadcast_recipient" (
    "id" TEXT NOT NULL,
    "broadcast_id" TEXT NOT NULL,
    "contact_id" TEXT NOT NULL,
    "status" VARCHAR(10) NOT NULL DEFAULT 'PENDING',
    "sent_at" TIMESTAMP(3),

    CONSTRAINT "wa_broadcast_recipient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm"."wa_channel" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "type" VARCHAR(10) NOT NULL,
    "instance_name" VARCHAR(100),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "default_bot_enabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "wa_channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm"."wa_contact" (
    "id" TEXT NOT NULL,
    "whatsapp" VARCHAR(20) NOT NULL,
    "name" VARCHAR(200),
    "user_id" BIGINT,
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "opted_out" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wa_contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm"."wa_conversation" (
    "id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "contact_id" TEXT NOT NULL,
    "status" VARCHAR(10) NOT NULL DEFAULT 'OPEN',
    "assigned_to" BIGINT,
    "is_bot" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wa_conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm"."wa_message" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "direction" VARCHAR(3) NOT NULL,
    "body" TEXT,
    "media_url" TEXT,
    "media_type" VARCHAR(50),
    "status" VARCHAR(10) NOT NULL DEFAULT 'SENT',
    "external_id" TEXT,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wa_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm"."wa_template" (
    "id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "category" VARCHAR(20) NOT NULL,
    "language" VARCHAR(10) NOT NULL DEFAULT 'en',
    "status" VARCHAR(10) NOT NULL DEFAULT 'PENDING',
    "body" TEXT NOT NULL,
    "header" TEXT,
    "footer" TEXT,
    "variables" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "meta_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wa_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master"."area" (
    "areaid" SERIAL NOT NULL,
    "area" VARCHAR(200) NOT NULL,
    "localityid" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "area_agency" BIGINT,

    CONSTRAINT "area_pkey" PRIMARY KEY ("areaid")
);

-- CreateTable
CREATE TABLE "master"."country" (
    "country_code" CHAR(2) NOT NULL,
    "country" VARCHAR(100) NOT NULL,
    "iso3" CHAR(3) NOT NULL,
    "isd" VARCHAR(10) NOT NULL,
    "flag" VARCHAR(8) NOT NULL,

    CONSTRAINT "country_pkey" PRIMARY KEY ("country_code")
);

-- CreateTable
CREATE TABLE "master"."district" (
    "districtid" SERIAL NOT NULL,
    "district" VARCHAR(100) NOT NULL,
    "stateid" INTEGER NOT NULL,
    "country_code" CHAR(2) NOT NULL,

    CONSTRAINT "district_pkey" PRIMARY KEY ("districtid")
);

-- CreateTable
CREATE TABLE "master"."division" (
    "divisionid" SERIAL NOT NULL,
    "division" VARCHAR(200) NOT NULL,
    "areaid" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "division_agency" BIGINT,

    CONSTRAINT "division_pkey" PRIMARY KEY ("divisionid")
);

-- CreateTable
CREATE TABLE "master"."field" (
    "fieldid" SERIAL NOT NULL,
    "field" VARCHAR(200) NOT NULL,
    "sectorid" INTEGER NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "field_pkey" PRIMARY KEY ("fieldid")
);

-- CreateTable
CREATE TABLE "master"."field_i18n" (
    "id" SERIAL NOT NULL,
    "fieldid" INTEGER NOT NULL,
    "locale" VARCHAR(10) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" VARCHAR(500),
    "is_fallback" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "field_i18n_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master"."language" (
    "langid" SMALLSERIAL NOT NULL,
    "language" VARCHAR(200) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_rtl" BOOLEAN NOT NULL DEFAULT false,
    "locale" VARCHAR(10) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "language_pkey" PRIMARY KEY ("langid")
);

-- CreateTable
CREATE TABLE "master"."locality" (
    "localityid" SERIAL NOT NULL,
    "locality" VARCHAR(200) NOT NULL,
    "placeid" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "local_agency" BIGINT,

    CONSTRAINT "locality_pkey" PRIMARY KEY ("localityid")
);

-- CreateTable
CREATE TABLE "master"."market" (
    "marketid" BIGSERIAL NOT NULL,
    "sectorid" INTEGER NOT NULL,
    "fieldid" INTEGER NOT NULL,
    "p_s_ps" CHAR(2) NOT NULL,
    "item" VARCHAR(200) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "delivery_mode" "master"."DeliveryMode" NOT NULL DEFAULT 'PHYSICAL',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "market_pkey" PRIMARY KEY ("marketid")
);

-- CreateTable
CREATE TABLE "master"."market_i18n" (
    "id" SERIAL NOT NULL,
    "marketid" BIGINT NOT NULL,
    "locale" VARCHAR(10) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" VARCHAR(500),
    "is_fallback" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "market_i18n_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master"."place" (
    "placeid" BIGSERIAL NOT NULL,
    "country_code" CHAR(2) NOT NULL,
    "stateid" INTEGER NOT NULL,
    "districtid" INTEGER NOT NULL,
    "pincode" VARCHAR(10) NOT NULL,
    "place" VARCHAR(200) NOT NULL,
    "userid" BIGINT,

    CONSTRAINT "place_pkey" PRIMARY KEY ("placeid")
);

-- CreateTable
CREATE TABLE "master"."postal" (
    "postid" SERIAL NOT NULL,
    "pincode" VARCHAR(10) NOT NULL,
    "postoffice" VARCHAR(150) NOT NULL,
    "districtid" INTEGER NOT NULL,
    "stateid" INTEGER NOT NULL,
    "country_code" CHAR(2) NOT NULL,

    CONSTRAINT "postal_pkey" PRIMARY KEY ("postid")
);

-- CreateTable
CREATE TABLE "master"."region" (
    "regionid" SERIAL NOT NULL,
    "region" VARCHAR(200) NOT NULL,
    "divisionid" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "region_agency" BIGINT,

    CONSTRAINT "region_pkey" PRIMARY KEY ("regionid")
);

-- CreateTable
CREATE TABLE "master"."sector" (
    "sectorid" SERIAL NOT NULL,
    "sector" VARCHAR(200) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sector_pkey" PRIMARY KEY ("sectorid")
);

-- CreateTable
CREATE TABLE "master"."sector_i18n" (
    "id" SERIAL NOT NULL,
    "sectorid" INTEGER NOT NULL,
    "locale" VARCHAR(10) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" VARCHAR(500),
    "is_fallback" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sector_i18n_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master"."state" (
    "stateid" SERIAL NOT NULL,
    "state" VARCHAR(100) NOT NULL,
    "state_code" CHAR(2) NOT NULL,
    "country_code" CHAR(2) NOT NULL,
    "region" VARCHAR(100),

    CONSTRAINT "state_pkey" PRIMARY KEY ("stateid")
);

-- CreateTable
CREATE TABLE "master"."zone" (
    "zoneid" SERIAL NOT NULL,
    "zone_code" CHAR(2) NOT NULL,
    "zone" VARCHAR(200) NOT NULL,
    "regionid" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "zone_agency" BIGINT,

    CONSTRAINT "zone_pkey" PRIMARY KEY ("zoneid")
);

-- CreateTable
CREATE TABLE "public"."Business" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Client" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Conversation" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "clientId" TEXT,
    "type" "public"."ConversationType" NOT NULL DEFAULT 'DM',
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ConversationMember" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "role" "public"."MemberRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "sender_id" BIGINT NOT NULL,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MessageAttachment" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "objectKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TelephonyCall" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "clientId" TEXT,
    "direction" "public"."CallDirection" NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "status" "public"."CallStatus" NOT NULL DEFAULT 'INITIATED',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "providerCallId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TelephonyCall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TelephonyEvent" (
    "id" TEXT NOT NULL,
    "callId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TelephonyEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TelephonyNumber" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "clientId" TEXT,
    "provider" TEXT NOT NULL,
    "providerNumberId" TEXT NOT NULL,
    "e164" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TelephonyNumber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserMembership" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "businessId" TEXT NOT NULL,
    "clientId" TEXT,
    "role" "public"."UserRole" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bid" (
    "bidid" BIGSERIAL NOT NULL,
    "requirid" BIGINT NOT NULL,
    "userid" BIGINT NOT NULL,
    "amount" DECIMAL(10,2),
    "escrow" DECIMAL(10,2),
    "selected" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bid_pkey" PRIMARY KEY ("bidid")
);

-- CreateTable
CREATE TABLE "public"."bid_agree" (
    "agreeid" BIGSERIAL NOT NULL,
    "bidid" BIGINT NOT NULL,
    "agreement" VARCHAR,
    "client_sign" VARCHAR,
    "provider_sign" VARCHAR,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bid_agree_pkey" PRIMARY KEY ("agreeid")
);

-- CreateTable
CREATE TABLE "public"."offerings" (
    "offerid" BIGSERIAL NOT NULL,
    "userid" BIGINT NOT NULL,
    "marketid" INTEGER NOT NULL,
    "delivery_mode" CHAR(2),
    "offerings" VARCHAR,
    "doc_url" VARCHAR,
    "audio_url" VARCHAR,
    "video_url" VARCHAR,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "offerings_pkey" PRIMARY KEY ("offerid")
);

-- CreateTable
CREATE TABLE "public"."requirements" (
    "requirid" BIGSERIAL NOT NULL,
    "userid" BIGINT NOT NULL,
    "marketid" INTEGER NOT NULL,
    "delivery_mode" CHAR(2),
    "requirements" VARCHAR,
    "eligibility" VARCHAR,
    "doc_url" VARCHAR,
    "audio_url" VARCHAR,
    "video_url" VARCHAR,
    "budget" DECIMAL(10,2),
    "escrow" DECIMAL(10,2),
    "bidate" DATE,
    "delivdate" DATE,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "requirements_pkey" PRIMARY KEY ("requirid")
);

-- CreateTable
CREATE TABLE "public"."user" (
    "userid" BIGSERIAL NOT NULL,
    "whatsapp" VARCHAR(20) NOT NULL,
    "passcode" VARCHAR(4),
    "fname" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "pic" VARCHAR(500),
    "gender" "public"."Gender",
    "dob" DATE,
    "langid" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "qualification" VARCHAR(200),
    "experience" VARCHAR(200),
    "country_code" CHAR(2),
    "stateid" INTEGER,
    "districtid" INTEGER,
    "pincode" VARCHAR(10),
    "placeid" INTEGER,
    "verified" "public"."VerifiedType",
    "status" "public"."UserStatus" NOT NULL DEFAULT 'A',
    "reason" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lname" VARCHAR(100),
    "passcode_expiry" TIMESTAMP(3),
    "usertype" VARCHAR(2) NOT NULL DEFAULT 'GW',
    "place_request" VARCHAR(200),

    CONSTRAINT "user_pkey" PRIMARY KEY ("userid")
);

-- CreateIndex
CREATE UNIQUE INDEX "bot_config_channel_id_key" ON "crm"."bot_config"("channel_id" ASC);

-- CreateIndex
CREATE INDEX "wa_broadcast_channel_id_idx" ON "crm"."wa_broadcast"("channel_id" ASC);

-- CreateIndex
CREATE INDEX "wa_broadcast_status_idx" ON "crm"."wa_broadcast"("status" ASC);

-- CreateIndex
CREATE INDEX "wa_broadcast_recipient_broadcast_id_idx" ON "crm"."wa_broadcast_recipient"("broadcast_id" ASC);

-- CreateIndex
CREATE INDEX "wa_broadcast_recipient_contact_id_idx" ON "crm"."wa_broadcast_recipient"("contact_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "wa_channel_phone_key" ON "crm"."wa_channel"("phone" ASC);

-- CreateIndex
CREATE INDEX "wa_contact_user_id_idx" ON "crm"."wa_contact"("user_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "wa_contact_whatsapp_key" ON "crm"."wa_contact"("whatsapp" ASC);

-- CreateIndex
CREATE INDEX "wa_conversation_assigned_to_idx" ON "crm"."wa_conversation"("assigned_to" ASC);

-- CreateIndex
CREATE INDEX "wa_conversation_channel_id_idx" ON "crm"."wa_conversation"("channel_id" ASC);

-- CreateIndex
CREATE INDEX "wa_conversation_contact_id_idx" ON "crm"."wa_conversation"("contact_id" ASC);

-- CreateIndex
CREATE INDEX "wa_conversation_status_idx" ON "crm"."wa_conversation"("status" ASC);

-- CreateIndex
CREATE INDEX "wa_message_conversation_id_idx" ON "crm"."wa_message"("conversation_id" ASC);

-- CreateIndex
CREATE INDEX "wa_message_sent_at_idx" ON "crm"."wa_message"("sent_at" ASC);

-- CreateIndex
CREATE INDEX "wa_template_channel_id_idx" ON "crm"."wa_template"("channel_id" ASC);

-- CreateIndex
CREATE INDEX "wa_template_status_idx" ON "crm"."wa_template"("status" ASC);

-- CreateIndex
CREATE INDEX "district_country_code_idx" ON "master"."district"("country_code" ASC);

-- CreateIndex
CREATE INDEX "district_stateid_idx" ON "master"."district"("stateid" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "field_code_key" ON "master"."field"("code" ASC);

-- CreateIndex
CREATE INDEX "field_sectorid_idx" ON "master"."field"("sectorid" ASC);

-- CreateIndex
CREATE INDEX "field_i18n_fieldid_idx" ON "master"."field_i18n"("fieldid" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "field_i18n_fieldid_locale_key" ON "master"."field_i18n"("fieldid" ASC, "locale" ASC);

-- CreateIndex
CREATE INDEX "field_i18n_locale_idx" ON "master"."field_i18n"("locale" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "language_language_key" ON "master"."language"("language" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "language_locale_key" ON "master"."language"("locale" ASC);

-- CreateIndex
CREATE INDEX "market_code_idx" ON "master"."market"("code" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "market_code_key" ON "master"."market"("code" ASC);

-- CreateIndex
CREATE INDEX "market_fieldid_idx" ON "master"."market"("fieldid" ASC);

-- CreateIndex
CREATE INDEX "market_p_s_ps_idx" ON "master"."market"("p_s_ps" ASC);

-- CreateIndex
CREATE INDEX "market_sectorid_idx" ON "master"."market"("sectorid" ASC);

-- CreateIndex
CREATE INDEX "market_i18n_locale_idx" ON "master"."market_i18n"("locale" ASC);

-- CreateIndex
CREATE INDEX "market_i18n_marketid_idx" ON "master"."market_i18n"("marketid" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "market_i18n_marketid_locale_key" ON "master"."market_i18n"("marketid" ASC, "locale" ASC);

-- CreateIndex
CREATE INDEX "place_country_code_idx" ON "master"."place"("country_code" ASC);

-- CreateIndex
CREATE INDEX "place_districtid_idx" ON "master"."place"("districtid" ASC);

-- CreateIndex
CREATE INDEX "place_pincode_idx" ON "master"."place"("pincode" ASC);

-- CreateIndex
CREATE INDEX "place_stateid_idx" ON "master"."place"("stateid" ASC);

-- CreateIndex
CREATE INDEX "postal_country_code_idx" ON "master"."postal"("country_code" ASC);

-- CreateIndex
CREATE INDEX "postal_districtid_idx" ON "master"."postal"("districtid" ASC);

-- CreateIndex
CREATE INDEX "postal_pincode_idx" ON "master"."postal"("pincode" ASC);

-- CreateIndex
CREATE INDEX "postal_stateid_idx" ON "master"."postal"("stateid" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "sector_code_key" ON "master"."sector"("code" ASC);

-- CreateIndex
CREATE INDEX "sector_i18n_locale_idx" ON "master"."sector_i18n"("locale" ASC);

-- CreateIndex
CREATE INDEX "sector_i18n_sectorid_idx" ON "master"."sector_i18n"("sectorid" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "sector_i18n_sectorid_locale_key" ON "master"."sector_i18n"("sectorid" ASC, "locale" ASC);

-- CreateIndex
CREATE INDEX "state_country_code_idx" ON "master"."state"("country_code" ASC);

-- CreateIndex
CREATE INDEX "state_state_code_country_code_idx" ON "master"."state"("state_code" ASC, "country_code" ASC);

-- CreateIndex
CREATE INDEX "Business_slug_idx" ON "public"."Business"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Business_slug_key" ON "public"."Business"("slug" ASC);

-- CreateIndex
CREATE INDEX "Client_businessId_idx" ON "public"."Client"("businessId" ASC);

-- CreateIndex
CREATE INDEX "Conversation_businessId_idx" ON "public"."Conversation"("businessId" ASC);

-- CreateIndex
CREATE INDEX "Conversation_businessId_type_idx" ON "public"."Conversation"("businessId" ASC, "type" ASC);

-- CreateIndex
CREATE INDEX "Conversation_clientId_idx" ON "public"."Conversation"("clientId" ASC);

-- CreateIndex
CREATE INDEX "ConversationMember_conversationId_idx" ON "public"."ConversationMember"("conversationId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "ConversationMember_conversationId_user_id_key" ON "public"."ConversationMember"("conversationId" ASC, "user_id" ASC);

-- CreateIndex
CREATE INDEX "ConversationMember_user_id_idx" ON "public"."ConversationMember"("user_id" ASC);

-- CreateIndex
CREATE INDEX "Message_conversationId_createdAt_idx" ON "public"."Message"("conversationId" ASC, "createdAt" ASC);

-- CreateIndex
CREATE INDEX "Message_conversationId_idx" ON "public"."Message"("conversationId" ASC);

-- CreateIndex
CREATE INDEX "Message_sender_id_idx" ON "public"."Message"("sender_id" ASC);

-- CreateIndex
CREATE INDEX "MessageAttachment_messageId_idx" ON "public"."MessageAttachment"("messageId" ASC);

-- CreateIndex
CREATE INDEX "TelephonyCall_businessId_idx" ON "public"."TelephonyCall"("businessId" ASC);

-- CreateIndex
CREATE INDEX "TelephonyCall_businessId_status_idx" ON "public"."TelephonyCall"("businessId" ASC, "status" ASC);

-- CreateIndex
CREATE INDEX "TelephonyCall_clientId_idx" ON "public"."TelephonyCall"("clientId" ASC);

-- CreateIndex
CREATE INDEX "TelephonyCall_providerCallId_idx" ON "public"."TelephonyCall"("providerCallId" ASC);

-- CreateIndex
CREATE INDEX "TelephonyEvent_callId_eventType_idx" ON "public"."TelephonyEvent"("callId" ASC, "eventType" ASC);

-- CreateIndex
CREATE INDEX "TelephonyEvent_callId_idx" ON "public"."TelephonyEvent"("callId" ASC);

-- CreateIndex
CREATE INDEX "TelephonyNumber_businessId_idx" ON "public"."TelephonyNumber"("businessId" ASC);

-- CreateIndex
CREATE INDEX "TelephonyNumber_clientId_idx" ON "public"."TelephonyNumber"("clientId" ASC);

-- CreateIndex
CREATE INDEX "TelephonyNumber_e164_idx" ON "public"."TelephonyNumber"("e164" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "TelephonyNumber_provider_providerNumberId_key" ON "public"."TelephonyNumber"("provider" ASC, "providerNumberId" ASC);

-- CreateIndex
CREATE INDEX "UserMembership_businessId_idx" ON "public"."UserMembership"("businessId" ASC);

-- CreateIndex
CREATE INDEX "UserMembership_clientId_idx" ON "public"."UserMembership"("clientId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "UserMembership_user_id_businessId_clientId_key" ON "public"."UserMembership"("user_id" ASC, "businessId" ASC, "clientId" ASC);

-- CreateIndex
CREATE INDEX "UserMembership_user_id_idx" ON "public"."UserMembership"("user_id" ASC);

-- CreateIndex
CREATE INDEX "idx_bid_requirid" ON "public"."bid"("requirid" ASC);

-- CreateIndex
CREATE INDEX "idx_bid_userid" ON "public"."bid"("userid" ASC);

-- CreateIndex
CREATE INDEX "idx_bid_agree_bidid" ON "public"."bid_agree"("bidid" ASC);

-- CreateIndex
CREATE INDEX "idx_offerings_marketid" ON "public"."offerings"("marketid" ASC);

-- CreateIndex
CREATE INDEX "idx_offerings_userid" ON "public"."offerings"("userid" ASC);

-- CreateIndex
CREATE INDEX "idx_requirements_marketid" ON "public"."requirements"("marketid" ASC);

-- CreateIndex
CREATE INDEX "idx_requirements_userid" ON "public"."requirements"("userid" ASC);

-- CreateIndex
CREATE INDEX "user_email_idx" ON "public"."user"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email" ASC);

-- CreateIndex
CREATE INDEX "user_status_idx" ON "public"."user"("status" ASC);

-- CreateIndex
CREATE INDEX "user_whatsapp_idx" ON "public"."user"("whatsapp" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "user_whatsapp_key" ON "public"."user"("whatsapp" ASC);

-- AddForeignKey
ALTER TABLE "crm"."bot_config" ADD CONSTRAINT "bot_config_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "crm"."wa_channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm"."wa_broadcast" ADD CONSTRAINT "wa_broadcast_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "crm"."wa_channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm"."wa_broadcast_recipient" ADD CONSTRAINT "wa_broadcast_recipient_broadcast_id_fkey" FOREIGN KEY ("broadcast_id") REFERENCES "crm"."wa_broadcast"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm"."wa_broadcast_recipient" ADD CONSTRAINT "wa_broadcast_recipient_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "crm"."wa_contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm"."wa_conversation" ADD CONSTRAINT "wa_conversation_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "crm"."wa_channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm"."wa_conversation" ADD CONSTRAINT "wa_conversation_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "crm"."wa_contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm"."wa_message" ADD CONSTRAINT "wa_message_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "crm"."wa_conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm"."wa_template" ADD CONSTRAINT "wa_template_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "crm"."wa_channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master"."district" ADD CONSTRAINT "district_country_code_fkey" FOREIGN KEY ("country_code") REFERENCES "master"."country"("country_code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master"."district" ADD CONSTRAINT "district_stateid_fkey" FOREIGN KEY ("stateid") REFERENCES "master"."state"("stateid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master"."field" ADD CONSTRAINT "field_sectorid_fkey" FOREIGN KEY ("sectorid") REFERENCES "master"."sector"("sectorid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master"."field_i18n" ADD CONSTRAINT "field_i18n_fieldid_fkey" FOREIGN KEY ("fieldid") REFERENCES "master"."field"("fieldid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master"."market" ADD CONSTRAINT "market_fieldid_fkey" FOREIGN KEY ("fieldid") REFERENCES "master"."field"("fieldid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master"."market" ADD CONSTRAINT "market_sectorid_fkey" FOREIGN KEY ("sectorid") REFERENCES "master"."sector"("sectorid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master"."market_i18n" ADD CONSTRAINT "market_i18n_marketid_fkey" FOREIGN KEY ("marketid") REFERENCES "master"."market"("marketid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master"."place" ADD CONSTRAINT "place_country_code_fkey" FOREIGN KEY ("country_code") REFERENCES "master"."country"("country_code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master"."place" ADD CONSTRAINT "place_districtid_fkey" FOREIGN KEY ("districtid") REFERENCES "master"."district"("districtid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master"."place" ADD CONSTRAINT "place_stateid_fkey" FOREIGN KEY ("stateid") REFERENCES "master"."state"("stateid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master"."postal" ADD CONSTRAINT "postal_country_code_fkey" FOREIGN KEY ("country_code") REFERENCES "master"."country"("country_code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master"."postal" ADD CONSTRAINT "postal_districtid_fkey" FOREIGN KEY ("districtid") REFERENCES "master"."district"("districtid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master"."postal" ADD CONSTRAINT "postal_stateid_fkey" FOREIGN KEY ("stateid") REFERENCES "master"."state"("stateid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master"."sector_i18n" ADD CONSTRAINT "sector_i18n_sectorid_fkey" FOREIGN KEY ("sectorid") REFERENCES "master"."sector"("sectorid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master"."state" ADD CONSTRAINT "state_country_code_fkey" FOREIGN KEY ("country_code") REFERENCES "master"."country"("country_code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Client" ADD CONSTRAINT "Client_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "public"."Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Conversation" ADD CONSTRAINT "Conversation_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "public"."Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Conversation" ADD CONSTRAINT "Conversation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConversationMember" ADD CONSTRAINT "ConversationMember_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConversationMember" ADD CONSTRAINT "ConversationMember_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("userid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("userid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MessageAttachment" ADD CONSTRAINT "MessageAttachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "public"."Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TelephonyCall" ADD CONSTRAINT "TelephonyCall_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "public"."Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TelephonyCall" ADD CONSTRAINT "TelephonyCall_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TelephonyEvent" ADD CONSTRAINT "TelephonyEvent_callId_fkey" FOREIGN KEY ("callId") REFERENCES "public"."TelephonyCall"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TelephonyNumber" ADD CONSTRAINT "TelephonyNumber_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "public"."Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TelephonyNumber" ADD CONSTRAINT "TelephonyNumber_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserMembership" ADD CONSTRAINT "UserMembership_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "public"."Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserMembership" ADD CONSTRAINT "UserMembership_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserMembership" ADD CONSTRAINT "UserMembership_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("userid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bid" ADD CONSTRAINT "fk_bid_requirement" FOREIGN KEY ("requirid") REFERENCES "public"."requirements"("requirid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bid_agree" ADD CONSTRAINT "fk_bid_agree_bid" FOREIGN KEY ("bidid") REFERENCES "public"."bid"("bidid") ON DELETE NO ACTION ON UPDATE NO ACTION;

