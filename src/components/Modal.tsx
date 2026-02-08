import type { ReactNode } from "react";

import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "../shared/ui";

type ModalProps = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ isOpen, title, onClose, children }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? null : onClose())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogCloseButton onClick={onClose}>Закрыть</DialogCloseButton>
        </DialogHeader>
        <div className="mt-4 text-sm text-stone-600">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
