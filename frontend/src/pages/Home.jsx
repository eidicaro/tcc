import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "../routing/Router";
import { FiArrowRight, FiClock, FiMapPin, FiStar } from "react-icons/fi";
import { useStore } from "../contexts/StoreContext";
import { useCatalog } from "../hooks/useCatalog";
import PublicLayout from "../components/store/PublicLayout";
import ProductCard from "../components/store/ProductCard";
import ProductDialog from "../components/store/ProductDialog";
import { CatalogEmpty, CatalogError, ProductGridSkeleton } from "../components/store/CatalogStates";
import { getStoreVocabulary } from "../utils/storefront";

export default function Home() {
  const { store, loading: storeLoading } = useStore();
  const location = useLocation();
  const { products, additionals, loading, error, reload } = useCatalog();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const vocabulary = getStoreVocabulary(store);

  useEffect(() => {
    if (!location.hash || storeLoading) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, storeLoading]);

  const featuredProducts = useMemo(() => {
    const available = products.filter((product) => product.available);
    const configuredIds = new Set(store.featuredProductIds.map(String));
    const configured = available.filter((product) => configuredIds.has(String(product.id)));
    const featured = available.filter((product) => product.featured);
    return (configured.length ? configured : featured.length ? featured : available).slice(0, 4);
  }, [products, store.featuredProductIds]);

  return (
    <PublicLayout>
      <section className="store-hero" aria-labelledby="store-hero-title">
        <div className="store-shell store-hero__grid">
          <div className="store-hero__copy">
            <span className="store-eyebrow"><FiStar aria-hidden="true" /> {vocabulary.heroEyebrow}</span>
            <h1 id="store-hero-title">{store.tagline}</h1>
            <p>{store.description}</p>
            <div className="store-hero__actions">
              <Link className="store-button store-button--primary" to="/cardapio">
                Explorar o {vocabulary.catalogLower} <FiArrowRight aria-hidden="true" />
              </Link>
              <a className="store-button store-button--ghost" href="#store-hours">
                Ver atendimento
              </a>
            </div>
            <dl className="store-hero__facts">
              <div><dt>{vocabulary.serviceLabel}</dt><dd>{vocabulary.serviceValue}</dd></div>
              <div><dt>Estimativa</dt><dd>{store.order.estimate}</dd></div>
              <div><dt>Experiência</dt><dd>Feita para você</dd></div>
            </dl>
          </div>
          <div className="store-hero__visual">
            <div className="store-hero__halo" aria-hidden="true" />
            <img src={store.heroImage} alt="Apresentação da casa" fetchPriority="high" />
            <div className="store-hero__seal" aria-hidden="true">
              <span>Seleção</span><strong>da casa</strong>
            </div>
          </div>
        </div>
        <div className="store-hero__marquee" aria-hidden="true">
          <span>CURADORIA</span><i>✦</i><span>QUALIDADE</span><i>✦</i><span>EXPERIÊNCIA</span><i>✦</i>
          <span>CURADORIA</span><i>✦</i><span>QUALIDADE</span><i>✦</i><span>EXPERIÊNCIA</span>
        </div>
      </section>

      <section className="store-section store-featured" aria-labelledby="store-featured-title">
        <div className="store-shell">
          <div className="store-section-heading">
            <div>
              <span className="store-eyebrow">{vocabulary.featuredEyebrow}</span>
              <h2 id="store-featured-title">Uma seleção para começar</h2>
            </div>
            <Link to="/cardapio" className="store-arrow-link">
              Ver tudo <FiArrowRight aria-hidden="true" />
            </Link>
          </div>

          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : error ? (
            <CatalogError message={error} onRetry={() => reload()} />
          ) : featuredProducts.length ? (
            <div className="store-product-grid store-product-grid--featured">
              {featuredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={setSelectedProduct}
                  priority={index < 2}
                />
              ))}
            </div>
          ) : (
            <CatalogEmpty />
          )}
        </div>
      </section>

      <section className="store-story">
        <div className="store-shell store-story__grid">
          <div className="store-story__number" aria-hidden="true">01</div>
          <div>
            <span className="store-eyebrow">{vocabulary.storyEyebrow}</span>
            <h2>{vocabulary.storyTitle}</h2>
          </div>
          <p>
            {vocabulary.storyBody}
          </p>
        </div>
      </section>

      <section id="store-hours" className="store-section store-visit" aria-labelledby="store-visit-title">
        <div className="store-shell store-visit__grid">
          <div className="store-visit__hours">
            <span className="store-eyebrow"><FiClock aria-hidden="true" /> Planeje sua experiência</span>
            <h2 id="store-visit-title">Horários de atendimento</h2>
            <dl>
              {store.hours.map((hour) => (
                <div key={`${hour.label}-${hour.value}`}>
                  <dt>{hour.label}</dt>
                  <dd>{hour.value}</dd>
                </div>
              ))}
            </dl>
            <Link className="store-button store-button--dark" to="/cardapio">
              Fazer meu pedido <FiArrowRight aria-hidden="true" />
            </Link>
          </div>

          <div id="store-location" className="store-location">
            <div className="store-location__caption">
              <FiMapPin aria-hidden="true" />
              <span><strong>{store.location.address}</strong><small>{store.location.city}</small></span>
            </div>
            <iframe
              src={store.location.mapUrl}
              title={`Localização de ${store.name}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <ProductDialog
        product={selectedProduct}
        additionals={additionals}
        onClose={() => setSelectedProduct(null)}
      />
    </PublicLayout>
  );
}
