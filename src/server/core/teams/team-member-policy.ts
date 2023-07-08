import type { Team, User } from "@prisma/client";
import type { TeamMember } from "../types";

export interface TeamMemberAssertionOptions {
  isAdmin?: boolean;
  isOwner?: boolean;
}

class TeamMemberPolicy {
  constructor(private team: Team, private teamMembers: TeamMember[]) {}

  isActive(userId: string) {
    return this.teamMembers.some(
      (teamMember) => teamMember.userId === userId && teamMember.isActive
    );
  }

  isAdmin(userId: string) {
    return this.teamMembers.some(
      (teamMember) =>
        teamMember.userId === userId &&
        teamMember.isActive &&
        teamMember.isAdmin
    );
  }

  isOwner(userId: string) {
    return this.team.ownedByUserId === userId;
  }

  hasUser(userId: string) {
    return this.teamMembers.some((teamMember) => teamMember.userId === userId);
  }

  getByUserId(userId: string) {
    if (!this.isActive(userId))
      throw new TeamPrivilegesError("Not a team member");

    return {
      isAdmin: this.isAdmin(userId),
      isOwner: this.isOwner(userId),
    };
  }

  getAll() {
    return this.teamMembers.map((teamMember) => ({
      isActive: teamMember.isActive,
      isAdmin: teamMember.isAdmin,
      isOwner: this.isOwner(teamMember.user.id),
      user: {
        id: teamMember.user.id,
      },
    }));
  }

  isTeamMemberOrThrow(
    user: User,
    { isAdmin = false, isOwner = false }: TeamMemberAssertionOptions = {}
  ) {
    if (!this.isActive(user.id))
      throw new TeamPrivilegesError("Not a team member");
    if (isAdmin && !this.isAdmin(user.id))
      throw new TeamPrivilegesError("Not a team admin");
    if (isOwner && !this.isOwner(user.id))
      throw new TeamPrivilegesError("Not a team owner");
  }
}

export class TeamPrivilegesError extends Error {
  constructor(message: string) {
    super(`Insufficent team privileges. ${message}`);
    this.name = "TeamPermissionError";
  }
}

export { TeamMemberPolicy };
