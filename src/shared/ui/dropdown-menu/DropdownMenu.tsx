"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import type { ComponentPropsWithoutRef } from "react";
import { cva } from "class-variance-authority";

import { cn } from "../../lib/cn";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const dropdownMenuContentVariants = cva(
  "z-50 min-w-[12rem] rounded-2xl border border-sand-100 bg-white p-2 text-sm text-stone-700 shadow-[0_20px_60px_-40px_rgba(43,42,40,0.55)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
);

const dropdownMenuItemVariants = cva(
  "flex w-full cursor-pointer select-none items-center gap-2 rounded-xl px-3 py-2 text-sm text-stone-700 outline-none transition-colors focus:bg-sand-50 focus:text-stone-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
);

type DropdownMenuContentProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Content
>;

export const DropdownMenuContent = ({
  className,
  sideOffset = 8,
  ...props
}: DropdownMenuContentProps) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      className={cn(dropdownMenuContentVariants(), className)}
      sideOffset={sideOffset}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
);

type DropdownMenuItemProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Item
>;

export const DropdownMenuItem = ({
  className,
  ...props
}: DropdownMenuItemProps) => (
  <DropdownMenuPrimitive.Item
    className={cn(dropdownMenuItemVariants(), className)}
    {...props}
  />
);

type DropdownMenuLabelProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Label
>;

export const DropdownMenuLabel = ({
  className,
  ...props
}: DropdownMenuLabelProps) => (
  <DropdownMenuPrimitive.Label
    className={cn("px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400", className)}
    {...props}
  />
);

type DropdownMenuSeparatorProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Separator
>;

export const DropdownMenuSeparator = ({
  className,
  ...props
}: DropdownMenuSeparatorProps) => (
  <DropdownMenuPrimitive.Separator
    className={cn("mx-2 my-2 h-px bg-sand-100", className)}
    {...props}
  />
);
