import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={[
        "rounded-2xl border border-border bg-card p-6 shadow-[0_12px_30px_-24px_rgba(51,24,0,0.35)] transition duration-150 hover:-translate-y-1 hover:shadow-[0_22px_40px_-30px_rgba(51,24,0,0.45)]",
        className,
      ].join(" ")}
      {...props}
    />
  );
}
