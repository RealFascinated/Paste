import { cn } from "@/common/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

function CodeSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-4 w-8" />
          <Skeleton
            className="h-4 flex-1"
            style={{ width: `${Math.random() * 60 + 20}%` }}
          />
        </div>
      ))}
    </div>
  );
}

function PasteDetailsSkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-6 w-20 rounded-md" />
      ))}
    </div>
  );
}

function FooterSkeleton() {
  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex gap-4">
        <Skeleton className="h-6 w-24" />
        <PasteDetailsSkeleton />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-16 rounded-md" />
        ))}
      </div>
    </div>
  );
}

export { CodeSkeleton, FooterSkeleton, PasteDetailsSkeleton, Skeleton };
