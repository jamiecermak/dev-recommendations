import type { PrismaClient, Team, User } from "@prisma/client";
import { TeamMemberPolicy } from "./team-member-policy";

class TeamMemberService {
  constructor(private prisma: PrismaClient) {}

  async getPolicyByTeam(team: Team) {
    const teamMembers = await this.prisma.teamMember.findMany({
      where: {
        teamId: team.id,
      },
      include: {
        user: true,
      },
    });

    return new TeamMemberPolicy(team, teamMembers);
  }

  async addUserToTeam(team: Team, user: User, isAdmin = false) {
    const teamMemberPolicy = await this.getPolicyByTeam(team);

    // If the team member is already active, we can't add them in again
    if (teamMemberPolicy.isActive(user.id)) throw new TeamMemberExistsError();

    if (teamMemberPolicy.hasUser(user.id)) {
      await this.prisma.teamMember.update({
        data: {
          isActive: true,
          isAdmin,
          joinedAt: new Date(),
        },
        where: {
          teamId_userId: {
            teamId: team.id,
            userId: user.id,
          },
        },
      });

      return;
    }

    await this.prisma.teamMember.create({
      data: {
        userId: user.id,
        teamId: team.id,
        isActive: true,
        isAdmin,
      },
    });
  }

  async getAllByUser(user: User) {
    return this.prisma.teamMember.findMany({
      where: {
        userId: user.id,
        isActive: true,
      },
      include: {
        team: true,
      },
    });
  }

  async removeUserFromTeam(team: Team, user: User, removedByUser: User) {
    const teamMemberPolicy = await this.getPolicyByTeam(team);

    teamMemberPolicy.isTeamMemberOrThrow(removedByUser, { isAdmin: true });

    if (removedByUser.id === user.id)
      throw new TeamPermissionError("Can not remove yourself");

    if (teamMemberPolicy.isOwner(user.id))
      throw new TeamPermissionError("Can not remove team owner");

    await this.prisma.teamMember.update({
      data: {
        isActive: false,
        isAdmin: false,
      },
      where: {
        teamId_userId: {
          teamId: team.id,
          userId: user.id,
        },
      },
    });
  }

  async changeUserAdminStatus(
    team: Team,
    user: User,
    isAdmin: boolean,
    updatedByUser: User
  ) {
    const teamMemberPolicy = await this.getPolicyByTeam(team);

    teamMemberPolicy.isTeamMemberOrThrow(updatedByUser, { isAdmin: true });

    if (updatedByUser.id === user.id)
      throw new TeamPermissionError("Can not change your own admin status");

    if (teamMemberPolicy.isOwner(user.id))
      throw new TeamPermissionError("Can not change team owner admin status");

    await this.prisma.teamMember.update({
      data: {
        isAdmin,
      },
      where: {
        teamId_userId: {
          teamId: team.id,
          userId: user.id,
        },
      },
    });
  }
}

export class TeamPermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TeamPermissionError";
  }
}

export class TeamMemberExistsError extends Error {
  constructor() {
    super("Team member already exists and is active");
    this.name = "TeamPermissionError";
  }
}

export { TeamMemberService };
