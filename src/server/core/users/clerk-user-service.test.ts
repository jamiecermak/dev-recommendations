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
    mockPrisma.user.findFirst.mockResolvedValue(null);
    mockClerkUserAPI.getUser.mockRejectedValue(new Error("Failed"));

    await expect(userService.authenticateById("failed-id")).rejects.toThrow(
      "Failed"
    );
    expect(mockClerkUserAPI.getUser).toHaveBeenCalledWith("failed-id");
  });

  it("should throw if the clerk user has no first name", async () => {
    mockPrisma.user.findFirst.mockResolvedValue(null);
    mockClerkUserAPI.getUser.mockResolvedValue({
      ...clerkUserFixture,
      firstName: null,
    });

    await expect(userService.authenticateById("clerk-user-id")).rejects.toThrow(
      "Invalid Clerk User"
    );

    expect(mockPrisma.user.create).not.toHaveBeenCalled();
  });

  it("should throw if the clerk user has no last name", async () => {
    mockPrisma.user.findFirst.mockResolvedValue(null);
    mockClerkUserAPI.getUser.mockResolvedValue({
      ...clerkUserFixture,
      lastName: null,
    });

    await expect(userService.authenticateById("clerk-user-id")).rejects.toThrow(
      "Invalid Clerk User"
    );

    expect(mockPrisma.user.create).not.toHaveBeenCalled();
  });

  it("should throw if the clerk user has no email addresses", async () => {
    mockPrisma.user.findFirst.mockResolvedValue(null);
    mockClerkUserAPI.getUser.mockResolvedValue({
      ...clerkUserFixture,
      emailAddresses: [],
    });

    await expect(userService.authenticateById("clerk-user-id")).rejects.toThrow(
      "Invalid Clerk User"
    );

    expect(mockPrisma.user.create).not.toHaveBeenCalled();
  });

  describe("when the user already exists", () => {
    beforeEach(() => {
      mockPrisma.user.findFirst.mockResolvedValue(dbUserFixture);
    });

    it("should not request the user from clerk", async () => {
      const user = await userService.authenticateById("clerk-user-id");

      expect(user).toMatchObject(dbUserFixture);

      expect(mockClerkUserAPI.getUser).not.toHaveBeenCalled();
    });
  });

  describe("when clerk auth passes", () => {
    beforeEach(() => {
      mockClerkUserAPI.getUser.mockResolvedValue(clerkUserFixture);
    });

    it("should not create a user if it already exists", async () => {
      mockPrisma.user.findFirst.mockResolvedValue(dbUserFixture);

      const user = await userService.authenticateById("clerk-user-id");

      expect(user).toMatchObject(dbUserFixture);
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });

    it("should create a user if it does not exist yet", async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(dbUserFixture);

      const newUser = await userService.authenticateById("new-clerk-user-id");

      expect(newUser).toMatchObject(dbUserFixture);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          clerkId: "new-clerk-user-id",
          firstName: clerkUserFixture.firstName,
          lastName: clerkUserFixture.lastName,
          emailAddress: "johnsmith@example.com",
          isActive: true,
        },
      });
    });
  });
});

describe("deactivating a user", () => {
  it("should throw if the user does not exist", async () => {
    mockPrisma.user.findFirst.mockResolvedValue(null);

    await expect(userService.deactivateUser("clerk-user-id")).rejects.toThrow(
      "User not found"
    );
    expect(mockPrisma.user.update).not.toHaveBeenCalled();
  });

  it("should set isActive to false", async () => {
    mockPrisma.user.findFirst.mockResolvedValue(dbUserFixture);

    await userService.deactivateUser("clerk-user-id");

    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      data: {
        isActive: false,
      },
      where: {
        id: dbUserFixture.id,
      },
    });

    expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
      where: {
        clerkId: "clerk-user-id",
      },
    });
  });
});
