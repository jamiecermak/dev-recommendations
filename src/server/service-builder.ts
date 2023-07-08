import { Resend } from "resend";
import { AuthGuard } from "./core/auth-guard";
import { ClerkUserService } from "./core/users/clerk-user-service";
import { ClerkWebhookService } from "./core/webhooks/clerk-webhook-service";
import type { EmailService } from "./core/email/email-service";
import { ResendEmailService } from "./core/email/resend-email-service";
import { InviteCodeService } from "./core/teams/invite-code-service";
import { TeamMemberService } from "./core/teams/team-member-service";
import { TeamsService } from "./core/teams/teams-service";
import type { PrismaClient } from "@prisma/client";
import type { ClerkUserAPI } from "~/utils/clerk";
import { env } from "~/env.mjs";
import { EmailTemplateService } from "./core/email-templates/template-service";

function getBaseUrl() {
  if (env.RCMD_DEV_BASE_URL !== undefined)
    return `http://${env.RCMD_DEV_BASE_URL}`;
  if (env.RCMD_BASE_URL !== undefined) return `https://${env.RCMD_BASE_URL}`;
  if (env.VERCEL_URL !== undefined) return `https://${env.VERCEL_URL}`;

  throw new Error("Failed to create RCMD Base URL");
}

export function getServices(
  prismaClient: PrismaClient,
  clerkUserAPI: ClerkUserAPI
) {
  const emailService: EmailService = new ResendEmailService(
    env.FROM_EMAIL_ADDRESS,
    new Resend(env.RESEND_API_KEY),
    env.DEVELOPMENT_EMAIL
  );

  const clerkUser = new ClerkUserService(prismaClient, clerkUserAPI);
  const teams = new TeamsService(prismaClient);
  const teamMember = new TeamMemberService(prismaClient);
  const inviteCode = new InviteCodeService(prismaClient, teamMember);
  const authGuard = new AuthGuard(clerkUser, teams, teamMember);
  const clerkWebhook = new ClerkWebhookService(clerkUser);
  const emailTemplateService = new EmailTemplateService(
    getBaseUrl(),
    emailService
  );

  return {
    clerkUser,
    teams,
    teamMember,
    inviteCode,
    authGuard,
    clerkWebhook,
    emailTemplateService,
  };
}
