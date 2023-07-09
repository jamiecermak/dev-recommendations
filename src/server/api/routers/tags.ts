import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const tagsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.services.tags.getAll();
  }),
});
