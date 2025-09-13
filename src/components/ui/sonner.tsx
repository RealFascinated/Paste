"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      expand={true}
      richColors={true}
      closeButton={true}
      duration={4000}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "white",
          "--normal-border": "var(--border)",
          "--success-bg": "hsl(142 76% 36% / 0.7)",
          "--success-border": "hsl(142 76% 36% / 0.9)",
          "--success-text": "white",
          "--error-bg": "hsl(0 84% 60% / 0.7)",
          "--error-border": "hsl(0 84% 60% / 0.9)",
          "--error-text": "white",
          "--warning-bg": "hsl(38 92% 50% / 0.7)",
          "--warning-border": "hsl(38 92% 50% / 0.9)",
          "--warning-text": "white",
          "--info-bg": "hsl(213 94% 68% / 0.7)",
          "--info-border": "hsl(213 94% 68% / 0.9)",
          "--info-text": "white",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
