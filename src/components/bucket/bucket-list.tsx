"use client";

import { trpc } from "@/lib/trpc";
import { BucketCard } from "./bucket-card";

export function BucketList() {
  const { data: buckets, isLoading } = trpc.bucket.list.useQuery();

  if (isLoading) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  if (!buckets || buckets.length === 0) {
    return (
      <p className="text-muted-foreground">
        No buckets yet. Add your first bucket to get started.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
      {buckets.map((bucket) => (
        <BucketCard key={bucket.id} bucket={bucket} />
      ))}
    </div>
  );
}
