import { Navigate, useLocation } from "../../routing/Router";
import { useAuth } from "../../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { status, error, refresh } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="admin-auth-loading" role="status" aria-live="polite">
        <span className="admin-auth-loading__mark" aria-hidden="true" />
        <p>Validando acesso seguro…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="admin-auth-loading admin-auth-error" role="alert">
        <strong>Não foi possível validar o acesso</strong>
        <p>{error}</p>
        <button type="button" className="admin-button admin-button--primary" onClick={refresh}>
          Tentar novamente
        </button>
        <a href="/">Voltar à loja</a>
      </div>
    );
  }

  if (status !== "authenticated") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
