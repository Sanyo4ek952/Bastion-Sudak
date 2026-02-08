import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "../../lib/cn";

type CheckboxProps = ComponentPropsWithoutRef<"input">;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          "h-4 w-4 rounded border-sand-100 accent-sea-500 focus-ring",
          className
        )}
        {...props}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";
