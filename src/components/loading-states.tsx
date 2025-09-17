"use client";

import { ProgressWithLabel } from "./ui/progress";
import { CodeSkeleton, FooterSkeleton } from "./ui/skeleton";

interface LoadingStateProps {
  type: "paste-edit" | "paste-view" | "upload" | "stats";
  progress?: number;
  message?: string;
}

export function LoadingState({ type, progress, message }: LoadingStateProps) {
  if (type === "upload" && progress !== undefined) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 p-8">
        <div className="w-full max-w-md space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Uploading Paste</h3>
            <p className="text-sm text-muted-foreground">
              {message || "Processing your paste..."}
            </p>
          </div>
          <ProgressWithLabel
            value={progress}
            max={100}
            label="Upload Progress"
          />
        </div>
      </div>
    );
  }

  if (type === "paste-edit") {
    return (
      <div className="flex flex-col h-[calc(100dvh-140px)] sm:h-[calc(100dvh-120px)] w-full">
        <div className="flex-1 p-4">
          <CodeSkeleton />
        </div>
        <FooterSkeleton />
      </div>
    );
  }

  if (type === "paste-view") {
    return (
      <div className="flex flex-col gap-1 h-full grow">
        <div className="overflow-x-auto h-full flex grow w-full text-sm px-2 sm:px-0">
          <CodeSkeleton />
        </div>
        <FooterSkeleton />
      </div>
    );
  }

  if (type === "stats") {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 p-8">
        <div className="w-full max-w-4xl space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Loading Statistics</h3>
            <p className="text-sm text-muted-foreground">
              {message || "Gathering site data..."}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="p-6 rounded-lg border bg-card animate-pulse"
              >
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="p-6 rounded-lg border bg-card animate-pulse"
              >
                <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className="space-y-2">
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-2 bg-muted rounded w-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

interface InlineLoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export function InlineLoading({
  message = "Loading...",
  size = "md",
}: InlineLoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <div
        className={`animate-spin rounded-full border-2 border-primary border-t-transparent ${sizeClasses[size]}`}
      />
      <span className="text-sm text-muted-foreground">{message}</span>
    </div>
  );
}

interface ButtonLoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
}

export function ButtonLoading({
  isLoading,
  children,
  loadingText = "Loading...",
}: ButtonLoadingProps) {
  return (
    <>
      {isLoading && (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>{loadingText}</span>
        </div>
      )}
      {!isLoading && children}
    </>
  );
}
