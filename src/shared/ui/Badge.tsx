import type { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement>;

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-header",
        className,
      ].join(" ")}
      {...props}
    />
  );
}
