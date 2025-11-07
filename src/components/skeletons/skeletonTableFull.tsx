import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  rows?: number;
  columns?: number;
}

export function SkeletonTableFull({ rows = 8, columns = 7 }: Props) {
  return (
    <div className="w-full h-full flex flex-col justify-start animate-pulse">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-4 py-4"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(80px, 1fr))`,
          }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className="w-full h-10 rounded bg-muted"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
