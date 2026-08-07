import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

export default function AdminModal({ open, title, description, onClose, children, size = "medium" }) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;

    const previousActiveElement = document.activeElement;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onCloseRef.current?.();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = Array.from(dialogRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? []).filter((element) => !element.hasAttribute("hidden"));
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.classList.add("has-modal-open");
    window.addEventListener("keydown", onKeyDown);
    const focusFrame = window.requestAnimationFrame(() => {
      const firstField = dialogRef.current?.querySelector(
        '.admin-modal__body input:not([disabled]), .admin-modal__body select:not([disabled]), .admin-modal__body textarea:not([disabled])',
      );
      (firstField ?? closeRef.current)?.focus();
    });

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.classList.remove("has-modal-open");
      window.removeEventListener("keydown", onKeyDown);
      previousActiveElement?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="admin-modal" role="presentation">
      <button className="admin-modal__backdrop" type="button" onClick={onClose} aria-label="Fechar janela" />
      <section
        ref={dialogRef}
        className={`admin-modal__dialog admin-modal__dialog--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
      >
        <header className="admin-modal__header">
          <div>
            <h2 id={titleId}>{title}</h2>
            {description && <p id={descriptionId}>{description}</p>}
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Fechar">
            <FiX aria-hidden="true" />
          </button>
        </header>
        <div className="admin-modal__body">{children}</div>
      </section>
    </div>,
    document.body,
  );
}
