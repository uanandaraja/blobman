import { bucketRouter } from "./routers/bucket";
import { createTRPCRouter, publicProcedure } from "./trpc";

export const appRouter = createTRPCRouter({
  healthCheck: publicProcedure.query(() => {
    return { status: "ok" };
  }),
  bucket: bucketRouter,
});

export type AppRouter = typeof appRouter;
