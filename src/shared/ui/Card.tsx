import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={[
        "rounded-3xl border border-sand-100 bg-white/90 p-6 shadow-[0_20px_60px_-40px_rgba(43,42,40,0.5)] transition duration-150 ease-out",
        className
      ].join(" ")}
      {...props}
    />
  );
}
