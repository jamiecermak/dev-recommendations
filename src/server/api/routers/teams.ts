import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TeamsService } from "~/server/core/teams-service";

export const teamsRouter = createTRPCRouter({
  createTeam: protectedProcedure
    .input(
      z.object({
        name: z.string().max(50, "Must be less than 50 characters"),
      })
    )
    .mutation(({ ctx, input }) => {
        const teamsService = new TeamsService(ctx.prisma);

        return teamsService.createTeam(input.name, ctx.user)
    }),
  getTeamById: protectedProcedure
    .input(
      z.object({
        id: z.string().max(50, "Must be less than 50 characters"),
      })
    )
    .query(({ ctx, input }) => {
        const teamsService = new TeamsService(ctx.prisma);

        return teamsService.getByIdOrThrow(input.id)
    }),
});
