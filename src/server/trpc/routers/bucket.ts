import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { Bucket } from "@/bucket";

export const bucketRouter = createTRPCRouter({
  list: protectedProcedure.query(({ ctx }) => Bucket.list(ctx.session.user.id)),

  create: protectedProcedure
    .input(Bucket.Create)
    .mutation(({ ctx, input }) => Bucket.create(ctx.session.user.id, input)),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => Bucket.get(ctx.session.user.id, input.id)),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => Bucket.remove(ctx.session.user.id, input.id)),

  testConnection: protectedProcedure
    .input(Bucket.Create)
    .mutation(({ input }) => Bucket.testConnection(input)),

  listObjects: protectedProcedure
    .input(Bucket.ListObjects)
    .query(({ ctx, input }) => Bucket.listObjects(ctx.session.user.id, input)),
});
