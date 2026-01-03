import { z } from "zod";

export const List = z.object({
  bucketId: z.string(),
  prefix: z.string().optional(),
  cursor: z.string().optional(),
});

export type List = z.infer<typeof List>;
