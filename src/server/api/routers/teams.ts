import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const teamsRouter = createTRPCRouter({
  createTeam: protectedProcedure
    .input(
      z.object({
        name: z.string().max(50, "Must be less than 50 characters"),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.services.teams.createTeam(input.name, ctx.user);
    }),

  getTeamById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { team } =
        await ctx.services.authGuard.authoriseByTeamMemberWithUser(
          ctx.user,
          input.id
        );

      return team;
    }),

  getMyTeams: protectedProcedure.query(async ({ ctx }) => {
    return ctx.services.teamMember.getAllByUser(ctx.user);
  }),
});
