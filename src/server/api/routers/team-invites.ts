import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const teamInvitesRouter = createTRPCRouter({
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

      const inviteCode = await ctx.services.inviteCode.create(
        team,
        ctx.user,
        input.emailAddress
      );

      await ctx.services.emailTemplateService.sendJoinTeamInvitationEmail(
        inviteCode.token,
        input.emailAddress,
        inviteCode.team,
        inviteCode.invitedByUser
      );
    }),

  createInviteCode: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { team } =
        await ctx.services.authGuard.authoriseByTeamMemberWithUser(
          ctx.user,
          input.teamId,
          { isAdmin: true }
        );

      const newInviteCode = await ctx.services.inviteCode.create(
        team,
        ctx.user,
        null
      );

      return { token: newInviteCode.token };
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
});
