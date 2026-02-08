import { cva } from "class-variance-authority";

const baseControlStyles =
  "w-full rounded-2xl border border-sand-100 bg-sand-50 text-stone-900 shadow-sm transition duration-150 ease-out focus-ring";

export const inputVariants = cva(baseControlStyles, {
  variants: {
    size: {
      s: "h-9 px-3 text-sm",
      m: "h-11 px-3 text-base",
      l: "h-12 px-4 text-base"
    },
    state: {
      default: "",
      invalid: "border-rose-400 focus-visible:ring-rose-200",
      disabled: "bg-sand-100 text-stone-400"
    }
  },
  defaultVariants: {
    size: "m",
    state: "default"
  }
});

export const textareaVariants = cva(
  "min-h-[120px] w-full rounded-2xl border border-sand-100 bg-sand-50 px-3 py-2 text-base text-stone-900 shadow-sm transition duration-150 ease-out focus-ring",
  {
    variants: {
      size: {
        s: "text-sm",
        m: "text-base",
        l: "text-lg"
      },
      state: {
        default: "",
        invalid: "border-rose-400 focus-visible:ring-rose-200",
        disabled: "bg-sand-100 text-stone-400"
      }
    },
    defaultVariants: {
      size: "m",
      state: "default"
    }
  }
);

export const selectVariants = cva(baseControlStyles, {
  variants: {
    size: {
      s: "h-9 px-3 text-sm",
      m: "h-11 px-3 text-base",
      l: "h-12 px-4 text-base"
    },
    state: {
      default: "",
      invalid: "border-rose-400 focus-visible:ring-rose-200",
      disabled: "bg-sand-100 text-stone-400"
    }
  },
  defaultVariants: {
    size: "m",
    state: "default"
  }
});
