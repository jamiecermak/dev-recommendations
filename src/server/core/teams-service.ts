import type { User, PrismaClient } from "@prisma/client";

class TeamsService {
  constructor(private prisma: PrismaClient) {}

  async createTeam(name: string, createdByUser: User) {
    const newTeam = await this.prisma.team.create({
      data: {
        name,
        ownedByUserId: createdByUser.id,
        createdByUserId: createdByUser.id,
        teamMembers: {
          create: {
            isAdmin: true,
            userId: createdByUser.id,
          },
        },
      },
    });

    return newTeam;
  }

  async getById(id: string) {
    return this.prisma.team.findFirst({
      where: {
        id,
      },
    });
  }

  async getByIdOrThrow(id: string) {
    const team = await this.getById(id);

    if (team === null) throw new TeamNotFoundError(id);

    return team;
  }
}

export class TeamNotFoundError extends Error {
  constructor(id: string) {
    super(`Team ${id} could not be found`);
    this.name = "TeamNotFoundError";
  }
}

export { TeamsService };
