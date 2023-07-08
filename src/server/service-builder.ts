import { AuthGuard } from "./core/auth-guard";
import { ClerkUserService } from "./core/clerk-user-service";
import { ClerkWebhookService } from "./core/clerk-webhook-service";
import { InviteCodeService } from "./core/invite-code-service";
import { TeamMemberService } from "./core/team-member-service";
import { TeamsService } from "./core/teams-service";
import type { PrismaClient } from "@prisma/client";
import type { ClerkUserAPI } from "~/utils/clerk";

export function getServices(
  prismaClient: PrismaClient,
  clerkUserAPI: ClerkUserAPI
) {
  const clerkUser = new ClerkUserService(prismaClient, clerkUserAPI);
  const teams = new TeamsService(prismaClient);
  const teamMember = new TeamMemberService(prismaClient);
  const inviteCode = new InviteCodeService(prismaClient, teamMember);
  const authGuard = new AuthGuard(clerkUser, teams, teamMember);
  const clerkWebhook = new ClerkWebhookService(clerkUser);

  return {
    clerkUser,
    teams,
    teamMember,
    inviteCode,
    authGuard,
    clerkWebhook,
  };
}
