import { cn } from "@/common/utils";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface PasteFooterButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  form?: string;
  variant?: "default" | "outline" | "secondary" | "orange" | "emerald";
  className?: string;
  iconOnly?: boolean;
}

export function PasteFooterButton({
  children,
  onClick,
  disabled = false,
  type = "button",
  form,
  variant = "default",
  className,
  iconOnly = false,
}: PasteFooterButtonProps) {
  const baseClasses =
    "text-sm font-medium h-9 shadow-md text-white border-0 !rounded-lg";

  const variantClasses = {
    default:
      "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    outline:
      "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
    secondary:
      "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
    orange:
      "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
    emerald:
      "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700",
  };

  const paddingClasses = iconOnly ? "px-2 lg:px-4" : "px-3 lg:px-6";

  // Map custom variants to Button component variants
  const buttonVariant =
    variant === "orange" || variant === "emerald" ? "default" : variant;

  return (
    <Button
      type={type}
      form={form}
      onClick={onClick}
      disabled={disabled}
      variant={buttonVariant}
      size="default"
      className={cn(
        baseClasses,
        variantClasses[variant],
        paddingClasses,
        className
      )}
    >
      {children}
    </Button>
  );
}
