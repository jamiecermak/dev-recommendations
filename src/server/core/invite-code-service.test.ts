import { type MockedService, createMockedService } from "~/utils/mock-services";
import { InviteCodeService } from "./invite-code-service";
import {
  type MockedPrismaClient,
  createMockedPrisma,
} from "~/utils/mock-prisma";
import {
  inviteCodeFixture,
  teamFixture,
  teamMemberPolicyFixture,
  userFixture,
} from "~/utils/test-fixtures";
import type { TeamMemberService } from "./team-member-service";
import type { InviteCode } from "@prisma/client";

let inviteCodeService: InviteCodeService;
let mockPrisma: MockedPrismaClient;
let mockTeamMemberService: MockedService<TeamMemberService>;

beforeEach(() => {
  jest.resetAllMocks();
  jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));

  mockPrisma = createMockedPrisma();
  mockTeamMemberService = createMockedService<TeamMemberService>();
  inviteCodeService = new InviteCodeService(mockPrisma, mockTeamMemberService);
});

it("should generate a token", () => {
  expect(InviteCodeService.generateToken(10)).toHaveLength(10);
});

describe("creating an invite code", () => {
  it("should throw if the user is not a team member", async () => {
    mockTeamMemberService.getPolicyByTeam.mockResolvedValue(
      teamMemberPolicyFixture
    );

    await expect(
      inviteCodeService.create(
        teamFixture,
        {
          ...userFixture,
          id: "inactive-team-member",
        },
        "test@example.com"
      )
    ).rejects.toThrow("Insufficent team privileges. Not a team member");

    expect(mockTeamMemberService.getPolicyByTeam).toHaveBeenCalledWith(
      teamFixture
    );
  });

  it("should throw if the user is not an admin", async () => {
    mockTeamMemberService.getPolicyByTeam.mockResolvedValue(
      teamMemberPolicyFixture
    );

    await expect(
      inviteCodeService.create(
        teamFixture,
        {
          ...userFixture,
          id: "regular-team-member",
        },
        "test@example.com"
      )
    ).rejects.toThrow("Insufficent team privileges. Not a team admin");

    expect(mockTeamMemberService.getPolicyByTeam).toHaveBeenCalledWith(
      teamFixture
    );
  });

  it("should create an invite code", async () => {
    mockTeamMemberService.getPolicyByTeam.mockResolvedValue(
      teamMemberPolicyFixture
    );
    mockPrisma.inviteCode.create.mockResolvedValue(inviteCodeFixture);

    const inviteCode = await inviteCodeService.create(
      teamFixture,
      {
        ...userFixture,
        id: "admin-team-member",
      },
      "test@example.com",
      10
    );

    expect(inviteCode).toMatchObject(inviteCodeFixture);
    expect(mockPrisma.inviteCode.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          emailAddress: "test@example.com",
          expiresAt: new Date("2020-01-11"),
          invitedByUserId: "admin-team-member",
          teamId: teamFixture.id,
          token: expect.any(String) as string,
        },
      })
    );
  });
});

describe("getting a invite code by token", () => {
  it("should throw if it does not exist", async () => {
    mockPrisma.inviteCode.findFirst.mockResolvedValue(null);

    await expect(inviteCodeService.getByToken("test-token")).rejects.toThrow(
      "The invite code test-token is invalid"
    );
  });

  it("should return an invite code", async () => {
    mockPrisma.inviteCode.findFirst.mockResolvedValue(inviteCodeFixture);

    await expect(
      inviteCodeService.getByToken("test-token")
    ).resolves.toMatchObject(inviteCodeFixture);
  });
});

describe("using an invite code", () => {
  it("should throw if it does not exist", async () => {
    mockPrisma.inviteCode.findFirst.mockResolvedValue(null);

    await expect(
      inviteCodeService.useToken("test-token", userFixture)
    ).rejects.toThrow("The invite code test-token is invalid");
  });

  it("should throw if the inviter is no longer active", async () => {
    mockTeamMemberService.getPolicyByTeam.mockResolvedValue(
      teamMemberPolicyFixture
    );
    mockPrisma.inviteCode.findFirst.mockResolvedValue({
      ...inviteCodeFixture,
      team: teamFixture,
      invitedByUser: {
        ...userFixture,
        id: "inactive-team-member",
      },
    } as InviteCode);

    await expect(
      inviteCodeService.useToken("test-token", userFixture)
    ).rejects.toThrow("The invite code test-token is invalid");
  });

  it("should add the user to the team", async () => {
    mockTeamMemberService.getPolicyByTeam.mockResolvedValue(
      teamMemberPolicyFixture
    );
    mockPrisma.inviteCode.findFirst.mockResolvedValue({
      ...inviteCodeFixture,
      team: teamFixture,
      invitedByUser: {
        ...userFixture,
        id: "admin-team-member",
      },
    } as InviteCode);

    await inviteCodeService.useToken("test-token", userFixture);

    expect(mockTeamMemberService.addUserToTeam).toHaveBeenCalledWith(
      teamFixture,
      userFixture
    );
    expect(mockPrisma.inviteCode.update).toHaveBeenCalledWith({
      data: {
        isUsed: true,
        usedAt: new Date("2020-01-01"),
      },
      where: {
        id: "invite-code-id",
      },
    });
  });
});
