import type { User } from "@prisma/client";
import type { ClerkUserService } from "./clerk-user-service";
import type { TeamMemberAssertionOptions } from "./team-member-policy";
import type { TeamMemberService } from "./team-member-service";
import type { TeamsService } from "./teams-service";

class AuthGuard {
  constructor(
    private clerkUserService: ClerkUserService,
    private teamsService: TeamsService,
    private teamMemberService: TeamMemberService
  ) {}

  async authoriseByTeamMemberWithUser(
    user: User,
    teamId: string | null,
    opts: TeamMemberAssertionOptions = {}
  ) {
    if (teamId === null) throw new AuthGuardError("Team ID is null");

    const team = await this.teamsService.getByIdOrThrow(teamId);
    const teamMemberPolicy = await this.teamMemberService.getPolicyByTeam(team);

    teamMemberPolicy.isTeamMemberOrThrow(user, opts);

    return {
      user,
      team,
      teamMemberPolicy,
    };
  }

  async authoriseByTeamMember(
    userId: string | null,
    teamId: string | null,
    opts: TeamMemberAssertionOptions = {}
  ) {
    if (userId === null) throw new AuthGuardError("User ID is null");

    const [user] = await this.clerkUserService.authenticateById(userId);

    return this.authoriseByTeamMemberWithUser(user, teamId, opts);
  }
}

class AuthGuardError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthGuardError";
  }
}

export { AuthGuard };
