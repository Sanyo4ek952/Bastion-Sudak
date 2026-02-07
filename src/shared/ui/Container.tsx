import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={["mx-auto w-full max-w-[1240px] px-6", className].join(" ")}
    >
      {children}
    </div>
  );
}
