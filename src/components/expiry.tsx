"use client";

import { usePasteExpiry } from "@/providers/paste-expiry-provider";
import { Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const EXPIRY_OPTIONS: Record<string, number> = {
  Never: -1,
  "5 Minutes": 60 * 5,
  "15 Minutes": 60 * 15,
  "30 Minutes": 60 * 30,
  "1 Hour": 60 * 60,
  "12 Hours": 60 * 60 * 12,
  "1 Day": 60 * 60 * 24,
  "1 Week": 60 * 60 * 24 * 7,
  "1 Month": 60 * 60 * 24 * 30,
  "1 Year": 60 * 60 * 24 * 365,
} as const;
const DEFAULT_EXPIRY = EXPIRY_OPTIONS["1 Month"];

export function Expiry() {
  const { setExpiry } = usePasteExpiry(DEFAULT_EXPIRY);

  const handleExpiryChange = (value: string) => {
    const expiry = EXPIRY_OPTIONS[value];
    if (expiry != null) {
      setExpiry(expiry);
    }
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-muted-foreground">
        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Expires in</span>
        <span className="sm:hidden">Expires</span>
      </div>
      <Select
        defaultValue={Object.keys(EXPIRY_OPTIONS).find(key => EXPIRY_OPTIONS[key] === DEFAULT_EXPIRY)}
        onValueChange={handleExpiryChange}
      >
        <SelectTrigger className="w-[100px] sm:w-[120px] h-6 sm:h-7 bg-background-secondary/50 hover:bg-background-secondary text-xs sm:text-sm">
          <SelectValue placeholder="Select expiry" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(EXPIRY_OPTIONS).map(([label, value]) => (
            <SelectItem
              key={value}
              value={label}
              className="text-xs sm:text-sm"
            >
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
