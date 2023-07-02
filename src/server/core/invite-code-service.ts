import type { PrismaClient, Team, User } from "@prisma/client";
import type { TeamMemberService } from "./team-member-service";
import { add } from "date-fns";

class InviteCodeService {
  static INVITE_CODE_TOKEN_LENGTH = 10;
  static DEFAULT_EXPIRATION_DAYS = 7;

  constructor(
    private prisma: PrismaClient,
    private teamMemberService: TeamMemberService
  ) {}

  async create(
    team: Team,
    createdByUser: User,
    inviteeEmailAddress: string,
    expirationDays: number = InviteCodeService.DEFAULT_EXPIRATION_DAYS
  ) {
    const teamMemberPolicy = await this.teamMemberService.getPolicyByTeam(team);

    teamMemberPolicy.isTeamMemberOrThrow(createdByUser, { isAdmin: true });

    return this.prisma.inviteCode.create({
      data: {
        teamId: team.id,
        invitedByUserId: createdByUser.id,
        emailAddress: inviteeEmailAddress,
        expiresAt: add(new Date(), { days: expirationDays }),
        token: InviteCodeService.generateToken(),
      },
      include: {
        invitedByUser: true,
        team: true,
      },
    });
  }

  async getByToken(token: string) {
    const inviteCode = await this.prisma.inviteCode.findFirst({
      where: {
        token,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        team: true,
        invitedByUser: true,
      },
    });

    if (inviteCode === null) throw new InvalidInviteCodeError(token);

    return inviteCode;
  }

  async useToken(token: string, usedByUser: User) {
    const inviteCode = await this.getByToken(token);

    const teamMemberPolicy = await this.teamMemberService.getPolicyByTeam(
      inviteCode.team
    );

    if (!teamMemberPolicy.isActive(inviteCode.invitedByUser.id))
      throw new InvalidInviteCodeError(token);

    await this.teamMemberService.addUserToTeam(inviteCode.team, usedByUser);

    await this.prisma.inviteCode.update({
      data: {
        isUsed: true,
        usedAt: new Date(),
      },
      where: {
        id: inviteCode.id,
      },
    });
  }

  static generateToken(
    length: number = InviteCodeService.INVITE_CODE_TOKEN_LENGTH
  ) {
    let result = "";
    const characters = "abcdefghijklmnopqrstuvxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;

    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }

    return result;
  }
}

export class InvalidInviteCodeError extends Error {
  constructor(token: string) {
    super(`The invite code ${token} is invalid`);
    this.name = "InvalidInviteCodeError";
  }
}

export { InviteCodeService };
