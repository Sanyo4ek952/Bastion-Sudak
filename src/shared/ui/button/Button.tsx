"use client";

import type { ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";

import { cn } from "../../lib/cn";
import { Spinner } from "../spinner";
import { buttonVariants } from "./button.variants";

type ButtonBaseProps = VariantProps<typeof buttonVariants> & {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
};

type ButtonProps = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> & {
    disabled?: boolean;
  };

export function Button({
  asChild = false,
  loading = false,
  leftIcon,
  rightIcon,
  variant,
  size,
  fullWidth,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";
  const isDisabled = disabled || loading;
  const contentLeft = loading ? <Spinner className="h-4 w-4" /> : leftIcon;

  return (
    <Component
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      aria-busy={loading || undefined}
      aria-disabled={asChild && isDisabled ? true : undefined}
      disabled={!asChild ? isDisabled : undefined}
      {...props}
    >
      <span className="inline-flex items-center gap-2">
        {contentLeft}
        {children}
        {rightIcon}
      </span>
    </Component>
  );
}
