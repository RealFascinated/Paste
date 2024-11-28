import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
};

export function Button({
  children,
  ...props
}: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="px-1.5 py-0.5 bg-input hover:text-link transition-all transform-gpu text-sm"
      {...props}
    >
      {children}
    </button>
  );
}
