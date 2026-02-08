"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/cn";

type ToastData = {
  id: string;
  title: string;
  description?: string;
  variant?: VariantProps<typeof toastVariants>["variant"];
};

type ToastContextValue = {
  notify: (toast: Omit<ToastData, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const toastVariants = cva(
  "w-full rounded-2xl border px-4 py-3 text-sm shadow-[0_16px_40px_-32px_rgba(43,42,40,0.3)]",
  {
    variants: {
      variant: {
        neutral: "border-sand-100 bg-white text-stone-900",
        success: "border-emerald-200 bg-emerald-50 text-emerald-800",
        warn: "border-amber-200 bg-amber-50 text-amber-800",
        danger: "border-rose-200 bg-rose-50 text-rose-700"
      }
    },
    defaultVariants: {
      variant: "neutral"
    }
  }
);

type ToastProviderProps = {
  children: React.ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const timeoutMap = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    const timeout = timeoutMap.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutMap.current.delete(id);
    }
  }, []);

  const notify = useCallback(
    (toast: Omit<ToastData, "id">) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((prev) => [{ id, ...toast }, ...prev].slice(0, 3));
      const timeout = setTimeout(() => removeToast(id), 4000);
      timeoutMap.current.set(id, timeout);
    },
    [removeToast]
  );

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-24 z-[60] flex w-[min(360px,90vw)] flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(toastVariants({ variant: toast.variant }))}
          >
            <div className="font-semibold">{toast.title}</div>
            {toast.description ? (
              <div className="mt-1 text-xs text-stone-600">
                {toast.description}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
