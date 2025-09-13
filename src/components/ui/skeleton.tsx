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
    <div className="relative w-full h-full flex flex-col">
      {/* Line Numbers */}
      <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-12 pr-1 sm:pr-4 text-right text-[#7d8590] select-none font-mono text-xs z-10 pointer-events-none overflow-hidden">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="h-[18px] flex items-center justify-end">
            <Skeleton className="h-3 w-4" />
          </div>
        ))}
      </div>

      {/* Code Content */}
      <div className="absolute left-10 sm:left-12 right-0 top-0 bottom-0 overflow-hidden pointer-events-none z-0">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="h-[18px] flex items-center px-0">
            <Skeleton
              className="h-3 flex-1"
              style={{ width: `${Math.random() * 60 + 20}%` }}
            />
          </div>
        ))}
      </div>

      {/* Textarea Overlay */}
      <div className="absolute left-10 sm:left-12 right-0 top-0 bottom-0 text-transparent bg-transparent resize-none outline-none font-mono text-xs overflow-auto px-0 z-20">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="h-[18px]" />
        ))}
      </div>
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
