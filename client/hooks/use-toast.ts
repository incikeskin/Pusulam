"use client";

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

export const toast = (props: ToastProps) => {
  window.dispatchEvent(
    new CustomEvent("toast", { detail: props })
  );
};
