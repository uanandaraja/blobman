import { createTRPCRouter, publicProcedure } from "./trpc";
import { bucketRouter } from "./routers/bucket";

export const appRouter = createTRPCRouter({
  healthCheck: publicProcedure.query(() => {
    return { status: "ok" };
  }),
  bucket: bucketRouter,
});

export type AppRouter = typeof appRouter;
