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

type ExpiryOption = {
  value: number;
  label: string;
};

const expiryOptions: ExpiryOption[] = [
  { value: -1, label: "Never" },
  { value: 60 * 5, label: "5 Minutes" },
  { value: 60 * 15, label: "15 Minutes" },
  { value: 60 * 30, label: "30 Minutes" },
  { value: 60 * 60, label: "1 Hour" },
  { value: 60 * 60 * 12, label: "12 Hours" },
  { value: 60 * 60 * 24, label: "1 Day" },
  { value: 60 * 60 * 24 * 7, label: "1 Week" },
  { value: 60 * 60 * 24 * 30, label: "1 Month" },
  { value: 60 * 60 * 24 * 365, label: "1 Year" },
];

export function Expiry() {
  const { setExpiry } = usePasteExpiry();

  const handleExpiryChange = (value: string) => {
    const expiry = expiryOptions.find(option => option.label === value)?.value;
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
        defaultValue={expiryOptions[0].label}
        onValueChange={handleExpiryChange}
      >
        <SelectTrigger className="w-[100px] sm:w-[120px] h-6 sm:h-7 bg-background-secondary/50 hover:bg-background-secondary text-xs sm:text-sm">
          <SelectValue placeholder="Select expiry" />
        </SelectTrigger>
        <SelectContent>
          {expiryOptions.map(option => (
            <SelectItem
              key={option.value}
              value={option.label}
              className="text-xs sm:text-sm"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
