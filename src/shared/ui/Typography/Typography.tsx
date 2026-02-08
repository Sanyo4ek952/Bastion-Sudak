import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/cn";

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "font-heading text-[3.5rem] leading-[4rem] text-stone-900",
      h2: "font-heading text-[2.5rem] leading-[3rem] text-stone-900",
      h3: "font-heading text-[1.75rem] leading-[2rem] text-stone-900",
      text: "text-base leading-6 text-stone-900",
      muted: "text-sm leading-6 text-stone-600",
      small: "text-xs leading-5 text-stone-500"
    }
  },
  defaultVariants: {
    variant: "text"
  }
});

type TypographyProps = HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof typographyVariants>;

type HeadingProps = HTMLAttributes<HTMLHeadingElement>;

export function H1({ className, ...props }: HeadingProps) {
  return <h1 className={cn(typographyVariants({ variant: "h1" }), className)} {...props} />;
}

export function H2({ className, ...props }: HeadingProps) {
  return <h2 className={cn(typographyVariants({ variant: "h2" }), className)} {...props} />;
}

export function H3({ className, ...props }: HeadingProps) {
  return <h3 className={cn(typographyVariants({ variant: "h3" }), className)} {...props} />;
}

export function Text({ className, ...props }: TypographyProps) {
  return <p className={cn(typographyVariants({ variant: "text" }), className)} {...props} />;
}

export function Muted({ className, ...props }: TypographyProps) {
  return <p className={cn(typographyVariants({ variant: "muted" }), className)} {...props} />;
}

export function Small({ className, ...props }: TypographyProps) {
  return <p className={cn(typographyVariants({ variant: "small" }), className)} {...props} />;
}
