import type { PrismaClient } from "@prisma/client";

class PostTypeService {
  constructor(private prisma: PrismaClient) {}

  async getAll() {
    return this.prisma.postType.findMany();
  }
}

export { PostTypeService };
