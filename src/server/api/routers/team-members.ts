import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const teamMembersRouter = createTRPCRouter({
  getTeamMembersById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { teamMemberPolicy } =
        await ctx.services.authGuard.authoriseByTeamMemberWithUser(
          ctx.user,
          input.id
        );

      return teamMemberPolicy.getAll();
    }),

  getTeamMembership: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { team, teamMemberPolicy } =
        await ctx.services.authGuard.authoriseByTeamMemberWithUser(
          ctx.user,
          input.teamId
        );

      return { team, membership: teamMemberPolicy.getByUserId(ctx.user.id) };
    }),
});
