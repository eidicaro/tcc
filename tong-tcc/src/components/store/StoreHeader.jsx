import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "../../routing/Router";
import { FiMenu, FiShoppingBag, FiX } from "react-icons/fi";
import { useCart } from "../../contexts/CartContext";
import { useStore } from "../../contexts/StoreContext";
import { getStoreVocabulary } from "../../utils/storefront";

export default function StoreHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);
  const { store } = useStore();
  const { itemCount, openCart, syncing } = useCart();
  const vocabulary = getStoreVocabulary(store);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 841px)");
    const closeAtDesktop = (event) => {
      if (event.matches) setMenuOpen(false);
    };
    media.addEventListener?.("change", closeAtDesktop);
    return () => media.removeEventListener?.("change", closeAtDesktop);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    };
    const onPointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen]);

  return (
    <header className="store-header" ref={headerRef}>
      <div className="store-shell store-header__inner">
        <NavLink to="/" className="store-brand" aria-label={`${store.name}, página inicial`}>
          <img src={store.logo} alt="" className="store-brand__logo" width="56" height="56" />
          <span className="store-brand__copy">
            <strong>{store.shortName}</strong>
            <small>{vocabulary.brandDescriptor}</small>
          </span>
        </NavLink>

        <button
          ref={menuButtonRef}
          type="button"
          className="store-icon-button store-header__menu-button"
          aria-expanded={menuOpen}
          aria-controls="store-primary-navigation"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
        </button>

        <nav
          id="store-primary-navigation"
          className={`store-nav ${menuOpen ? "store-nav--open" : ""}`}
          aria-label="Navegação principal"
        >
          <NavLink to="/" end onClick={closeMenu}>Início</NavLink>
          <NavLink to="/cardapio" onClick={closeMenu}>{vocabulary.catalog}</NavLink>
          <Link to="/#store-location" onClick={closeMenu}>Localização</Link>
        </nav>

        <button
          type="button"
          className="store-cart-button"
          onClick={openCart}
          aria-label={`Abrir carrinho, ${itemCount} ${itemCount === 1 ? "item" : "itens"}`}
        >
          <FiShoppingBag aria-hidden="true" />
          <span className="store-cart-button__label">Pedido</span>
          <span className="store-cart-button__count" aria-hidden="true">
            {syncing ? "…" : itemCount}
          </span>
        </button>
      </div>
    </header>
  );
}
