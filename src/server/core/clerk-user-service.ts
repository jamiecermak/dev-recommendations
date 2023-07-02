import { type PrismaClient } from "@prisma/client";
import { type ClerkUserAPI } from "~/utils/clerk";

class ClerkUserService {
  constructor(
    private prisma: PrismaClient,
    private clerkUserAPI: ClerkUserAPI
  ) {}

  private async getOrCreateUser(userId: string) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        clerkId: userId,
      },
    });

    if (existingUser !== null) return existingUser;

    return this.prisma.user.create({
      data: {
        clerkId: userId,
        isActive: true,
      },
    });
  }

  async authenticateById(userId: string | null) {
    if (userId === null) throw new UnauthorizedError();

    try {
      const clerkUser = await this.clerkUserAPI.getUser(userId);

      const user = await this.getOrCreateUser(userId);

      return [user, clerkUser] as const;
    } catch {
      throw new UnauthorizedError();
    }
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super(`Failed to authenticate`);
    this.name = "UnauthorizedError";
  }
}

export { ClerkUserService };
