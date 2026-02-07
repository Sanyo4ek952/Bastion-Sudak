import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={[
        "b-surface p-6 shadow-[0_12px_30px_-20px_rgba(51,24,0,0.2)] transition duration-150 hover:-translate-y-1 hover:shadow-[0_22px_40px_-30px_rgba(51,24,0,0.35)]",
        className,
      ].join(" ")}
      {...props}
    />
  );
}
