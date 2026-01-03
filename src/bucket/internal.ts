import { and, eq } from "drizzle-orm";
import { decrypt } from "@/lib/crypto";
import { AppError } from "@/lib/error";
import { db } from "@/server/db";
import { bucket as bucketTable } from "@/server/db/schema";
import { createS3Client } from "./client";

/**
 * Returns a configured S3 client for the specified bucket.
 * This is an internal function - use it from other modules that need
 * to interact with objects in a bucket without exposing credentials.
 */
export async function getS3Client(userId: string, bucketId: string) {
  const [bucket] = await db
    .select()
    .from(bucketTable)
    .where(and(eq(bucketTable.id, bucketId), eq(bucketTable.userId, userId)));

  if (!bucket) {
    throw AppError.notFound("Bucket not found");
  }

  return createS3Client({
    endpoint: bucket.endpoint,
    region: bucket.region,
    bucketName: bucket.bucketName,
    accessKeyId: decrypt(bucket.accessKeyId),
    secretAccessKey: decrypt(bucket.secretAccessKey),
  });
}
