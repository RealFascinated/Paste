"use client";

import { usePasteExpiry } from "@/providers/paste-expiry-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Clock } from "lucide-react";

type ExpiryOption = {
  value: number;
  label: string;
};

const expiryOptions: ExpiryOption[] = [
  { value: -1, label: "Never" },
  { value: 60 * 60, label: "1 Hour" },
  { value: 60 * 60 * 2, label: "2 Hours" },
  { value: 60 * 60 * 6, label: "6 Hours" },
  { value: 60 * 60 * 24, label: "1 Day" },
  { value: 60 * 60 * 24 * 7, label: "7 Days" },
  { value: 60 * 60 * 24 * 30, label: "1 Month" },
  { value: 60 * 60 * 24 * 30 * 6, label: "6 Months" },
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
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span>Expires in</span>
      </div>
      <Select
        defaultValue={expiryOptions[0].label}
        onValueChange={handleExpiryChange}
      >
        <SelectTrigger className="w-[120px] h-7 bg-background-secondary/50 hover:bg-background-secondary">
          <SelectValue placeholder="Select expiry" />
        </SelectTrigger>
        <SelectContent>
          {expiryOptions.map(option => (
            <SelectItem key={option.value} value={option.label}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
