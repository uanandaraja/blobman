"use client";

import { Plus } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import { AddBucketDialog } from "@/components/bucket/add-bucket-dialog";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

export default function DashboardPage() {
  const [isAddOpen, setIsAddOpen] = useQueryState(
    "add",
    parseAsBoolean.withDefault(false),
  );

  const { data: buckets, isLoading } = trpc.bucket.list.useQuery();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Your Buckets</h2>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Bucket
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : buckets?.length === 0 ? (
        <p className="text-muted-foreground">
          No buckets yet. Add your first bucket to get started.
        </p>
      ) : (
        <div className="grid gap-4">
          {/* Bucket list placeholder - will be implemented later */}
          {buckets?.map((bucket) => (
            <div
              key={bucket.id}
              className="border rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium">{bucket.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {bucket.bucketName} · {bucket.endpoint}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddBucketDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
    </div>
  );
}
