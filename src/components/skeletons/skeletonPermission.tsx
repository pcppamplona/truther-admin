import { Skeleton } from "../ui/skeleton";

export function PermissionsSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="border rounded-md divide-y divide-border">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2 px-4 py-3">
          <Skeleton className="h-4 w-2/5" />
          <Skeleton className="h-3 w-3/5" />
        </div>
      ))}
    </div>
  );
}