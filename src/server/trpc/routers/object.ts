import { BucketObject } from "@/object";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const objectRouter = createTRPCRouter({
  list: protectedProcedure
    .input(BucketObject.List)
    .query(({ ctx, input }) => BucketObject.list(ctx.session.user.id, input)),
});
