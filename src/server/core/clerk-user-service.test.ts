import {
  createMockedPrisma,
  type MockedPrismaClient,
} from "~/utils/mock-prisma";
import { ClerkUserService } from "./clerk-user-service";
import {
  clerkUserFixture,
  userFixture as dbUserFixture,
} from "~/utils/test-fixtures";
import {
  createMockedClerkUserAPI,
  type MockedClerkUserAPI,
} from "~/utils/mock-clerk";

let userService: ClerkUserService;
let mockPrisma: MockedPrismaClient;
let mockClerkUserAPI: MockedClerkUserAPI;

beforeEach(() => {
  jest.resetAllMocks();

  mockPrisma = createMockedPrisma();
  mockClerkUserAPI = createMockedClerkUserAPI();
  userService = new ClerkUserService(mockPrisma, mockClerkUserAPI);
});

describe("authenticating a user from a clerk user id", () => {
  it("should throw if user id is null", async () => {
    await expect(userService.authenticateById(null)).rejects.toThrow(
      "Failed to authenticate"
    );
  });

  it("should throw if it fails to get a clerk user", async () => {
    mockClerkUserAPI.getUser.mockRejectedValue(new Error());

    await expect(userService.authenticateById("failed-id")).rejects.toThrow(
      "Failed to authenticate"
    );
    expect(mockClerkUserAPI.getUser).toHaveBeenCalledWith("failed-id");
  });

  describe("when clerk auth passes", () => {
    beforeEach(() => {
      mockClerkUserAPI.getUser.mockResolvedValue(clerkUserFixture);
    });

    it("should not create a user if it already exists", async () => {
      mockPrisma.user.findFirst.mockResolvedValue(dbUserFixture);

      const [user, clerkUser] = await userService.authenticateById(
        "clerk-user-id"
      );

      expect(user).toMatchObject(dbUserFixture);
      expect(clerkUser).toMatchObject(clerkUserFixture);
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });

    it("should create a user if it does not exist yet", async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(dbUserFixture);

      const [newUser, clerkUser] = await userService.authenticateById(
        "new-clerk-user-id"
      );

      expect(newUser).toMatchObject(dbUserFixture);
      expect(clerkUser).toMatchObject(clerkUserFixture);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          clerkId: "new-clerk-user-id",
          isActive: true,
        },
      });
    });
  });
});
