"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";

type DeleteAfterReadProps = {
  onToggle: (enabled: boolean) => void;
  defaultEnabled?: boolean;
};

export function DeleteAfterRead({
  onToggle,
  defaultEnabled = false,
}: DeleteAfterReadProps) {
  const [enabled, setEnabled] = useState(defaultEnabled);

  const handleToggle = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    onToggle(newEnabled);
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-muted-foreground">
        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Self-destruct after view</span>
        <span className="sm:hidden">Self-destruct</span>
      </div>
      <button
        type="button"
        onClick={handleToggle}
        className={`relative inline-flex h-6 sm:h-7 w-11 sm:w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          enabled
            ? "bg-red-500 hover:bg-red-600 focus:ring-red-500"
            : "bg-gray-200 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600"
        }`}
        title={
          enabled
            ? "Paste will be deleted after first view - you won't be redirected to it"
            : "Paste will remain available"
        }
      >
        <span
          className={`inline-block h-4 w-4 sm:h-5 sm:w-5 transform rounded-full bg-white transition-transform ${
            enabled ? "translate-x-6 sm:translate-x-7" : "translate-x-1"
          }`}
        />
      </button>
      {enabled && (
        <div className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-md border border-red-500/20">
          No redirect
        </div>
      )}
    </div>
  );
}
