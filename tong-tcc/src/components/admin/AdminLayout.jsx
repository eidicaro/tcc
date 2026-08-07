import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "../../routing/Router";
import {
  FiBox,
  FiGrid,
  FiHome,
  FiLayers,
  FiLogOut,
  FiMenu,
  FiShoppingBag,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { useStore } from "../../contexts/StoreContext";

const navigation = [
  { to: "/admin", label: "Visão geral", icon: FiGrid, end: true },
  { to: "/admin/pedidos", label: "Pedidos", icon: FiShoppingBag },
  { to: "/admin/produtos", label: "Produtos", icon: FiBox },
  { to: "/admin/catalogo", label: "Catálogo", icon: FiLayers },
  { to: "/admin/clientes", label: "Clientes", icon: FiUsers },
];

export default function AdminLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia?.("(max-width: 920px)").matches ?? false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const { user, logout } = useAuth();
  const { store } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const menuButtonRef = useRef(null);
  const sidebarHidden = isMobile && !menuOpen;

  const closeMobileMenu = useCallback(() => {
    setMenuOpen(false);
    if (isMobile) {
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
  }, [isMobile]);

  useEffect(() => {
    if (menuOpen) closeMobileMenu();
  }, [location.pathname]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 920px)");
    const onChange = (event) => {
      setIsMobile(event.matches);
      if (!event.matches) setMenuOpen(false);
    };
    setIsMobile(media.matches);
    media.addEventListener?.("change", onChange);
    return () => media.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (sidebarHidden && sidebarRef.current?.contains(document.activeElement)) {
      menuButtonRef.current?.focus();
    }
  }, [sidebarHidden]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
        return;
      }

      if (event.key !== "Tab" || !isMobile) return;
      const controls = [
        menuButtonRef.current,
        ...(sidebarRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? []),
      ].filter(Boolean);
      if (!controls.length) return;

      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.classList.add("is-admin-menu-open");
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.classList.remove("is-admin-menu-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeMobileMenu, menuOpen]);

  useEffect(() => {
    if (!isMobile || !menuOpen) return undefined;
    const frame = window.requestAnimationFrame(() => {
      sidebarRef.current?.querySelector("a, button")?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isMobile, menuOpen]);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    setLogoutError("");

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      setLogoutError(error.message || "Não foi possível encerrar a sessão.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="admin-shell">
      <a className="admin-skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
      <button
        ref={menuButtonRef}
        type="button"
        className="admin-mobile-toggle"
        onClick={() => (menuOpen ? closeMobileMenu() : setMenuOpen(true))}
        aria-expanded={menuOpen}
        aria-controls="admin-sidebar"
        aria-label={menuOpen ? "Fechar menu administrativo" : "Abrir menu administrativo"}
      >
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>

      {menuOpen && (
        <button
          type="button"
          className="admin-sidebar-backdrop"
          tabIndex="-1"
          aria-label="Fechar menu"
          onClick={closeMobileMenu}
        />
      )}

      <aside
        ref={sidebarRef}
        id="admin-sidebar"
        className={`admin-sidebar${menuOpen ? " is-open" : ""}`}
        aria-hidden={sidebarHidden ? "true" : undefined}
        inert={sidebarHidden ? "" : undefined}
      >
        <Link to="/admin" className="admin-brand" aria-label="Ir para a visão geral">
          <img src={store.logo} alt="" />
          <span>
            <strong>{store.shortName}</strong>
            <small>Central de gestão</small>
          </span>
        </Link>

        <nav className="admin-nav" aria-label="Navegação administrativa">
          <p className="admin-nav__eyebrow">Operação</p>
          {navigation.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `admin-nav__link${isActive ? " is-active" : ""}`}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <Link to="/" className="admin-store-link">
            <FiHome aria-hidden="true" />
            Ver loja
          </Link>
          <div className="admin-profile">
            <span className="admin-profile__avatar" aria-hidden="true">
              {(user?.name || "A").charAt(0).toUpperCase()}
            </span>
            <span className="admin-profile__copy">
              <strong>{user?.name || "Administrador"}</strong>
              <small>{user?.email}</small>
            </span>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              aria-label="Sair do painel"
              title="Sair"
            >
              <FiLogOut aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>

      <main
        className="admin-content"
        id="conteudo-principal"
        tabIndex="-1"
        aria-hidden={isMobile && menuOpen ? "true" : undefined}
        inert={isMobile && menuOpen ? "" : undefined}
      >
        {logoutError && (
          <div className="admin-inline-warning admin-logout-error" role="alert">
            {logoutError} Tente novamente; seu acesso permanece ativo até a confirmação do servidor.
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
