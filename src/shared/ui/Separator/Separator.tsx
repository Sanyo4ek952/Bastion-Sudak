import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/cn";

const separatorVariants = cva("shrink-0 bg-sand-100", {
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "h-full w-px"
    }
  },
  defaultVariants: {
    orientation: "horizontal"
  }
});

type SeparatorProps = Omit<HTMLAttributes<HTMLDivElement>, "aria-orientation"> &
  VariantProps<typeof separatorVariants>;

export function Separator({ className, orientation, ...props }: SeparatorProps) {
  const resolvedOrientation = orientation ?? "horizontal";
  return (
    <div
      role="separator"
      aria-orientation={resolvedOrientation}
      className={cn(separatorVariants({ orientation: resolvedOrientation }), className)}
      {...props}
    />
  );
}
