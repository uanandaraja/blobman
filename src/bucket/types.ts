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
