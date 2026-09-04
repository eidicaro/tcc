import StoreHeader from "./StoreHeader";
import StoreFooter from "./StoreFooter";
import CartDrawer from "./CartDrawer";
import { useStore } from "../../contexts/StoreContext";
import "../../styles/global.css";
import "../../styles/public.css";

export default function PublicLayout({ children, footer = true }) {
  const { store, loading, error, usingFallback, reload } = useStore();

  if (loading) {
    return (
      <div className="store-app store-boot" role="status" aria-live="polite">
        <img src={store.logo} alt="" />
        <span aria-hidden="true" />
        <p>Preparando {store.name}…</p>
      </div>
    );
  }

  return (
    <div className="store-app">
      <a className="store-skip-link" href="#store-main">Pular para o conteúdo</a>
      <StoreHeader />
      {usingFallback && (
        <div className="store-config-alert" role="alert">
          <span>{error || "Não foi possível validar a configuração da loja."} Pedidos estão pausados.</span>
          <button type="button" onClick={reload}>Tentar novamente</button>
        </div>
      )}
      <main id="store-main" tabIndex="-1">{children}</main>
      {footer && <StoreFooter />}
      <CartDrawer />
    </div>
  );
}
