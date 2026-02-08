import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "../../lib/cn";
import { inputVariants } from "./form.variants";

type InputProps = Omit<ComponentPropsWithoutRef<"input">, "size"> &
  VariantProps<typeof inputVariants> & {
    invalid?: boolean;
  };

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, state, invalid, disabled, ...props }, ref) => {
    const resolvedState = disabled
      ? "disabled"
      : invalid
        ? "invalid"
        : state;

    return (
      <input
        ref={ref}
        className={cn(inputVariants({ size, state: resolvedState }), className)}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
