import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  primary?: boolean;
};

export function Button({
  children,
  primary,
  ...props
}: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
        primary
          ? "bg-primary hover:bg-primary/90 text-primary-foreground"
          : "bg-background-secondary hover:bg-background-secondary/80"
      }`}
      {...props}
    >
      {children}
    </button>
  );
}
