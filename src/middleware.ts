import { authMiddleware } from "@clerk/nextjs/server";
import { ClerkUserService } from "./server/core/clerk-user-service";
import { prisma } from "./server/db";

export default authMiddleware({
  publicRoutes: ["/", "/join-team/:code"],
  afterAuth: async (auth) => {
    if (auth.userId === null || auth.userId === undefined) return

    const clerkUserService = new ClerkUserService(prisma);
    await clerkUserService.getOrCreateFromClerkUserId(auth.userId);
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)","/","/(api|trpc)(.*)"]
};