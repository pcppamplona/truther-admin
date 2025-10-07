import { Skeleton } from "../ui/skeleton";

export function SkeletonCard() {
  return (
    <>
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-6 w-32" />
    </>
  );
}
