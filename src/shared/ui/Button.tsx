import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonVariantProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

const baseClasses =
  "inline-flex items-center justify-center rounded-full font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-foreground hover:bg-accent/90",
  secondary:
    "border border-border bg-card text-foreground hover:border-foreground/20 hover:text-foreground",
  ghost: "text-foreground hover:bg-muted",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export function buttonVariants({
  variant = "primary",
  size = "md",
  className = "",
}: ButtonVariantProps = {}) {
  return [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].join(" ");
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariantProps;

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={buttonVariants({ variant, size, className })} {...props} />
  );
}
