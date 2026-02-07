import type { ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ isOpen, title, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-[0_24px_80px_-40px_rgba(43,42,40,0.6)]">
        <div className="flex items-center justify-between">
          <h2 id="modal-title" className="text-2xl">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full border border-sand-100 px-3 py-1 text-sm text-stone-600 focus-ring"
          >
            Закрыть
          </button>
        </div>
        <div className="mt-4 text-sm text-stone-600">{children}</div>
      </div>
    </div>
  );
}
