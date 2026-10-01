import { FiPlus } from "react-icons/fi";
import { useStoreFormatting } from "../../hooks/useStoreFormatting";

export default function ProductCard({ product, onSelect, priority = false }) {
  const { formatCurrency } = useStoreFormatting();

  return (
    <article className={"store-product-card" + (product.available ? "" : " is-unavailable")}>
      <button
        type="button"
        className="store-product-card__media"
        onClick={() => onSelect(product)}
        disabled={!product.available}
        aria-label={`Ver detalhes de ${product.name}`}
      >
        {product.image ? (
          <img
            src={product.image}
            alt=""
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
          />
        ) : (
          <span className="store-product-card__placeholder" aria-hidden="true">✦</span>
        )}
        {!product.available ? <span className="store-product-card__badge">Indisponível</span> : product.featured && <span className="store-product-card__badge">Destaque</span>}
      </button>
      <div className="store-product-card__body">
        <div>
          <h3>{product.name}</h3>
          <p>{product.description || "Selecionado com cuidado para completar sua experiência."}</p>
        </div>
        <div className="store-product-card__footer">
          <strong>{formatCurrency(product.price)}</strong>
          <button
            type="button"
            onClick={() => onSelect(product)}
            disabled={!product.available}
            aria-label={`Adicionar ${product.name}`}
          >
            {product.available ? <><FiPlus aria-hidden="true" /> Adicionar</> : "Indisponível"}
          </button>
        </div>
      </div>
    </article>
  );
}
