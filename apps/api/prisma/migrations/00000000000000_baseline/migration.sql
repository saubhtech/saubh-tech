-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "crm";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "master";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'VIEWER');

-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('ADMIN', 'MEMBER', 'OBSERVER');

-- CreateEnum
CREATE TYPE "ConversationType" AS ENUM ('DM', 'GROUP', 'BROADCAST');

-- CreateEnum
CREATE TYPE "CallDirection" AS ENUM ('INBOUND', 'OUTBOUND');

-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('INITIATED', 'RINGING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'BUSY', 'NO_ANSWER', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('M', 'F', 'T', 'O');

-- CreateEnum
CREATE TYPE "VerifiedType" AS ENUM ('D', 'P', 'PD');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('A', 'S', 'B', 'D');

-- CreateEnum
CREATE TYPE "master"."DeliveryMode" AS ENUM ('PHYSICAL', 'DIGITAL', 'PHYGITAL');

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "userid" BIGSERIAL NOT NULL,
    "whatsapp" VARCHAR(20) NOT NULL,
    "passcode" VARCHAR(4),
    "passcode_expiry" TIMESTAMP(3),
    "fname" VARCHAR(100) NOT NULL,
    "lname" VARCHAR(100),
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "pic" VARCHAR(500),
    "gender" "Gender",
    "dob" DATE,
    "langid" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "qualification" VARCHAR(200),
    "experience" VARCHAR(200),
    "usertype" VARCHAR(2) NOT NULL DEFAULT 'GW',
    "country_code" CHAR(2),
    "stateid" INTEGER,
    "districtid" INTEGER,
    "pincode" VARCHAR(10),
    "placeid" INTEGER,
    "place_request" VARCHAR(200),
    "verified" "VerifiedType",
    "status" "UserStatus" NOT NULL DEFAULT 'A',
    "reason" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("userid")
);

