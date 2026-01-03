import { and, eq } from "drizzle-orm";
import { db } from "@/server/db";
import { bucket as bucketTable } from "@/server/db/schema";
import type { Info } from "./types";

export async function list(userId: string): Promise<Info[]> {
  const buckets = await db
    .select({
      id: bucketTable.id,
      name: bucketTable.name,
      endpoint: bucketTable.endpoint,
      region: bucketTable.region,
      bucketName: bucketTable.bucketName,
      createdAt: bucketTable.createdAt,
      updatedAt: bucketTable.updatedAt,
    })
    .from(bucketTable)
    .where(eq(bucketTable.userId, userId));

  return buckets;
}

export async function get(userId: string, id: string): Promise<Info | null> {
  const [bucket] = await db
    .select({
      id: bucketTable.id,
      name: bucketTable.name,
      endpoint: bucketTable.endpoint,
      region: bucketTable.region,
      bucketName: bucketTable.bucketName,
      createdAt: bucketTable.createdAt,
      updatedAt: bucketTable.updatedAt,
    })
    .from(bucketTable)
    .where(and(eq(bucketTable.id, id), eq(bucketTable.userId, userId)));

  return bucket ?? null;
}
