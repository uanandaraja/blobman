import { and, eq } from "drizzle-orm";
import { encrypt } from "@/lib/crypto";
import { AppError } from "@/lib/error";
import { db } from "@/server/db";
import { bucket as bucketTable } from "@/server/db/schema";
import { createS3Client } from "./client";
import type { Create } from "./schema";
import type { Info } from "./types";

function generateId(): string {
  return crypto.randomUUID();
}

export async function testConnection(input: Create): Promise<boolean> {
  try {
    const client = createS3Client({
      endpoint: input.endpoint,
      region: input.region,
      bucketName: input.bucketName,
      accessKeyId: input.accessKeyId,
      secretAccessKey: input.secretAccessKey,
    });

    // Try to list objects (max 1) to verify credentials
    await client.list({ maxKeys: 1 });
    return true;
  } catch (error) {
    console.error("S3 connection test failed:", error);
    return false;
  }
}

export async function create(userId: string, input: Create): Promise<Info> {
  // Test connection before saving
  const isValid = await testConnection(input);
  if (!isValid) {
    throw AppError.badRequest(
      "Could not connect to bucket with provided credentials",
      "INVALID_CREDENTIALS",
    );
  }

  const id = generateId();
  const now = new Date();

  const [created] = await db
    .insert(bucketTable)
    .values({
      id,
      userId,
      name: input.name,
      endpoint: input.endpoint,
      region: input.region ?? null,
      bucketName: input.bucketName,
      accessKeyId: encrypt(input.accessKeyId),
      secretAccessKey: encrypt(input.secretAccessKey),
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return {
    id: created.id,
    name: created.name,
    endpoint: created.endpoint,
    region: created.region,
    bucketName: created.bucketName,
    createdAt: created.createdAt,
    updatedAt: created.updatedAt,
  };
}

export async function remove(userId: string, id: string): Promise<void> {
  const [deleted] = await db
    .delete(bucketTable)
    .where(and(eq(bucketTable.id, id), eq(bucketTable.userId, userId)))
    .returning({ id: bucketTable.id });

  if (!deleted) {
    throw AppError.notFound("Bucket not found");
  }
}
