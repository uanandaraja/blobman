import { z } from "zod";

export const Create = z.object({
  name: z.string().min(1).max(100),
  endpoint: z.string().url(),
  region: z.string().optional(),
  bucketName: z.string().min(1),
  accessKeyId: z.string().min(1),
  secretAccessKey: z.string().min(1),
});

export type Create = z.infer<typeof Create>;

export const ListObjects = z.object({
  bucketId: z.string(),
  prefix: z.string().optional(),
  cursor: z.string().optional(),
});

export type ListObjects = z.infer<typeof ListObjects>;
