"use client";

import { parseAsInteger, useQueryState } from "nuqs";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { trpc } from "@/lib/trpc";
import { columns } from "./columns";

interface ObjectsTableProps {
  bucketId: string;
}

export function ObjectsTable({ bucketId }: ObjectsTableProps) {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  // Cursor history: index 0 = page 1 cursor (undefined), index 1 = page 2 cursor, etc.
  const cursorsRef = useRef<Map<number, string | undefined>>(
    new Map([[1, undefined]]),
  );

  // If we don't have a cursor for the current page (e.g., page refresh on page 3),
  // we need to reset to page 1
  const hasCursorForPage = cursorsRef.current.has(page);
  const currentCursor = hasCursorForPage
    ? cursorsRef.current.get(page)
    : undefined;
  const effectivePage = hasCursorForPage ? page : 1;

  const { data, isLoading, isError } = trpc.object.list.useQuery({
    bucketId,
    cursor: currentCursor,
  });

  // Sync page state if we had to reset
  if (!hasCursorForPage && page !== 1) {
    setPage(1);
  }

  const objects = data?.objects ?? [];
  const hasMore = data?.hasMore ?? false;
  const canGoPrevious = effectivePage > 1;
  const canGoNext = hasMore;

  const handleNextPage = () => {
    if (data?.nextCursor) {
      cursorsRef.current.set(effectivePage + 1, data.nextCursor);
      setPage(effectivePage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (effectivePage > 1) {
      setPage(effectivePage - 1);
    }
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Loading objects...</p>;
  }

  if (isError) {
    return <p className="text-destructive">Failed to load objects.</p>;
  }

  return (
    <div>
      <DataTable columns={columns} data={objects} />
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          Page {effectivePage}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={!canGoPrevious}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!canGoNext}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
