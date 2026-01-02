import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db } from "@/server/db";
import { bucket as bucketTable } from "@/server/db/schema";
import { encrypt, decrypt } from "@/lib/crypto";
import { AppError } from "@/lib/error";

const OBJECTS_PER_PAGE = 10;

// Lazy load Bun's S3Client to avoid build-time errors with Next.js
async function getS3Client() {
  const { S3Client } = await import("bun");
  return S3Client;
}

export namespace Bucket {
  // ============ Schemas ============

  export const Create = z.object({
    name: z.string().min(1).max(100),
    endpoint: z.string().url(),
    region: z.string().optional(),
    bucketName: z.string().min(1),
    accessKeyId: z.string().min(1),
    secretAccessKey: z.string().min(1),
  });

  export const ListObjects = z.object({
    bucketId: z.string(),
    prefix: z.string().optional(),
    cursor: z.string().optional(),
  });

  // ============ Types ============

  export type Create = z.infer<typeof Create>;
  export type ListObjects = z.infer<typeof ListObjects>;

  export type Info = {
    id: string;
    name: string;
    endpoint: string;
    region: string | null;
    bucketName: string;
    createdAt: Date;
    updatedAt: Date;
  };

  export type ObjectInfo = {
    key: string;
    size: number;
    lastModified: Date;
    etag: string;
  };

  export type ListObjectsResult = {
    objects: ObjectInfo[];
    nextCursor: string | null;
    hasMore: boolean;
  };

  // ============ Internal Helpers ============

  function generateId(): string {
    return crypto.randomUUID();
  }

  async function createS3Client(credentials: {
    endpoint: string;
    region?: string | null;
    bucketName: string;
    accessKeyId: string;
    secretAccessKey: string;
  }) {
    const S3Client = await getS3Client();
    return new S3Client({
      endpoint: credentials.endpoint,
      region: credentials.region ?? undefined,
      bucket: credentials.bucketName,
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
    });
  }

  // ============ CRUD Operations ============

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

  export async function remove(userId: string, id: string): Promise<void> {
    const [deleted] = await db
      .delete(bucketTable)
      .where(and(eq(bucketTable.id, id), eq(bucketTable.userId, userId)))
      .returning({ id: bucketTable.id });

    if (!deleted) {
      throw AppError.notFound("Bucket not found");
    }
  }

  // ============ S3 Operations ============

  export async function testConnection(input: Create): Promise<boolean> {
    try {
      const client = await createS3Client({
        endpoint: input.endpoint,
        region: input.region,
        bucketName: input.bucketName,
        accessKeyId: input.accessKeyId,
        secretAccessKey: input.secretAccessKey,
      });

      // Try to list objects (max 1) to verify credentials
      await client.list({ maxKeys: 1 });
      return true;
    } catch {
      return false;
    }
  }

  export async function listObjects(
    userId: string,
    input: ListObjects,
  ): Promise<ListObjectsResult> {
    const bucket = await getWithCredentials(userId, input.bucketId);
    if (!bucket) {
      throw AppError.notFound("Bucket not found");
    }

    const client = await createS3Client({
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
}
