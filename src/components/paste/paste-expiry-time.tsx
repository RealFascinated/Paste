"use client";

import { getRelativeTime } from "@/common/utils/date.util";
import Tooltip from "@/components/tooltip";
import { useEffect, useState } from "react";

type PasteExpiryTimeProps = {
  /**
   * The date the paste expires.
   */
  expiresAt: Date;
};

export function PasteExpiryTime({ expiresAt }: PasteExpiryTimeProps) {
  const [time, setTime] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setTime(getRelativeTime(expiresAt));

    const difference = expiresAt.getTime() - new Date().getTime();
    // Don't update if the difference is more than 1 hour
    if (difference > 60 * 60 * 1000) {
      return;
    }

    const timer = setInterval(
      () => {
        setTime(getRelativeTime(expiresAt));
      },
      difference < 60 * 1000 ? 1000 : 60_000
    );

    return () => clearInterval(timer);
  }, [expiresAt]);

  return (
    <Tooltip display={expiresAt.toLocaleString()}>
      <p>Expires {isClient ? time : "..."}</p>
    </Tooltip>
  );
}
