import { lazy, Suspense, useEffect, useRef } from "react";
import AdminLayout from "./components/admin/AdminLayout";
import AppErrorBoundary from "./components/AppErrorBoundary";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { StoreProvider, useStore } from "./contexts/StoreContext";
import { BrowserRouter, Navigate, useLocation } from "./routing/Router";
import { getStoreVocabulary } from "./utils/storefront";

const Home = lazy(() => import("./pages/Home"));
const Menu = lazy(() => import("./pages/Menu"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Orders = lazy(() => import("./pages/admin/Orders"));
const Products = lazy(() => import("./pages/admin/Products"));
const Catalog = lazy(() => import("./pages/admin/Catalog"));
const Customers = lazy(() => import("./pages/admin/Customers"));

function RouteLoader() {
  return (
    <div className="route-loader" role="status" aria-live="polite">
      <span aria-hidden="true" />
      <p>Preparando a experiência…</p>
    </div>
  );
}

function ApplicationRoutes() {
  const { pathname, hash } = useLocation();
  const path = pathname.replace(/\/$/, "") || "/";
  const { store } = useStore();
  const previousPath = useRef(path);

  useEffect(() => {
    const vocabulary = getStoreVocabulary(store);
    const labels = {
      "/": "Início",
      "/cardapio": vocabulary.catalog,
      "/login": "Login administrativo",
      "/admin": "Visão geral",
      "/admin/pedidos": "Pedidos",
      "/admin/produtos": "Produtos",
      "/admin/catalogo": "Estrutura do catálogo",
      "/admin/clientes": "Clientes",
    };
    document.title = `${labels[path] || "Página não encontrada"} | ${store.name}`;
    document
      .querySelector('meta[name="robots"]')
      ?.setAttribute(
        "content",
        path === "/login" || path.startsWith("/admin")
          ? "noindex, nofollow"
          : "index, follow",
      );

    if (previousPath.current !== path) {
      previousPath.current = path;
      const frame = window.requestAnimationFrame(() => {
        const targetId = path === "/login"
          ? "login-main"
          : path.startsWith("/admin")
            ? "conteudo-principal"
            : "store-main";
        document.getElementById(targetId)?.focus({ preventScroll: Boolean(hash) });
      });
      return () => window.cancelAnimationFrame(frame);
    }
    return undefined;
  }, [hash, path, store]);

  if (path === "/login") return <Login />;

  if (path === "/admin" || path.startsWith("/admin/")) {
    let page;
    if (path === "/admin") page = <Dashboard />;
    else if (path === "/admin/pedidos") page = <Orders />;
    else if (path === "/admin/produtos") page = <Products />;
    else if (path === "/admin/catalogo") page = <Catalog />;
    else if (path === "/admin/clientes") page = <Customers />;
    else if (path === "/admin/gerenciaritens") {
      page = <Navigate to="/admin/catalogo" replace />;
    } else {
      page = <Navigate to="/admin" replace />;
    }

    return (
      <ProtectedRoute>
        <AdminLayout>{page}</AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <CartProvider>
      {path === "/" ? <Home /> : path === "/cardapio" ? <Menu /> : <NotFound />}
    </CartProvider>
  );
}

export default function AppRouter() {
  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <StoreProvider>
          <AuthProvider>
            <Suspense fallback={<RouteLoader />}>
              <ApplicationRoutes />
            </Suspense>
          </AuthProvider>
        </StoreProvider>
      </BrowserRouter>
    </AppErrorBoundary>
  );
}
