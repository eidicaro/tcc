import { FiAlertCircle, FiInbox, FiRefreshCw } from "react-icons/fi";

export function AdminLoading({ label = "Carregando dados…" }) {
  return (
    <div className="admin-state admin-state--loading" role="status" aria-live="polite">
      <span className="admin-spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export function AdminError({ message, onRetry }) {
  return (
    <div className="admin-state admin-state--error" role="alert">
      <FiAlertCircle aria-hidden="true" />
      <div>
        <strong>Não foi possível carregar esta área</strong>
        <p>{message}</p>
      </div>
      {onRetry && (
        <button type="button" className="admin-button admin-button--ghost" onClick={onRetry}>
          <FiRefreshCw aria-hidden="true" />
          Tentar novamente
        </button>
      )}
    </div>
  );
}

export function AdminEmpty({ title = "Nada por aqui", description, action }) {
  return (
    <div className="admin-state admin-state--empty">
      <FiInbox aria-hidden="true" />
      <strong>{title}</strong>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}
