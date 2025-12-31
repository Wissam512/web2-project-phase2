import React, { useEffect } from "react";
import "../Assets/Toast.css";

export default function BottomToast({ message, visible, onClose, duration = 3000 }) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(t);
  }, [visible, duration, onClose]);

  if (!visible) return null;

  return (
    <div className="bottom-toast" role="status" aria-live="polite">
      <div className="toast-content">{message}</div>
    </div>
  );
}
