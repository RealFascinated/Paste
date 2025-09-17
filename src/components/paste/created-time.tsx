"use client";

import { getRelativeTime } from "@/common/utils/date.util";
import Tooltip from "@/components/tooltip";
import { useEffect, useState } from "react";

type PasteCreatedTimeProps = {
  /**
   * The date the paste was created.
   */
  createdAt: Date;
};

export function PasteCreatedTime({ createdAt }: PasteCreatedTimeProps) {
  const [time, setTime] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setTime(getRelativeTime(createdAt));

    const difference = new Date().getTime() - createdAt.getTime();
    // Don't update if the difference is more than 1 hour
    if (difference > 60 * 60 * 1000) {
      return;
    }

    const timer = setInterval(
      () => {
        setTime(getRelativeTime(createdAt));
      },
      difference < 60 * 1000 ? 1000 : 60_000
    );

    return () => clearInterval(timer);
  }, [createdAt]);

  return (
    <Tooltip display={createdAt.toLocaleString()}>
      Created {isClient ? time : "..."}
    </Tooltip>
  );
}
