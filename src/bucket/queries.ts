import { and, eq } from "drizzle-orm";
import { decrypt } from "@/lib/crypto";
import { AppError } from "@/lib/error";
import { db } from "@/server/db";
import { bucket as bucketTable } from "@/server/db/schema";
import { createS3Client } from "./client";
import type { ListObjects } from "./schema";
import type { Info, ListObjectsResult } from "./types";

const OBJECTS_PER_PAGE = 10;

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

async function getWithCredentials(userId: string, id: string) {
  const [bucket] = await db
    .select()
    .from(bucketTable)
    .where(and(eq(bucketTable.id, id), eq(bucketTable.userId, userId)));

  if (!bucket) return null;

  return {
    ...bucket,
    accessKeyId: decrypt(bucket.accessKeyId),
    secretAccessKey: decrypt(bucket.secretAccessKey),
  };
}

export async function listObjects(
  userId: string,
  input: ListObjects,
): Promise<ListObjectsResult> {
  const bucket = await getWithCredentials(userId, input.bucketId);
  if (!bucket) {
    throw AppError.notFound("Bucket not found");
  }

  const client = createS3Client({
    endpoint: bucket.endpoint,
    region: bucket.region,
    bucketName: bucket.bucketName,
    accessKeyId: bucket.accessKeyId,
    secretAccessKey: bucket.secretAccessKey,
  });

  const result = await client.list({
    prefix: input.prefix,
    maxKeys: OBJECTS_PER_PAGE + 1, // Fetch one extra to check if there are more
    startAfter: input.cursor,
  });

  const contents = result.contents ?? [];
  const hasMore = contents.length > OBJECTS_PER_PAGE;
  const objects = contents
    .slice(0, OBJECTS_PER_PAGE)
    .map(
      (obj: {
        key: string;
        size?: number;
        lastModified?: string;
        eTag?: string;
      }) => ({
        key: obj.key,
        size: obj.size ?? 0,
        lastModified: obj.lastModified
          ? new Date(obj.lastModified)
          : new Date(),
        etag: obj.eTag ?? "",
      }),
    );

  const nextCursor = hasMore ? objects[objects.length - 1]?.key : null;

  return {
    objects,
    nextCursor,
    hasMore,
  };
}
