import { cn } from "@/common/utils";
import * as React from "react";

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: number;
    max?: number;
  }
>(({ className, value = 0, max = 100, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <div
      className="h-full w-full flex-1 bg-primary transition-all duration-300 ease-in-out"
      style={{ transform: `translateX(-${100 - (value / max) * 100}%)` }}
    />
  </div>
));
Progress.displayName = "Progress";

const ProgressWithLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: number;
    max?: number;
    label?: string;
  }
>(({ className, value = 0, max = 100, label, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props}>
    {label && (
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{label}</span>
        <span>{Math.round((value / max) * 100)}%</span>
      </div>
    )}
    <Progress value={value} max={max} />
  </div>
));
ProgressWithLabel.displayName = "ProgressWithLabel";

export { Progress, ProgressWithLabel };
