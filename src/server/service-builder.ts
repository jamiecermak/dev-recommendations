import { clerkClient } from "@clerk/nextjs";
import { AuthGuard } from "./core/auth-guard";
import { ClerkUserService } from "./core/clerk-user-service";
import { TeamMemberService } from "./core/team-member-service";
import { TeamsService } from "./core/teams-service";
import { prisma } from "./db";

export function getServices() {
  const clerkUser = new ClerkUserService(prisma, clerkClient.users);
  const teams = new TeamsService(prisma);
  const teamMember = new TeamMemberService(prisma);
  const authGuard = new AuthGuard(clerkUser, teams, teamMember);

  return {
    clerkUser,
    teams,
    teamMember,
    authGuard,
  };
}
