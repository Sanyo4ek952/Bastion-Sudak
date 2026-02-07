import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonVariantProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

const baseClasses =
  "inline-flex items-center justify-center rounded-[10px] font-semibold transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-foreground shadow-[0_10px_20px_-12px_rgba(105,42,0,0.7)] hover:bg-accent/90 focus-visible:ring-gold/70",
  secondary:
    "border border-header/50 bg-transparent text-gold hover:border-header/70 hover:bg-card",
  ghost: "text-gold hover:bg-muted/50",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
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
