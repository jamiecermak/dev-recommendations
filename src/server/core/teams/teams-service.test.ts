import {
  createMockedPrisma,
  type MockedPrismaClient,
} from "~/utils/mock-prisma";
import { TeamsService } from "./teams-service";
import { teamFixture, userFixture } from "~/utils/test-fixtures";

let teamsService: TeamsService;
let mockPrisma: MockedPrismaClient;

beforeEach(() => {
  jest.resetAllMocks();

  mockPrisma = createMockedPrisma();
  teamsService = new TeamsService(mockPrisma);
});

describe("creating a team", () => {
  it("should create a team", async () => {
    mockPrisma.team.create.mockResolvedValue(teamFixture);

    const newTeam = await teamsService.createTeam(
      "My Awesome Team",
      "My team description",
      userFixture
    );

    expect(newTeam).toMatchObject(teamFixture);
    expect(mockPrisma.team.create).toHaveBeenCalledWith({
      data: {
        name: "My Awesome Team",
        description: "My team description",
        createdByUserId: userFixture.id,
        ownedByUserId: userFixture.id,
        teamMembers: {
          create: {
            isAdmin: true,
            userId: userFixture.id,
          },
        },
      },
    });
  });
});

describe("getting a team", () => {
  it("should return a team by id", async () => {
    mockPrisma.team.findFirst.mockResolvedValue(teamFixture);

    const newTeam = await teamsService.getById("team-id");

    expect(newTeam).toMatchObject(teamFixture);
    expect(mockPrisma.team.findFirst).toHaveBeenCalledWith({
      where: {
        id: "team-id",
      },
    });
  });

  it("should return null if it cannot find the team", async () => {
    mockPrisma.team.findFirst.mockResolvedValue(null);

    const newTeam = await teamsService.getById("team-id");

    expect(newTeam).toBeNull();
  });
});

describe("getting a team or throwing", () => {
  it("should return a team by id", async () => {
    mockPrisma.team.findFirst.mockResolvedValue(teamFixture);

    const newTeam = await teamsService.getByIdOrThrow("team-id");

    expect(newTeam).toMatchObject(teamFixture);
    expect(mockPrisma.team.findFirst).toHaveBeenCalledWith({
      where: {
        id: "team-id",
      },
    });
  });

  it("should throw if it cannot find the team", async () => {
    mockPrisma.team.findFirst.mockResolvedValue(null);

    await expect(teamsService.getByIdOrThrow("my-team-id")).rejects.toThrow(
      "Team my-team-id could not be found"
    );
  });
});
