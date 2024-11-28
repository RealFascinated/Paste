"use client";

import { Config } from "@/common/config";
import { Button } from "@/components/button";

export function HomeButton() {
  return (
    <Button
      className="font-bold hover:brightness-75 transition-all transform-gpu"
      onClick={() => (window.location.href = "/")}
    >
      {Config.siteTitle}
    </Button>
  );
}
