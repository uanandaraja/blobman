"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { ObjectsTable } from "@/components/bucket/objects-table";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

interface BucketDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function BucketDetailPage({ params }: BucketDetailPageProps) {
  const { id } = use(params);
  const { data: bucket, isLoading } = trpc.bucket.get.useQuery({ id });

  if (isLoading) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  if (!bucket) {
    return (
      <div>
        <p className="text-destructive">Bucket not found.</p>
        <Button asChild variant="ghost" className="mt-4">
          <Link href="/app">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to buckets
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button asChild variant="ghost" size="icon">
          <Link href="/app">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{bucket.name}</h2>
          <p className="text-sm text-muted-foreground">
            {bucket.bucketName}
            {bucket.region && ` · ${bucket.region}`}
          </p>
        </div>
      </div>

      <ObjectsTable bucketId={id} />
    </div>
  );
}
