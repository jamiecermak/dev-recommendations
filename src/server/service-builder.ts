import { Resend } from "resend";
import { AuthGuard } from "./core/auth-guard";
import { ClerkUserService } from "./core/clerk-user-service";
import { ClerkWebhookService } from "./core/clerk-webhook-service";
import type { EmailService } from "./core/email/email-service";
import { ResendEmailService } from "./core/email/resend-email-service";
import { InviteCodeService } from "./core/invite-code-service";
import { TeamMemberService } from "./core/team-member-service";
import { TeamsService } from "./core/teams-service";
import type { PrismaClient } from "@prisma/client";
import type { ClerkUserAPI } from "~/utils/clerk";
import { env } from "~/env.mjs";
import { EmailTemplateService } from "./email-templates/template-service";

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
    `https://${env.VERCEL_URL}`,
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
