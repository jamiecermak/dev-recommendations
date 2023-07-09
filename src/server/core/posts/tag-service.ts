import type { PrismaClient } from "@prisma/client";

class TagService {
  constructor(private prisma: PrismaClient) {}

  async getAll() {
    return this.prisma.tag.findMany();
  }
}

export { TagService };
