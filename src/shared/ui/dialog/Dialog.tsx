"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/cn";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

const dialogOverlayVariants = cva(
  "fixed inset-0 z-50 bg-stone-900/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
);

const dialogContentVariants = cva(
  "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6 shadow-[0_24px_80px_-40px_rgba(43,42,40,0.6)] focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
  {
    variants: {
      size: {
        sm: "max-w-md",
        md: "max-w-xl",
        lg: "max-w-3xl"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
);

type DialogOverlayProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>;

export const DialogOverlay = ({
  className,
  ...props
}: DialogOverlayProps) => (
  <DialogPrimitive.Overlay
    className={cn(dialogOverlayVariants(), className)}
    {...props}
  />
);

type DialogContentProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
  VariantProps<typeof dialogContentVariants>;

export const DialogContent = ({
  className,
  size,
  ...props
}: DialogContentProps) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      className={cn(dialogContentVariants({ size }), className)}
      {...props}
    />
  </DialogPortal>
);

type DialogTitleProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;
type DialogDescriptionProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Description
>;

export const DialogTitle = ({
  className,
  ...props
}: DialogTitleProps) => (
  <DialogPrimitive.Title
    className={cn("text-2xl font-semibold text-stone-900", className)}
    {...props}
  />
);

export const DialogDescription = ({
  className,
  ...props
}: DialogDescriptionProps) => (
  <DialogPrimitive.Description
    className={cn("text-sm text-stone-600", className)}
    {...props}
  />
);

type DialogHeaderProps = ComponentPropsWithoutRef<"div">;
type DialogFooterProps = ComponentPropsWithoutRef<"div">;

export const DialogHeader = ({ className, ...props }: DialogHeaderProps) => (
  <div className={cn("flex items-start justify-between gap-4", className)} {...props} />
);

export const DialogFooter = ({ className, ...props }: DialogFooterProps) => (
  <div className={cn("mt-6 flex flex-wrap items-center justify-end gap-2", className)} {...props} />
);

export const DialogCloseButton = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Close>) => (
  <DialogPrimitive.Close
    className={cn(
      "rounded-full border border-sand-100 px-3 py-1 text-sm text-stone-600 transition hover:border-sand-100/80 focus-ring",
      className
    )}
    {...props}
  />
);
