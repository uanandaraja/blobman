"use client";

import { Database } from "lucide-react";
import Link from "next/link";
import type { Bucket } from "@/bucket";

interface BucketCardProps {
  bucket: Bucket.Info;
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Added today";
  if (diffDays === 1) return "Added yesterday";
  if (diffDays < 30) return `Added ${diffDays} days ago`;
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `Added ${months} ${months === 1 ? "month" : "months"} ago`;
  }
  const years = Math.floor(diffDays / 365);
  return `Added ${years} ${years === 1 ? "year" : "years"} ago`;
}

export function BucketCard({ bucket }: BucketCardProps) {
  return (
    <Link
      href={`/app/buckets/${bucket.id}`}
      className="block border rounded-lg p-4 hover:border-foreground/50 transition-colors"
    >
      <Database className="h-8 w-8 text-muted-foreground" />
      <h3 className="font-medium mt-3">{bucket.name}</h3>
      <p className="text-sm text-muted-foreground mt-1">
        {bucket.bucketName}
        {bucket.region && ` · ${bucket.region}`}
      </p>
      <p className="text-xs text-muted-foreground mt-2">
        {formatRelativeTime(bucket.createdAt)}
      </p>
    </Link>
  );
}
