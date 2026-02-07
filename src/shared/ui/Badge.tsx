import type { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement>;

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border border-gold-soft bg-sand-100 px-3 py-1 text-caption font-semibold uppercase tracking-[0.25em] text-stone-900",
        className
      ].join(" ")}
      {...props}
    />
  );
}
