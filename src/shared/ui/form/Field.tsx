import type { ReactNode } from "react";

import { cn } from "../../lib/cn";

type FieldProps = {
  label?: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
};

export function Field({
  label,
  hint,
  error,
  htmlFor,
  required,
  className,
  children
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2 text-sm font-medium text-stone-600", className)}>
      {label ? (
        <label htmlFor={htmlFor} className="flex items-center gap-1">
          <span>{label}</span>
          {required ? <span className="text-rose-500">*</span> : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <span className="text-xs text-rose-600" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className="text-xs text-stone-500">{hint}</span>
      ) : null}
    </div>
  );
}
