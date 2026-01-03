import { S3Client } from "bun";

export function createS3Client(credentials: {
  endpoint: string;
  region?: string | null;
  bucketName: string;
  accessKeyId: string;
  secretAccessKey: string;
}) {
  return new S3Client({
    endpoint: credentials.endpoint,
    region: credentials.region ?? undefined,
    bucket: credentials.bucketName,
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
  });
}
