"use client";

import { Plus } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import { AddBucketDialog } from "@/components/bucket/add-bucket-dialog";
import { BucketList } from "@/components/bucket/bucket-list";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [isAddOpen, setIsAddOpen] = useQueryState(
    "add",
    parseAsBoolean.withDefault(false),
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Your Buckets</h2>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Bucket
        </Button>
      </div>

      <BucketList />

      <AddBucketDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
    </div>
  );
}
