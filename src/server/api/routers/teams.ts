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
  inviteTeamMember: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        emailAddress: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { team } =
        await ctx.services.authGuard.authoriseByTeamMemberWithUser(
          ctx.user,
          input.teamId,
          { isAdmin: true }
        );

      await ctx.services.inviteCode.create(team, ctx.user, input.emailAddress);
    }),
  joinTeam: protectedProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const inviteCode = await ctx.services.inviteCode.useToken(
        input.token,
        ctx.user
      );

      return inviteCode.team;
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
