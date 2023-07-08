import {
  createMockedPrisma,
  type MockedPrismaClient,
} from "~/utils/mock-prisma";
import {
  teamFixture,
  teamMemberFixture,
  userFixture,
} from "~/utils/test-fixtures";
import { TeamMemberService } from "./team-member-service";

let teamMemberService: TeamMemberService;
let mockPrisma: MockedPrismaClient;

beforeEach(() => {
  jest.resetAllMocks();
  jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));

  mockPrisma = createMockedPrisma();
  teamMemberService = new TeamMemberService(mockPrisma);
});

it("should retrieve a team member policy", async () => {
  mockPrisma.teamMember.findMany.mockResolvedValue([teamMemberFixture]);

  const policy = await teamMemberService.getPolicyByTeam(teamFixture);

  expect(mockPrisma.teamMember.findMany).toHaveBeenCalledWith({
    where: {
      teamId: teamFixture.id,
    },
    include: {
      user: true,
    },
  });
  expect(policy.getAll()).toMatchObject([
    {
      isActive: true,
      isAdmin: false,
      isOwner: false,
      user: {
        id: teamMemberFixture.user.id,
      },
    },
  ]);
});

describe("adding users", () => {
  it("should throw if the team members exists and is active", async () => {
    mockPrisma.teamMember.findMany.mockResolvedValue([
      {
        ...teamMemberFixture,
        userId: "existing-team-member",
        isActive: true,
      },
    ]);

    await expect(
      teamMemberService.addUserToTeam(teamFixture, {
        ...userFixture,
        id: "existing-team-member",
      })
    ).rejects.toThrow("Team member already exists and is active");
  });

  it("should reactivate the user if they were inactive", async () => {
    mockPrisma.teamMember.findMany.mockResolvedValue([
      {
        ...teamMemberFixture,
        userId: "existing-team-member",
        isActive: false,
      },
    ]);

    await teamMemberService.addUserToTeam(
      teamFixture,
      {
        ...userFixture,
        id: "existing-team-member",
      },
      true
    );
    expect(mockPrisma.teamMember.update).toHaveBeenCalledWith({
      data: {
        isActive: true,
        isAdmin: true,
        joinedAt: new Date("2020-01-01"),
      },
      where: {
        teamId_userId: {
          teamId: teamFixture.id,
          userId: "existing-team-member",
        },
      },
    });
  });

  it("should create the team member if they do not exist", async () => {
    mockPrisma.teamMember.findMany.mockResolvedValue([]);

    await teamMemberService.addUserToTeam(
      teamFixture,
      {
        ...userFixture,
        id: "new-team-member",
      },
      true
    );
    expect(mockPrisma.teamMember.create).toHaveBeenCalledWith({
      data: {
        teamId: teamFixture.id,
        userId: "new-team-member",
        isActive: true,
        isAdmin: true,
      },
    });
  });
});

describe("removing users", () => {
  it("should throw if the user tries to remove themselves", async () => {
    mockPrisma.teamMember.findMany.mockResolvedValue([
      {
        ...teamMemberFixture,
        isActive: true,
        isAdmin: true,
      },
    ]);

    await expect(
      teamMemberService.removeUserFromTeam(
        teamFixture,
        teamMemberFixture.user,
        teamMemberFixture.user
      )
    ).rejects.toThrow("Can not remove yourself");
    expect(mockPrisma.teamMember.update).not.toHaveBeenCalled();
  });

  it("should throw if the user is not an admin", async () => {
    mockPrisma.teamMember.findMany.mockResolvedValue([
      {
        ...teamMemberFixture,
        isActive: true,
        isAdmin: false,
      },
    ]);

    await expect(
      teamMemberService.removeUserFromTeam(
        teamFixture,
        { ...userFixture, id: "user-to-remove" },
        teamMemberFixture.user
      )
    ).rejects.toThrow("Insufficent team privileges. Not a team admin");
    expect(mockPrisma.teamMember.update).not.toHaveBeenCalled();
  });

  it("should throw if the user is the team owner", async () => {
    mockPrisma.teamMember.findMany.mockResolvedValue([
      {
        ...teamMemberFixture,
        isActive: true,
        isAdmin: true,
      },
    ]);

    await expect(
      teamMemberService.removeUserFromTeam(
        {
          ...teamFixture,
          ownedByUserId: "team-owner",
        },
        { ...userFixture, id: "team-owner" },
        teamMemberFixture.user
      )
    ).rejects.toThrow("Can not remove team owner");
    expect(mockPrisma.teamMember.update).not.toHaveBeenCalled();
  });

  it("should deactivate the user", async () => {
    mockPrisma.teamMember.findMany.mockResolvedValue([
      {
        ...teamMemberFixture,
        isActive: true,
        isAdmin: true,
      },
    ]);

    await teamMemberService.removeUserFromTeam(
      teamFixture,
      { ...userFixture, id: "user-to-remove" },
      teamMemberFixture.user
    );

    expect(mockPrisma.teamMember.update).toHaveBeenCalledWith({
      data: {
        isActive: false,
        isAdmin: false,
      },
      where: {
        teamId_userId: {
          teamId: teamFixture.id,
          userId: "user-to-remove",
        },
      },
    });
  });
});

describe("changing user admin status", () => {
  it("should throw if the user tries to change themselves", async () => {
    mockPrisma.teamMember.findMany.mockResolvedValue([
      {
        ...teamMemberFixture,
        isActive: true,
        isAdmin: true,
      },
    ]);

    await expect(
      teamMemberService.changeUserAdminStatus(
        teamFixture,
        teamMemberFixture.user,
        true,
        teamMemberFixture.user
      )
    ).rejects.toThrow("Can not change your own admin status");
    expect(mockPrisma.teamMember.update).not.toHaveBeenCalled();
  });

  it("should throw if the user is not an admin", async () => {
    mockPrisma.teamMember.findMany.mockResolvedValue([
      {
        ...teamMemberFixture,
        isActive: true,
        isAdmin: false,
      },
    ]);

    await expect(
      teamMemberService.changeUserAdminStatus(
        teamFixture,
        { ...userFixture, id: "user-to-change" },
        true,
        teamMemberFixture.user
      )
    ).rejects.toThrow("Insufficent team privileges. Not a team admin");
    expect(mockPrisma.teamMember.update).not.toHaveBeenCalled();
  });

  it("should throw if the user is the team owner", async () => {
    mockPrisma.teamMember.findMany.mockResolvedValue([
      {
        ...teamMemberFixture,
        isActive: true,
        isAdmin: true,
      },
    ]);

    await expect(
      teamMemberService.changeUserAdminStatus(
        {
          ...teamFixture,
          ownedByUserId: "team-owner",
        },
        { ...userFixture, id: "team-owner" },
        false,
        teamMemberFixture.user
      )
    ).rejects.toThrow("Can not change team owner admin status");
    expect(mockPrisma.teamMember.update).not.toHaveBeenCalled();
  });

  it("should change the users admin status", async () => {
    mockPrisma.teamMember.findMany.mockResolvedValue([
      {
        ...teamMemberFixture,
        isActive: true,
        isAdmin: true,
      },
    ]);

    await teamMemberService.changeUserAdminStatus(
      teamFixture,
      { ...userFixture, id: "user-to-change" },
      true,
      teamMemberFixture.user
    );

    expect(mockPrisma.teamMember.update).toHaveBeenCalledWith({
      data: {
        isAdmin: true,
      },
      where: {
        teamId_userId: {
          teamId: teamFixture.id,
          userId: "user-to-change",
        },
      },
    });
  });
});
