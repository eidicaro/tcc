import { useMemo, useState } from "react";
import { FiSearch, FiSliders, FiX } from "react-icons/fi";
import { useCatalog } from "../hooks/useCatalog";
import { normalizeSearch } from "../utils/formatters";
import PublicLayout from "../components/store/PublicLayout";
import ProductCard from "../components/store/ProductCard";
import ProductDialog from "../components/store/ProductDialog";
import { CatalogEmpty, CatalogError, ProductGridSkeleton } from "../components/store/CatalogStates";
import { useStore } from "../contexts/StoreContext";
import { getStoreVocabulary } from "../utils/storefront";

export default function Menu() {
  const { store } = useStore();
  const { products, categories, additionals, partial, loading, error, reload } = useCatalog();
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const vocabulary = getStoreVocabulary(store);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = normalizeSearch(query);
    return products.filter((product) => {
      if (!product.available) return false;
      const matchesCategory =
        categoryId === "all" || String(product.categoryId) === String(categoryId);
      const searchableText = normalizeSearch(`${product.name} ${product.description}`);
      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [products, query, categoryId]);

  const hasFilters = query || categoryId !== "all";

  return (
    <PublicLayout>
      <header className="store-menu-hero">
        <div className="store-shell">
          <span className="store-eyebrow">Escolha sem pressa</span>
          <h1>{vocabulary.catalog}</h1>
          <p>Encontre seu favorito, ajuste os detalhes e acompanhe o pedido em um só lugar.</p>
        </div>
      </header>

      <section className="store-menu store-shell" aria-labelledby="store-menu-results-title">
        <div className="store-menu__toolbar">
          <label className="store-search">
            <FiSearch aria-hidden="true" />
            <span className="store-sr-only">Buscar no cardápio</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={vocabulary.searchPlaceholder}
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Limpar busca">
                <FiX aria-hidden="true" />
              </button>
            )}
          </label>
          <div className="store-menu__result-count" aria-live="polite">
            <FiSliders aria-hidden="true" />
            {loading ? "Carregando seleção" : `${visibleProducts.length} ${visibleProducts.length === 1 ? "opção" : "opções"}`}
          </div>
        </div>

        <div className="store-category-chips" role="group" aria-label="Filtrar por categoria">
          <button
            type="button"
            className={categoryId === "all" ? "is-active" : ""}
            aria-pressed={categoryId === "all"}
            onClick={() => setCategoryId("all")}
          >
            Todos
          </button>
          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              className={String(categoryId) === String(category.id) ? "is-active" : ""}
              aria-pressed={String(categoryId) === String(category.id)}
              onClick={() => setCategoryId(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {partial && !loading && !error && (
          <p className="store-inline-note" role="status">
            Alguns filtros ou adicionais podem estar temporariamente indisponíveis.
          </p>
        )}

        <h2 id="store-menu-results-title" className="store-sr-only">Resultados do {vocabulary.catalogLower}</h2>
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : error ? (
          <CatalogError message={error} onRetry={() => reload()} />
        ) : visibleProducts.length ? (
          <div className="store-product-grid">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />
            ))}
          </div>
        ) : (
          <>
            <CatalogEmpty filtered={Boolean(hasFilters)} />
            {hasFilters && (
              <button
                type="button"
                className="store-button store-button--ghost store-menu__clear"
                onClick={() => {
                  setQuery("");
                  setCategoryId("all");
                }}
              >
                Limpar filtros
              </button>
            )}
          </>
        )}
      </section>

      <ProductDialog
        product={selectedProduct}
        additionals={additionals}
        onClose={() => setSelectedProduct(null)}
      />
    </PublicLayout>
  );
}
