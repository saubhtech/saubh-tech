-- ============================================================================
-- Migration: Restructure public."User" -> public."user"
-- Drops old cuid-based User and dependent tables, recreates with bigserial
-- ============================================================================

-- 1. Drop dependent tables (cascade from old User)
DROP TABLE IF EXISTS public."MessageAttachment" CASCADE;
DROP TABLE IF EXISTS public."Message" CASCADE;
DROP TABLE IF EXISTS public."ConversationMember" CASCADE;
DROP TABLE IF EXISTS public."Conversation" CASCADE;
DROP TABLE IF EXISTS public."UserMembership" CASCADE;
DROP TABLE IF EXISTS public."User" CASCADE;

-- 2. Create new enums
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Gender' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
    CREATE TYPE public."Gender" AS ENUM ('M', 'F', 'T', 'O');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'VerifiedType' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
    CREATE TYPE public."VerifiedType" AS ENUM ('D', 'P', 'PD');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'UserStatus' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
    CREATE TYPE public."UserStatus" AS ENUM ('A', 'S', 'B', 'D');
  END IF;
END $$;

-- 3. Create new user table
CREATE TABLE public."user" (
  "userid"        BIGSERIAL       PRIMARY KEY,
  "whatsapp"      VARCHAR(20)     NOT NULL UNIQUE,
  "passcode"      VARCHAR(4),
  "fname"         VARCHAR(100)    NOT NULL,
  "email"         VARCHAR(255)    UNIQUE,
  "phone"         VARCHAR(20),
  "pic"           VARCHAR(500),
  "gender"        public."Gender",
  "dob"           DATE,
  "langid"        INTEGER[]       DEFAULT '{}',
  "qualification" VARCHAR(200),
  "experience"    VARCHAR(200),
  "country_code"  CHAR(2),
  "stateid"       INTEGER,
  "districtid"    INTEGER,
  "pincode"       VARCHAR(10),
  "placeid"       INTEGER,
  "verified"      public."VerifiedType",
  "status"        public."UserStatus" NOT NULL DEFAULT 'A',
  "reason"        VARCHAR(500),
  "created_at"    TIMESTAMP(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"    TIMESTAMP(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "user_whatsapp_idx" ON public."user"("whatsapp");
CREATE INDEX "user_email_idx" ON public."user"("email");
CREATE INDEX "user_status_idx" ON public."user"("status");

-- 4. Recreate UserMembership with BigInt user_id
CREATE TABLE public."UserMembership" (
  "id"          TEXT        NOT NULL DEFAULT gen_random_uuid()::text,
  "user_id"     BIGINT      NOT NULL,
  "businessId"  TEXT        NOT NULL,
  "clientId"    TEXT,
  "role"        public."UserRole" NOT NULL DEFAULT 'MEMBER',
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserMembership_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "UserMembership_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES public."user"("userid") ON DELETE CASCADE,
  CONSTRAINT "UserMembership_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES public."Business"("id") ON DELETE CASCADE,
  CONSTRAINT "UserMembership_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public."Client"("id") ON DELETE SET NULL
);

CREATE UNIQUE INDEX "UserMembership_user_id_businessId_clientId_key" ON public."UserMembership"("user_id", "businessId", "clientId");
CREATE INDEX "UserMembership_user_id_idx" ON public."UserMembership"("user_id");
CREATE INDEX "UserMembership_businessId_idx" ON public."UserMembership"("businessId");
CREATE INDEX "UserMembership_clientId_idx" ON public."UserMembership"("clientId");

-- 5. Recreate Conversation (no user FK, unchanged structure)
CREATE TABLE public."Conversation" (
  "id"          TEXT                  NOT NULL DEFAULT gen_random_uuid()::text,
  "businessId"  TEXT                  NOT NULL,
  "clientId"    TEXT,
  "type"        public."ConversationType" NOT NULL DEFAULT 'DM',
  "title"       TEXT,
  "createdAt"   TIMESTAMP(3)          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3)          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Conversation_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES public."Business"("id") ON DELETE CASCADE,
  CONSTRAINT "Conversation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public."Client"("id") ON DELETE SET NULL
);

CREATE INDEX "Conversation_businessId_idx" ON public."Conversation"("businessId");
CREATE INDEX "Conversation_clientId_idx" ON public."Conversation"("clientId");
CREATE INDEX "Conversation_businessId_type_idx" ON public."Conversation"("businessId", "type");

-- 6. Recreate ConversationMember with BigInt user_id
CREATE TABLE public."ConversationMember" (
  "id"              TEXT          NOT NULL DEFAULT gen_random_uuid()::text,
  "conversationId"  TEXT          NOT NULL,
  "user_id"         BIGINT        NOT NULL,
  "role"            public."MemberRole" NOT NULL DEFAULT 'MEMBER',
  "joinedAt"        TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ConversationMember_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ConversationMember_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES public."Conversation"("id") ON DELETE CASCADE,
  CONSTRAINT "ConversationMember_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES public."user"("userid") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "ConversationMember_conversationId_user_id_key" ON public."ConversationMember"("conversationId", "user_id");
CREATE INDEX "ConversationMember_conversationId_idx" ON public."ConversationMember"("conversationId");
CREATE INDEX "ConversationMember_user_id_idx" ON public."ConversationMember"("user_id");

-- 7. Recreate Message with BigInt sender_id
CREATE TABLE public."Message" (
  "id"              TEXT          NOT NULL DEFAULT gen_random_uuid()::text,
  "conversationId"  TEXT          NOT NULL,
  "sender_id"       BIGINT        NOT NULL,
  "content"         TEXT,
  "createdAt"       TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"       TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Message_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES public."Conversation"("id") ON DELETE CASCADE,
  CONSTRAINT "Message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES public."user"("userid") ON DELETE CASCADE
);

CREATE INDEX "Message_conversationId_idx" ON public."Message"("conversationId");
CREATE INDEX "Message_sender_id_idx" ON public."Message"("sender_id");
CREATE INDEX "Message_conversationId_createdAt_idx" ON public."Message"("conversationId", "createdAt");

-- 8. Recreate MessageAttachment
CREATE TABLE public."MessageAttachment" (
  "id"        TEXT          NOT NULL DEFAULT gen_random_uuid()::text,
  "messageId" TEXT          NOT NULL,
  "objectKey" TEXT          NOT NULL,
  "mimeType"  TEXT          NOT NULL,
  "size"      INTEGER       NOT NULL,
  "createdAt" TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MessageAttachment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "MessageAttachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES public."Message"("id") ON DELETE CASCADE
);

CREATE INDEX "MessageAttachment_messageId_idx" ON public."MessageAttachment"("messageId");
