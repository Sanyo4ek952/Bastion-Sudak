import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/cn";

const cardVariants = cva(
  "rounded-3xl border border-sand-100 bg-white/90 shadow-[0_20px_60px_-40px_rgba(43,42,40,0.5)] transition duration-150 ease-out",
  {
    variants: {
      variant: {
        default: "",
        soft: "bg-sand-50/80"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

type CardProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>;

export function Card({ className, variant, ...props }: CardProps) {
  return <div className={cn(cardVariants({ variant }), className)} {...props} />;
}

type CardSectionProps = HTMLAttributes<HTMLDivElement>;

export function CardHeader({ className, ...props }: CardSectionProps) {
  return <div className={cn("flex flex-col gap-2 px-6 pt-6", className)} {...props} />;
}

export function CardContent({ className, ...props }: CardSectionProps) {
  return <div className={cn("px-6 pb-6", className)} {...props} />;
}

export function CardFooter({ className, ...props }: CardSectionProps) {
  return (
    <div
      className={cn("flex items-center justify-between border-t border-sand-100 px-6 py-4", className)}
      {...props}
    />
  );
}
