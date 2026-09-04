import { useEffect, useState } from "react";
import { FiArrowLeft, FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "../routing/Router";
import { useAuth } from "../contexts/AuthContext";
import { useStore } from "../contexts/StoreContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, status } = useAuth();
  const { store } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const destination = location.state?.from || "/admin";

  useEffect(() => {
    if (status === "authenticated") navigate(destination, { replace: true });
  }, [destination, navigate, status]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    setError("");
    setSubmitting(true);

    try {
      await login({ email: email.trim(), password });
      navigate(destination, { replace: true });
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page" id="login-main" tabIndex="-1">
      <section className="login-page__brand" aria-label={`Área administrativa ${store.name}`}>
        <Link to="/" className="login-page__back">
          <FiArrowLeft aria-hidden="true" />
          Voltar à loja
        </Link>
        <div className="login-page__brand-copy">
          <span className="login-page__pill">Gestão inteligente</span>
          <h1>O controle da operação, com a mesma excelência da experiência.</h1>
          <p>
            Pedidos, catálogo e clientes em uma central segura, clara e pronta para o ritmo do atendimento.
          </p>
        </div>
        <div className="login-page__ambient" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </section>

      <section className="login-page__panel">
        <div className="login-card">
          <header>
            <img src={store.logo} alt={store.name} />
            <div>
              <p>Acesso restrito</p>
              <h2>Bem-vindo de volta</h2>
            </div>
          </header>

          <p className="login-card__intro">
            Entre com a conta administrativa cadastrada no servidor.
          </p>

          <form onSubmit={handleSubmit}>
            <label className="admin-field">
              <span>E-mail</span>
              <span className="admin-field__control">
                <FiMail aria-hidden="true" />
                <input
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@sualoja.com.br"
                  required
                  disabled={submitting}
                />
              </span>
            </label>

            <label className="admin-field">
              <span>Senha</span>
              <span className="admin-field__control">
                <FiLock aria-hidden="true" />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Sua senha"
                  required
                  disabled={submitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
                </button>
              </span>
            </label>

            {error && (
              <div className="login-card__error" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="admin-button admin-button--primary login-card__submit" disabled={submitting}>
              {submitting ? <span className="admin-spinner" aria-hidden="true" /> : null}
              {submitting ? "Entrando…" : "Entrar com segurança"}
            </button>
          </form>

          <footer>
            <FiLock aria-hidden="true" />
            Sessão protegida e encerrada automaticamente por inatividade.
          </footer>
        </div>
      </section>
    </main>
  );
}
