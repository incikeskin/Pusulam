"use client";

import { useEffect, useState } from "react";
import { ToastProps } from "@/hooks/use-toast";

type ToastItem = ToastProps & { id: string };

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (e: any) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, ...e.detail }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };

    window.addEventListener("toast", handler);
    return () => window.removeEventListener("toast", handler);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-xl px-4 py-3 shadow text-sm text-white ${
            toast.variant === "destructive"
              ? "bg-red-600"
              : "bg-slate-900"
          }`}
        >
          {toast.title && <p className="font-semibold">{toast.title}</p>}
          {toast.description && <p>{toast.description}</p>}
        </div>
      ))}
    </div>
  );
}
