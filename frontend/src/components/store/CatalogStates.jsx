export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="store-product-grid" aria-label="Carregando produtos" aria-busy="true">
      {Array.from({ length: count }, (_, index) => (
        <div className="store-product-skeleton" key={index} aria-hidden="true">
          <span />
          <i />
          <i />
          <i />
        </div>
      ))}
    </div>
  );
}

export function CatalogError({ message, onRetry }) {
  return (
    <div className="store-state store-state--error" role="alert">
      <span aria-hidden="true">!</span>
      <h2>O cardápio tirou uma pausa</h2>
      <p>{message}</p>
      <button type="button" className="store-button store-button--dark" onClick={onRetry}>
        Tentar novamente
      </button>
    </div>
  );
}

export function CatalogEmpty({ filtered = false }) {
  return (
    <div className="store-state">
      <span aria-hidden="true">✦</span>
      <h2>{filtered ? "Nenhum sabor encontrado" : "Novidades em preparação"}</h2>
      <p>
        {filtered
          ? "Experimente outro termo ou selecione todas as categorias."
          : "Nosso catálogo será publicado em breve."}
      </p>
    </div>
  );
}

