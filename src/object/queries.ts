import { getS3Client } from "@/bucket/internal";
import type { List } from "./schema";
import type { ListResult } from "./types";
import { getFileType } from "./utils";

const OBJECTS_PER_PAGE = 10;

export async function list(userId: string, input: List): Promise<ListResult> {
  const client = await getS3Client(userId, input.bucketId);

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
        type: getFileType(obj.key),
      }),
    );

  const nextCursor = hasMore ? objects[objects.length - 1]?.key : null;

  return {
    objects,
    nextCursor,
    hasMore,
  };
}
