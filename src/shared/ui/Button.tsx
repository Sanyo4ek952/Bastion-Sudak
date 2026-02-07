import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "s" | "m" | "l";

type ButtonVariantProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

const baseClasses =
  "inline-flex items-center justify-center rounded-full font-semibold transition duration-150 ease-out focus-ring disabled:pointer-events-none disabled:opacity-60";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-sea-500 text-sand-50 shadow-[0_12px_24px_-16px_rgba(76,145,140,0.7)] hover:bg-sea-600 active:bg-sea-600",
  secondary:
    "border border-stone-600/30 bg-sand-50 text-stone-900 hover:border-stone-600/60 hover:bg-sand-100 active:bg-sand-100",
  ghost:
    "text-stone-900 hover:bg-sand-100 active:bg-sand-100"
};

const sizeClasses: Record<ButtonSize, string> = {
  s: "px-4 py-2 text-sm",
  m: "px-5 py-2.5 text-sm",
  l: "px-6 py-3 text-base"
};

export function buttonVariants({
  variant = "primary",
  size = "m",
  className = ""
}: ButtonVariantProps = {}) {
  return [baseClasses, variantClasses[variant], sizeClasses[size], className].join(
    " "
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariantProps;

export function Button({
  variant = "primary",
  size = "m",
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={buttonVariants({ variant, size, className })} {...props} />
  );
}
