import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-semibold transition duration-150 ease-out focus-ring disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-sea-500 text-sand-50 shadow-[0_12px_24px_-16px_rgba(76,145,140,0.7)] hover:bg-sea-600 active:bg-sea-600",
        secondary:
          "border border-stone-600/30 bg-sand-50 text-stone-900 hover:border-stone-600/60 hover:bg-sand-100 active:bg-sand-100",
        ghost: "text-stone-900 hover:bg-sand-100 active:bg-sand-100",
        link: "text-sea-600 underline-offset-4 hover:underline",
        danger:
          "bg-rose-600 text-white shadow-[0_12px_24px_-16px_rgba(225,29,72,0.6)] hover:bg-rose-700 active:bg-rose-700"
      },
      size: {
        s: "px-4 py-2 text-sm",
        m: "px-5 py-2.5 text-sm",
        l: "px-6 py-3 text-base"
      },
      fullWidth: {
        true: "w-full"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "m"
    }
  }
);
