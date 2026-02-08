import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "../../lib/cn";
import { textareaVariants } from "./form.variants";

type TextareaProps = Omit<ComponentPropsWithoutRef<"textarea">, "size"> &
  VariantProps<typeof textareaVariants> & {
    invalid?: boolean;
  };

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size, state, invalid, disabled, ...props }, ref) => {
    const resolvedState = disabled
      ? "disabled"
      : invalid
        ? "invalid"
        : state;

    return (
      <textarea
        ref={ref}
        className={cn(textareaVariants({ size, state: resolvedState }), className)}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