-- CreateTable
CREATE TABLE "UserMembership" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "businessId" TEXT NOT NULL,
    "clientId" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "clientId" TEXT,
    "type" "ConversationType" NOT NULL DEFAULT 'DM',
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationMember" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "role" "MemberRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "sender_id" BIGINT NOT NULL,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageAttachment" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "objectKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelephonyNumber" (
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
CREATE TABLE "TelephonyCall" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "clientId" TEXT,
    "direction" "CallDirection" NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "status" "CallStatus" NOT NULL DEFAULT 'INITIATED',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "providerCallId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TelephonyCall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelephonyEvent" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "callId" TEXT NOT NULL,

    CONSTRAINT "TelephonyEvent_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "master"."state" (
    "stateid" SERIAL NOT NULL,
    "state" VARCHAR(100) NOT NULL,
    "state_code" CHAR(2) NOT NULL,
    "country_code" CHAR(2) NOT NULL,
    "region" VARCHAR(100),

    CONSTRAINT "state_pkey" PRIMARY KEY ("stateid")
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
CREATE TABLE "master"."locality" (
    "localityid" SERIAL NOT NULL,
    "locality" VARCHAR(200) NOT NULL,
    "placeid" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "local_agency" BIGINT,

    CONSTRAINT "locality_pkey" PRIMARY KEY ("localityid")
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
CREATE TABLE "master"."division" (
    "divisionid" SERIAL NOT NULL,
    "division" VARCHAR(200) NOT NULL,
    "areaid" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "division_agency" BIGINT,

    CONSTRAINT "division_pkey" PRIMARY KEY ("divisionid")
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
CREATE TABLE "master"."zone" (
    "zoneid" SERIAL NOT NULL,
    "zone_code" CHAR(2) NOT NULL,
    "zone" VARCHAR(200) NOT NULL,
    "regionid" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "zone_agency" BIGINT,

    CONSTRAINT "zone_pkey" PRIMARY KEY ("zoneid")
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
CREATE TABLE "master"."language" (
    "langid" SMALLSERIAL NOT NULL,
    "language" VARCHAR(200) NOT NULL,
    "locale" VARCHAR(10) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_rtl" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "language_pkey" PRIMARY KEY ("langid")
);

-- CreateTable
CREATE TABLE "crm"."wa_channel" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "type" VARCHAR(10) NOT NULL,
    "instance_name" VARCHAR(100),
    "default_bot_enabled" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

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
CREATE TABLE "requirements" (
    "requirid" BIGSERIAL NOT NULL,
    "userid" BIGINT NOT NULL,
    "marketed" INTEGER NOT NULL,
    "delivery_mode" CHAR(2),
    "requirements" TEXT,
    "eligibility" TEXT,
    "doc_url" TEXT,
    "audio_url" TEXT,
    "video_url" TEXT,
    "budget" DECIMAL(10,2),
    "escrow" DECIMAL(10,2),
    "bidate" DATE,
    "delivdate" DATE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "requirements_pkey" PRIMARY KEY ("requirid")
);

-- CreateTable
CREATE TABLE "offerings" (
    "offerid" BIGSERIAL NOT NULL,
    "userid" BIGINT NOT NULL,
    "marketed" INTEGER NOT NULL,
    "delivery_mode" CHAR(2),
    "offerings" TEXT,
    "doc_url" TEXT,
    "audio_url" TEXT,
    "video_url" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "offerings_pkey" PRIMARY KEY ("offerid")
);

-- CreateTable
CREATE TABLE "bid" (
    "bidid" BIGSERIAL NOT NULL,
    "requirid" BIGINT NOT NULL,
    "userid" BIGINT NOT NULL,
    "amount" DECIMAL(10,2),
    "escrow" DECIMAL(10,2),
    "selected" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "bid_pkey" PRIMARY KEY ("bidid")
);

-- CreateTable
CREATE TABLE "bid_agree" (
    "agreeid" BIGSERIAL NOT NULL,
    "bidid" BIGINT NOT NULL,
    "agreement" TEXT,
    "client_sign" TEXT,
    "provider_sign" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "bid_agree_pkey" PRIMARY KEY ("agreeid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Business_slug_key" ON "Business"("slug");

-- CreateIndex
CREATE INDEX "Business_slug_idx" ON "Business"("slug");

-- CreateIndex
CREATE INDEX "Client_businessId_idx" ON "Client"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "user_whatsapp_key" ON "user"("whatsapp");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_whatsapp_idx" ON "user"("whatsapp");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_status_idx" ON "user"("status");

-- CreateIndex
CREATE INDEX "UserMembership_user_id_idx" ON "UserMembership"("user_id");

-- CreateIndex
CREATE INDEX "UserMembership_businessId_idx" ON "UserMembership"("businessId");

-- CreateIndex
CREATE INDEX "UserMembership_clientId_idx" ON "UserMembership"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMembership_user_id_businessId_clientId_key" ON "UserMembership"("user_id", "businessId", "clientId");

-- CreateIndex
CREATE INDEX "Conversation_businessId_idx" ON "Conversation"("businessId");

-- CreateIndex
CREATE INDEX "Conversation_clientId_idx" ON "Conversation"("clientId");

-- CreateIndex
CREATE INDEX "Conversation_businessId_type_idx" ON "Conversation"("businessId", "type");

-- CreateIndex
CREATE INDEX "ConversationMember_conversationId_idx" ON "ConversationMember"("conversationId");

-- CreateIndex
CREATE INDEX "ConversationMember_user_id_idx" ON "ConversationMember"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationMember_conversationId_user_id_key" ON "ConversationMember"("conversationId", "user_id");

-- CreateIndex
CREATE INDEX "Message_conversationId_idx" ON "Message"("conversationId");

-- CreateIndex
CREATE INDEX "Message_sender_id_idx" ON "Message"("sender_id");

-- CreateIndex
CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "MessageAttachment_messageId_idx" ON "MessageAttachment"("messageId");

-- CreateIndex
CREATE INDEX "TelephonyNumber_businessId_idx" ON "TelephonyNumber"("businessId");

-- CreateIndex
CREATE INDEX "TelephonyNumber_clientId_idx" ON "TelephonyNumber"("clientId");

-- CreateIndex
CREATE INDEX "TelephonyNumber_e164_idx" ON "TelephonyNumber"("e164");

-- CreateIndex
CREATE UNIQUE INDEX "TelephonyNumber_provider_providerNumberId_key" ON "TelephonyNumber"("provider", "providerNumberId");

-- CreateIndex
CREATE INDEX "TelephonyCall_businessId_idx" ON "TelephonyCall"("businessId");

-- CreateIndex
CREATE INDEX "TelephonyCall_clientId_idx" ON "TelephonyCall"("clientId");

-- CreateIndex
CREATE INDEX "TelephonyCall_providerCallId_idx" ON "TelephonyCall"("providerCallId");

-- CreateIndex
CREATE INDEX "TelephonyCall_businessId_status_idx" ON "TelephonyCall"("businessId", "status");

-- CreateIndex
CREATE INDEX "TelephonyEvent_callId_idx" ON "TelephonyEvent"("callId");

-- CreateIndex
CREATE INDEX "TelephonyEvent_callId_eventType_idx" ON "TelephonyEvent"("callId", "eventType");

-- CreateIndex
CREATE INDEX "state_country_code_idx" ON "master"."state"("country_code");

-- CreateIndex
CREATE INDEX "state_state_code_country_code_idx" ON "master"."state"("state_code", "country_code");

-- CreateIndex
CREATE INDEX "district_stateid_idx" ON "master"."district"("stateid");

-- CreateIndex
CREATE INDEX "district_country_code_idx" ON "master"."district"("country_code");

-- CreateIndex
CREATE INDEX "postal_pincode_idx" ON "master"."postal"("pincode");

-- CreateIndex
CREATE INDEX "postal_districtid_idx" ON "master"."postal"("districtid");

-- CreateIndex
CREATE INDEX "postal_stateid_idx" ON "master"."postal"("stateid");

-- CreateIndex
CREATE INDEX "postal_country_code_idx" ON "master"."postal"("country_code");

-- CreateIndex
CREATE INDEX "place_country_code_idx" ON "master"."place"("country_code");

-- CreateIndex
CREATE INDEX "place_stateid_idx" ON "master"."place"("stateid");

-- CreateIndex
CREATE INDEX "place_districtid_idx" ON "master"."place"("districtid");

-- CreateIndex
CREATE INDEX "place_pincode_idx" ON "master"."place"("pincode");

-- CreateIndex
CREATE UNIQUE INDEX "sector_code_key" ON "master"."sector"("code");

-- CreateIndex
CREATE INDEX "sector_i18n_sectorid_idx" ON "master"."sector_i18n"("sectorid");

-- CreateIndex
CREATE INDEX "sector_i18n_locale_idx" ON "master"."sector_i18n"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "sector_i18n_sectorid_locale_key" ON "master"."sector_i18n"("sectorid", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "field_code_key" ON "master"."field"("code");

-- CreateIndex
CREATE INDEX "field_sectorid_idx" ON "master"."field"("sectorid");

-- CreateIndex
CREATE INDEX "field_i18n_fieldid_idx" ON "master"."field_i18n"("fieldid");

-- CreateIndex
CREATE INDEX "field_i18n_locale_idx" ON "master"."field_i18n"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "field_i18n_fieldid_locale_key" ON "master"."field_i18n"("fieldid", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "market_code_key" ON "master"."market"("code");

-- CreateIndex
CREATE INDEX "market_sectorid_idx" ON "master"."market"("sectorid");

-- CreateIndex
CREATE INDEX "market_fieldid_idx" ON "master"."market"("fieldid");

-- CreateIndex
CREATE INDEX "market_p_s_ps_idx" ON "master"."market"("p_s_ps");

-- CreateIndex
CREATE INDEX "market_code_idx" ON "master"."market"("code");

-- CreateIndex
CREATE INDEX "market_i18n_marketid_idx" ON "master"."market_i18n"("marketid");

-- CreateIndex
CREATE INDEX "market_i18n_locale_idx" ON "master"."market_i18n"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "market_i18n_marketid_locale_key" ON "master"."market_i18n"("marketid", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "language_language_key" ON "master"."language"("language");

-- CreateIndex
CREATE UNIQUE INDEX "language_locale_key" ON "master"."language"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "wa_channel_phone_key" ON "crm"."wa_channel"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "wa_contact_whatsapp_key" ON "crm"."wa_contact"("whatsapp");

-- CreateIndex
CREATE INDEX "wa_contact_user_id_idx" ON "crm"."wa_contact"("user_id");

-- CreateIndex
CREATE INDEX "wa_conversation_channel_id_idx" ON "crm"."wa_conversation"("channel_id");

-- CreateIndex
CREATE INDEX "wa_conversation_contact_id_idx" ON "crm"."wa_conversation"("contact_id");

-- CreateIndex
CREATE INDEX "wa_conversation_status_idx" ON "crm"."wa_conversation"("status");

-- CreateIndex
CREATE INDEX "wa_conversation_assigned_to_idx" ON "crm"."wa_conversation"("assigned_to");

-- CreateIndex
CREATE INDEX "wa_message_conversation_id_idx" ON "crm"."wa_message"("conversation_id");

-- CreateIndex
CREATE INDEX "wa_message_sent_at_idx" ON "crm"."wa_message"("sent_at");

-- CreateIndex
CREATE INDEX "wa_broadcast_channel_id_idx" ON "crm"."wa_broadcast"("channel_id");

-- CreateIndex
CREATE INDEX "wa_broadcast_status_idx" ON "crm"."wa_broadcast"("status");

-- CreateIndex
CREATE INDEX "wa_broadcast_recipient_broadcast_id_idx" ON "crm"."wa_broadcast_recipient"("broadcast_id");

-- CreateIndex
CREATE INDEX "wa_broadcast_recipient_contact_id_idx" ON "crm"."wa_broadcast_recipient"("contact_id");

-- CreateIndex
CREATE UNIQUE INDEX "bot_config_channel_id_key" ON "crm"."bot_config"("channel_id");

-- CreateIndex
CREATE INDEX "wa_template_channel_id_idx" ON "crm"."wa_template"("channel_id");

-- CreateIndex
CREATE INDEX "wa_template_status_idx" ON "crm"."wa_template"("status");

-- CreateIndex
CREATE UNIQUE INDEX "bid_agree_bidid_key" ON "bid_agree"("bidid");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMembership" ADD CONSTRAINT "UserMembership_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("userid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMembership" ADD CONSTRAINT "UserMembership_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMembership" ADD CONSTRAINT "UserMembership_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationMember" ADD CONSTRAINT "ConversationMember_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationMember" ADD CONSTRAINT "ConversationMember_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("userid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user"("userid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageAttachment" ADD CONSTRAINT "MessageAttachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelephonyNumber" ADD CONSTRAINT "TelephonyNumber_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelephonyNumber" ADD CONSTRAINT "TelephonyNumber_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelephonyCall" ADD CONSTRAINT "TelephonyCall_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelephonyCall" ADD CONSTRAINT "TelephonyCall_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelephonyEvent" ADD CONSTRAINT "TelephonyEvent_callId_fkey" FOREIGN KEY ("callId") REFERENCES "TelephonyCall"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master"."state" ADD CONSTRAINT "state_country_code_fkey" FOREIGN KEY ("country_code") REFERENCES "master"."country"("country_code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master"."district" ADD CONSTRAINT "district_stateid_fkey" FOREIGN KEY ("stateid") REFERENCES "master"."state"("stateid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master"."district" ADD CONSTRAINT "district_country_code_fkey" FOREIGN KEY ("country_code") REFERENCES "master"."country"("country_code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master"."postal" ADD CONSTRAINT "postal_districtid_fkey" FOREIGN KEY ("districtid") REFERENCES "master"."district"("districtid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master"."postal" ADD CONSTRAINT "postal_stateid_fkey" FOREIGN KEY ("stateid") REFERENCES "master"."state"("stateid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master"."postal" ADD CONSTRAINT "postal_country_code_fkey" FOREIGN KEY ("country_code") REFERENCES "master"."country"("country_code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master"."place" ADD CONSTRAINT "place_country_code_fkey" FOREIGN KEY ("country_code") REFERENCES "master"."country"("country_code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master"."place" ADD CONSTRAINT "place_stateid_fkey" FOREIGN KEY ("stateid") REFERENCES "master"."state"("stateid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master"."place" ADD CONSTRAINT "place_districtid_fkey" FOREIGN KEY ("districtid") REFERENCES "master"."district"("districtid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master"."sector_i18n" ADD CONSTRAINT "sector_i18n_sectorid_fkey" FOREIGN KEY ("sectorid") REFERENCES "master"."sector"("sectorid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master"."field" ADD CONSTRAINT "field_sectorid_fkey" FOREIGN KEY ("sectorid") REFERENCES "master"."sector"("sectorid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master"."field_i18n" ADD CONSTRAINT "field_i18n_fieldid_fkey" FOREIGN KEY ("fieldid") REFERENCES "master"."field"("fieldid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master"."market" ADD CONSTRAINT "market_sectorid_fkey" FOREIGN KEY ("sectorid") REFERENCES "master"."sector"("sectorid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master"."market" ADD CONSTRAINT "market_fieldid_fkey" FOREIGN KEY ("fieldid") REFERENCES "master"."field"("fieldid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master"."market_i18n" ADD CONSTRAINT "market_i18n_marketid_fkey" FOREIGN KEY ("marketid") REFERENCES "master"."market"("marketid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm"."wa_conversation" ADD CONSTRAINT "wa_conversation_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "crm"."wa_channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm"."wa_conversation" ADD CONSTRAINT "wa_conversation_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "crm"."wa_contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm"."wa_message" ADD CONSTRAINT "wa_message_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "crm"."wa_conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm"."wa_broadcast" ADD CONSTRAINT "wa_broadcast_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "crm"."wa_channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm"."wa_broadcast_recipient" ADD CONSTRAINT "wa_broadcast_recipient_broadcast_id_fkey" FOREIGN KEY ("broadcast_id") REFERENCES "crm"."wa_broadcast"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm"."wa_broadcast_recipient" ADD CONSTRAINT "wa_broadcast_recipient_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "crm"."wa_contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm"."bot_config" ADD CONSTRAINT "bot_config_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "crm"."wa_channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm"."wa_template" ADD CONSTRAINT "wa_template_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "crm"."wa_channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bid" ADD CONSTRAINT "bid_requirid_fkey" FOREIGN KEY ("requirid") REFERENCES "requirements"("requirid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bid_agree" ADD CONSTRAINT "bid_agree_bidid_fkey" FOREIGN KEY ("bidid") REFERENCES "bid"("bidid") ON DELETE RESTRICT ON UPDATE CASCADE;

