import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "../../lib/cn";
import { selectVariants } from "./form.variants";

type SelectProps = Omit<ComponentPropsWithoutRef<"select">, "size"> &
  VariantProps<typeof selectVariants> & {
    invalid?: boolean;
  };

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, size, state, invalid, disabled, ...props }, ref) => {
    const resolvedState = disabled
      ? "disabled"
      : invalid
        ? "invalid"
        : state;

    return (
      <select
        ref={ref}
        className={cn(selectVariants({ size, state: resolvedState }), className)}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Select.displayName = "Select";
