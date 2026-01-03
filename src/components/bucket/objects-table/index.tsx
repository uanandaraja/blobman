"use client";

import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

import { DataTable } from "@/components/ui/data-table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { trpc } from "@/lib/trpc";
import { columns } from "./columns";

interface ObjectsTableProps {
  bucketId: string;
}

export function ObjectsTable({ bucketId }: ObjectsTableProps) {
  const [cursor, setCursor] = useQueryState(
    "cursor",
    parseAsString.withDefault("").withOptions({ history: "push" })
  );
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ history: "push" })
  );

  const { data, isLoading, isError } = trpc.object.list.useQuery({
    bucketId,
    cursor: cursor || undefined,
  });

  const objects = data?.objects ?? [];
  const hasMore = data?.hasMore ?? false;
  const nextCursor = data?.nextCursor ?? null;

  const handlePrevious = () => {
    if (page > 1) {
      window.history.back();
    }
  };

  const handleNext = () => {
    if (nextCursor) {
      const nextPage = page + 1;
      setPage(nextPage);
      setCursor(nextCursor);
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
      <div className="flex items-center justify-between py-4">
        <div className="text-muted-foreground text-sm">Page {page}</div>
        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={page === 1 ? "#" : "?"}
                onClick={(e) => {
                  e.preventDefault();
                  handlePrevious();
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href={!hasMore ? "#" : "?"}
                onClick={(e) => {
                  e.preventDefault();
                  handleNext();
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
