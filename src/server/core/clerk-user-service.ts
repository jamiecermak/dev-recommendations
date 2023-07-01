import { type PrismaClient } from "@prisma/client";

class ClerkUserService {
  constructor(private prisma: PrismaClient) {}

  async getOrCreateFromClerkUserId(userId: string) {
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
}

export { ClerkUserService };
