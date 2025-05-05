"use client";

import { clsx } from "clsx";
import { ReactNode } from "react";
import {
  Tooltip as ShadCnTooltip,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip";

type Props = {
  /**
   * What will trigger the tooltip
   */
  children: ReactNode;

  /**
   * What will be displayed in the tooltip
   */
  display: ReactNode;

  /**
   * Display the trigger as a child element.
   */
  asChild?: boolean;

  /**
   * The additional class names
   */
  className?: string;

  /**
   * Where the tooltip will be displayed
   */
  side?: "top" | "bottom" | "left" | "right";
};

export default function Tooltip({
  children,
  display,
  asChild = true,
  side = "top",
  className,
}: Props) {
  return (
    <ShadCnTooltip>
      <TooltipTrigger
        className={clsx("cursor-default", className)}
        asChild={asChild}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent className="max-w-[350px]" side={side}>
        {display}
      </TooltipContent>
    </ShadCnTooltip>
  );
}
