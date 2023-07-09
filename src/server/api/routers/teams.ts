import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const teamsRouter = createTRPCRouter({
  createTeam: protectedProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(5, "Must be at least 5 characters")
          .max(25, "Must be less than 25 characters"),
        description: z
          .string()
          .min(5, "Must be at least 5 characters")
          .max(50, "Must be less than 50 characters"),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.services.teams.createTeam(
        input.name,
        input.description,
        ctx.user
      );
    }),

  updateTeam: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        description: z
          .string()
          .min(5, "Must be at least 5 characters")
          .max(50, "Must be less than 50 characters"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { team } =
        await ctx.services.authGuard.authoriseByTeamMemberWithUser(
          ctx.user,
          input.id,
          {
            isAdmin: true,
          }
        );

      return ctx.services.teams.updateTeam(team, input.description);
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
