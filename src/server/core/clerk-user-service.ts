import { type PrismaClient } from "@prisma/client";
import { type ClerkUserAPI } from "~/utils/clerk";

class ClerkUserService {
  constructor(
    private prisma: PrismaClient,
    private clerkUserAPI: ClerkUserAPI
  ) {}

  private async getUserByClerkIdOrThrow(clerkUserId: string) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        clerkId: clerkUserId,
      },
    });

    if (existingUser === null) throw new UserNotFoundError();

    return existingUser;
  }

  async getOrCreateUser(
    userId: string,
    firstName: string,
    lastName: string,
    emailAddress: string
  ) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        clerkId: userId,
      },
    });

    if (existingUser !== null) return existingUser;

    return this.prisma.user.create({
      data: {
        clerkId: userId,
        firstName,
        lastName,
        emailAddress,
        isActive: true,
      },
    });
  }

  async updateUser(
    userId: string,
    firstName: string,
    lastName: string,
    emailAddress: string
  ) {
    const user = await this.getOrCreateUser(
      userId,
      firstName,
      lastName,
      emailAddress
    );

    return this.prisma.user.update({
      data: {
        firstName,
        lastName,
        emailAddress,
        isActive: true,
      },
      where: {
        id: user.id,
      },
    });
  }

  async deactivateUser(userId: string) {
    const user = await this.getUserByClerkIdOrThrow(userId);

    return this.prisma.user.update({
      data: {
        isActive: false,
      },
      where: {
        id: user.id,
      },
    });
  }

  async authenticateById(userId: string | null) {
    if (userId === null) throw new UnauthorizedError();

    const clerkUser = await this.clerkUserAPI.getUser(userId);

    if (
      clerkUser.firstName === null ||
      clerkUser.lastName === null ||
      clerkUser.emailAddresses.length === 0 ||
      !clerkUser.emailAddresses[0]?.emailAddress
    ) {
      throw new InvalidClerkUser();
    }

    try {
      const user = await this.getOrCreateUser(
        userId,
        clerkUser.firstName,
        clerkUser.lastName,
        clerkUser.emailAddresses[0].emailAddress
      );

      return [user, clerkUser] as const;
    } catch (ex) {
      throw new UnauthorizedError();
    }
  }
}

export class InvalidClerkUser extends Error {
  constructor() {
    super(`Invalid Clerk User`);
    this.name = "InvalidClerkUser";
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super(`Failed to authenticate`);
    this.name = "UnauthorizedError";
  }
}

export class UserNotFoundError extends Error {
  constructor() {
    super("User not found");
    this.name = "UserNotFoundError";
  }
}

export { ClerkUserService };
