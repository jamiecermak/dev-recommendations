-- AlterTable
ALTER TABLE "invite_codes" ALTER COLUMN "email_address" DROP NOT NULL;

-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "description" TEXT NOT NULL DEFAULT '';
