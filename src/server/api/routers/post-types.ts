import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const postTypesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.services.postTypes.getAll();
  }),
});
