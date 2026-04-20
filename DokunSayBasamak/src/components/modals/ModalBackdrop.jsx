import { useRef, useEffect } from 'react';

export default function ModalBackdrop({ children, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const focusable = el.querySelectorAll('button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();

    function trap(e) {
      if (e.key !== "Tab" || !focusable.length) return;
      if (e.shiftKey) {
        if (document.activeElement === focusable[0]) { e.preventDefault(); focusable[focusable.length - 1].focus(); }
      } else {
        if (document.activeElement === focusable[focusable.length - 1]) { e.preventDefault(); focusable[0].focus(); }
      }
    }
    function esc(e) { if (e.key === "Escape") onClose(); }

    el.addEventListener("keydown", trap);
    el.addEventListener("keydown", esc);
    return () => { el.removeEventListener("keydown", trap); el.removeEventListener("keydown", esc); };
  }, [onClose]);

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div ref={ref} role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}
        style={{
          background: "#fffdf7", borderRadius: 20, padding: "24px 28px", maxWidth: 480, width: "90%",
          boxShadow: "0 16px 48px rgba(0,0,0,.25)", animation: "popIn .3s",
          overflowY: "auto", maxHeight: "85vh",
        }}>
        {children}
      </div>
    </div>
  );
}
