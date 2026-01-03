import { bucketRouter } from "./routers/bucket";
import { objectRouter } from "./routers/object";
import { createTRPCRouter, publicProcedure } from "./trpc";

export const appRouter = createTRPCRouter({
  healthCheck: publicProcedure.query(() => {
    return { status: "ok" };
  }),
  bucket: bucketRouter,
  object: objectRouter,
});

export type AppRouter = typeof appRouter;
