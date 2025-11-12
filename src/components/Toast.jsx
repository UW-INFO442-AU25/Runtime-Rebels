import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const idOf = () =>
    (typeof crypto !== "undefined" && crypto.randomUUID)
      ? crypto.randomUUID()
      : String(Date.now()) + Math.random().toString(16).slice(2);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(({ title, description, duration = 3500 }) => {
    const id = idOf();
    setToasts((prev) => [...prev, { id, title, description }]);
    if (duration !== 0) setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  // Quick debug: window.toast({ title, description })
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.toast = (opts) => show(opts);
    }
  }, [show]);

  const container = (
    <div
      className="toast-container"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        zIndex: 999999,
        pointerEvents: "none"
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="toast"
          role="status"
          style={{
            pointerEvents: "auto",
            background: "rgba(20,20,20,0.92)",
            color: "#fff",
            padding: "12px 14px",
            borderRadius: 12,
            boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
            maxWidth: 340,
            animation: "toast-in 200ms ease-out"
          }}
        >
          <div className="toast-title" style={{ fontWeight: 600 }}>{t.title}</div>
          {t.description ? (
            <div className="toast-desc" style={{ opacity: 0.95, fontSize: "0.92rem", marginTop: 2 }}>
              {t.description}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );

  return (
    <ToastCtx.Provider value={{ show, dismiss }}>
      {children}
      {mounted ? createPortal(container, document.body) : null}
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
