-- AlterTable
ALTER TABLE "invite_codes" ALTER COLUMN "is_used" SET DEFAULT false,
ALTER COLUMN "used_at" DROP NOT NULL;
