"use client";

import type { CSSProperties, ReactNode } from "react";
import { List } from "react-window";
import { ArrowUp, ArrowDown, ChevronsUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@shared/ui/button";
import { Skeleton } from "@shared/ui/skeleton";
import { cn } from "@shared/lib/utils";

const VIRTUALIZE_THRESHOLD = 50;
const ROW_HEIGHT = 44;
const MAX_VIRTUAL_HEIGHT = 400;

export interface ColumnDef<T> {
  id: string;
  header: string;
  accessorFn: (row: T) => ReactNode;
  sortable?: boolean;
}

interface SortState {
  columnId: string;
  direction: "asc" | "desc";
}

interface PaginationState {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  cursor?: string;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  pagination?: PaginationState;
  sort?: SortState;
  onSort?: (columnId: string, direction: "asc" | "desc") => void;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  keyFn: (row: T) => string;
}

interface VirtualRowProps {
  data: unknown[];
  columns: ColumnDef<unknown>[];
  onRowClick?: (row: unknown) => void;
  keyFn: (row: unknown) => string;
}

function VirtualRow({
  index,
  style,
  data,
  columns,
  onRowClick,
}: VirtualRowProps & { index: number; style: CSSProperties }) {
  const row = data[index]!;
  return (
    <div
      style={style}
      className={cn(
        "flex border-b transition-colors hover:bg-muted/50",
        onRowClick && "cursor-pointer",
      )}
      role="row"
      onClick={() => onRowClick?.(row)}
      tabIndex={onRowClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onRowClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onRowClick(row);
        }
      }}
    >
      {columns.map((col) => (
        <div key={col.id} className="flex-1 px-4 py-3 text-sm">
          {col.accessorFn(row)}
        </div>
      ))}
    </div>
  );
}

export function DataTable<T>({
  columns,
  data,
  pagination,
  sort,
  onSort,
  onNextPage,
  onPreviousPage,
  onRowClick,
  loading = false,
  keyFn,
}: DataTableProps<T>) {
  const useVirtualization = !loading && data.length > VIRTUALIZE_THRESHOLD;

  function handleSort(columnId: string) {
    if (!onSort) return;
    const newDirection =
      sort?.columnId === columnId && sort.direction === "asc" ? "desc" : "asc";
    onSort(columnId, newDirection);
  }

  function getSortIcon(columnId: string) {
    if (sort?.columnId !== columnId) return <ChevronsUpDown className="size-3" />;
    return sort.direction === "asc" ? (
      <ArrowUp className="size-3" />
    ) : (
      <ArrowDown className="size-3" />
    );
  }

  function renderHeader() {
    return columns.map((col) => (
      <th
        key={col.id}
        className="px-4 py-3 text-left font-medium"
        aria-sort={
          sort?.columnId === col.id
            ? sort.direction === "asc"
              ? "ascending"
              : "descending"
            : undefined
        }
      >
        {col.sortable && onSort ? (
          <button
            className="inline-flex items-center gap-1 hover:text-foreground"
            onClick={() => handleSort(col.id)}
          >
            {col.header}
            {getSortIcon(col.id)}
          </button>
        ) : (
          col.header
        )}
      </th>
    ));
  }

  return (
    <div>
      <div className="rounded-md border">
        {useVirtualization ? (
          <div role="table" className="w-full text-sm">
            <div role="rowgroup">
              <div role="row" className="flex border-b bg-muted/50">
                {columns.map((col) => (
                  <div
                    key={col.id}
                    role="columnheader"
                    className="flex-1 px-4 py-3 text-left font-medium"
                  >
                    {col.sortable && onSort ? (
                      <button
                        className="inline-flex items-center gap-1 hover:text-foreground"
                        onClick={() => handleSort(col.id)}
                      >
                        {col.header}
                        {getSortIcon(col.id)}
                      </button>
                    ) : (
                      col.header
                    )}
                  </div>
                ))}
              </div>
            </div>
            <List
              rowCount={data.length}
              rowHeight={ROW_HEIGHT}
              style={{ height: Math.min(data.length * ROW_HEIGHT, MAX_VIRTUAL_HEIGHT) }}
              rowComponent={VirtualRow as typeof VirtualRow & ((props: Record<string, unknown>) => React.ReactElement | null)}
              rowProps={{
                data: data as unknown[],
                columns: columns as ColumnDef<unknown>[],
                onRowClick: onRowClick as ((row: unknown) => void) | undefined,
                keyFn: keyFn as (row: unknown) => string,
              }}
            />
          </div>
        ) : (
          <table role="table" className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                {renderHeader()}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={`skeleton-${i}`} className="border-b">
                      {columns.map((col) => (
                        <td key={col.id} className="px-4 py-3">
                          <Skeleton className="h-4 w-24" />
                        </td>
                      ))}
                    </tr>
                  ))
                : data.map((row) => (
                    <tr
                      key={keyFn(row)}
                      className={cn(
                        "border-b transition-colors hover:bg-muted/50",
                        onRowClick && "cursor-pointer",
                      )}
                      onClick={() => onRowClick?.(row)}
                      tabIndex={onRowClick ? 0 : undefined}
                      onKeyDown={(e) => {
                        if (onRowClick && (e.key === "Enter" || e.key === " ")) {
                          e.preventDefault();
                          onRowClick(row);
                        }
                      }}
                    >
                      {columns.map((col) => (
                        <td key={col.id} className="px-4 py-3">
                          {col.accessorFn(row)}
                        </td>
                      ))}
                    </tr>
                  ))}
            </tbody>
          </table>
        )}
      </div>

      {pagination && (
        <div className="mt-2 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPreviousPage}
            disabled={!pagination.hasPreviousPage}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onNextPage}
            disabled={!pagination.hasNextPage}
            aria-label="Next page"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
