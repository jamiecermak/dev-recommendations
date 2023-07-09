import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const postsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        title: z
          .string()
          .min(5, "Title cannot be less than 5 characters.")
          .max(25, "Title cannot be more than 25 characters."),
        description: z
          .string()
          .min(5, "Description cannot be less than 5 characters.")
          .max(50, "Description cannot be more than 50 characters."),
        href: z
          .string()
          .url("Must be a URL")
          .min(5, "URL cannot be less than 5 characters.")
          .max(250, "URL cannot be more than 250 characters."),
        tags: z
          .array(z.string())
          .min(1, "Must select at least one tag")
          .max(15, "Must not have more than 15 tags")
          .default([]),
        postType: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { team } =
        await ctx.services.authGuard.authoriseByTeamMemberWithUser(
          ctx.user,
          input.teamId
        );

      return ctx.services.posts.create({
        team,
        createdByUser: ctx.user,
        title: input.title,
        description: input.description,
        postType: input.postType,
        href: input.href,
        tags: input.tags,
      });
    }),
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

      return ctx.services.posts.getLatestByTeam(team);
    }),
});
