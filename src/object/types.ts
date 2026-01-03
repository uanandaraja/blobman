export type Info = {
  key: string;
  size: number;
  lastModified: Date;
  etag: string;
  type: string;
};

export type ListResult = {
  objects: Info[];
  nextCursor: string | null;
  hasMore: boolean;
};
