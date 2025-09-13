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
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "hsl(142 76% 36% / 0.1)",
          "--success-border": "hsl(142 76% 36% / 0.2)",
          "--success-text": "hsl(142 76% 36%)",
          "--error-bg": "hsl(0 84% 60% / 0.1)",
          "--error-border": "hsl(0 84% 60% / 0.2)",
          "--error-text": "hsl(0 84% 60%)",
          "--warning-bg": "hsl(38 92% 50% / 0.1)",
          "--warning-border": "hsl(38 92% 50% / 0.2)",
          "--warning-text": "hsl(38 92% 50%)",
          "--info-bg": "hsl(213 94% 68% / 0.1)",
          "--info-border": "hsl(213 94% 68% / 0.2)",
          "--info-text": "hsl(213 94% 68%)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
