import { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";

export interface Toast {
  id: string;
  message: string;
  tone?: "success" | "error" | "info";
}

interface ToastState {
  toasts: Toast[];
  pushToast: (message: string, tone?: Toast["tone"]) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastState | undefined>(undefined);

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = (message: string, tone: Toast["tone"] = "info") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const value = useMemo(() => ({ toasts, pushToast, dismissToast }), [toasts]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack">
        {toasts.map((toast) => (
          <button
            key={toast.id}
            className={`toast toast--${toast.tone ?? "info"}`}
            onClick={() => dismissToast(toast.id)}
            type="button"
          >
            {toast.message}
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};
