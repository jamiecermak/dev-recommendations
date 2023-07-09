import { createTRPCRouter } from "~/server/api/trpc";
import { teamsRouter } from "./routers/teams";
import { teamMembersRouter } from "./routers/team-members";
import { teamInvitesRouter } from "./routers/team-invites";
import { tagsRouter } from "./routers/tags";
import { postTypesRouter } from "./routers/post-types";
import { postsRouter } from "./routers/posts";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  teams: teamsRouter,
  teamMembers: teamMembersRouter,
  teamInvites: teamInvitesRouter,
  tags: tagsRouter,
  postTypes: postTypesRouter,
  posts: postsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
