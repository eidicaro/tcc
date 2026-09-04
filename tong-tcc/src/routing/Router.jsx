import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const RouterContext = createContext(null);

function currentLocation() {
  if (typeof window === "undefined") {
    return { pathname: "/", search: "", hash: "", state: null };
  }

  return {
    pathname: window.location.pathname || "/",
    search: window.location.search,
    hash: window.location.hash,
    state: window.history.state,
  };
}

function internalUrl(target) {
  return new URL(String(target), window.location.href);
}

export function BrowserRouter({ children }) {
  const [location, setLocation] = useState(currentLocation);

  useEffect(() => {
    const syncLocation = () => setLocation(currentLocation());
    window.addEventListener("popstate", syncLocation);
    window.addEventListener("hashchange", syncLocation);
    return () => {
      window.removeEventListener("popstate", syncLocation);
      window.removeEventListener("hashchange", syncLocation);
    };
  }, []);

  const navigate = useCallback((target, options = {}) => {
    if (typeof target === "number") {
      window.history.go(target);
      return;
    }

    const url = internalUrl(target);
    if (url.origin !== window.location.origin) {
      window.location.assign(url.href);
      return;
    }

    const destination = `${url.pathname}${url.search}${url.hash}`;
    const method = options.replace ? "replaceState" : "pushState";
    window.history[method](options.state ?? null, "", destination);
    if (!url.hash) {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
    setLocation(currentLocation());
  }, []);

  const value = useMemo(() => ({ location, navigate }), [location, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useLocation() {
  const context = useContext(RouterContext);
  if (!context) throw new Error("useLocation deve ser usado dentro de BrowserRouter");
  return context.location;
}

export function useNavigate() {
  const context = useContext(RouterContext);
  if (!context) throw new Error("useNavigate deve ser usado dentro de BrowserRouter");
  return context.navigate;
}

export const Link = forwardRef(function Link(
  { to, replace = false, state, onClick, target, children, ...props },
  ref,
) {
  const navigate = useNavigate();
  const href = String(to);

  const handleClick = (event) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey ||
      props.download ||
      (target && target !== "_self")
    ) {
      return;
    }

    const url = internalUrl(href);
    if (url.origin !== window.location.origin) return;

    event.preventDefault();
    navigate(`${url.pathname}${url.search}${url.hash}`, { replace, state });
  };

  return (
    <a ref={ref} href={href} target={target} onClick={handleClick} {...props}>
      {children}
    </a>
  );
});

export const NavLink = forwardRef(function NavLink(
  { to, end = false, className, "aria-current": ariaCurrent, ...props },
  ref,
) {
  const location = useLocation();
  const targetPath = internalUrl(to).pathname.replace(/\/$/, "") || "/";
  const currentPath = location.pathname.replace(/\/$/, "") || "/";
  const isActive = end
    ? currentPath === targetPath
    : currentPath === targetPath || (targetPath !== "/" && currentPath.startsWith(`${targetPath}/`));
  const baseClassName = typeof className === "function" ? className({ isActive }) : className;
  const resolvedClassName = [baseClassName, isActive ? "active" : ""].filter(Boolean).join(" ");

  return (
    <Link
      ref={ref}
      to={to}
      className={resolvedClassName}
      aria-current={ariaCurrent ?? (isActive ? "page" : undefined)}
      {...props}
    />
  );
});

export function Navigate({ to, replace = false, state }) {
  const navigate = useNavigate();
  useEffect(() => navigate(to, { replace, state }), [navigate, replace, to]);
  return null;
}
