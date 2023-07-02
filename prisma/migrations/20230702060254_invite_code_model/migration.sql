-- CreateTable
CREATE TABLE "invite_codes" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "invited_by_user_id" TEXT NOT NULL,
    "email_address" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "is_used" BOOLEAN NOT NULL,
    "used_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invite_codes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "invite_codes" ADD CONSTRAINT "invite_codes_invited_by_user_id_fkey" FOREIGN KEY ("invited_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
