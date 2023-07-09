import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const postDiscoveryRouter = createTRPCRouter({
  getLatestByTeam: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { team } =
        await ctx.services.authGuard.authoriseByTeamMemberWithUser(
          ctx.user,
          input.teamId
        );

      return ctx.services.postDiscovery.getLatestByTeam(team);
    }),

  getLatestAllTeams: protectedProcedure.query(async ({ ctx }) => {
    return ctx.services.postDiscovery.getLatestByUser(ctx.user);
  }),
});
