import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiEdit3,
  FiImage,
  FiPlus,
  FiSearch,
  FiStar,
  FiTrash2,
} from "react-icons/fi";
import AdminModal from "../../components/admin/AdminModal";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { AdminEmpty, AdminError, AdminLoading } from "../../components/admin/AdminPageState";
import { useStoreFormatting } from "../../hooks/useStoreFormatting";
import { clearCatalogCache } from "../../hooks/useCatalog";
import { api, assetUrl, getErrorMessage } from "../../services/api";
import { sortByOrderAndName } from "../../utils/catalog";

const emptyForm = {
  nome: "",
  descricao: "",
  preco: "",
  id_categoria: "",
  ativo: true,
  destaque: false,
  ordem: 0,
  imagem: null,
  adicionais: [],
};

const asArray = (payload, key) => {
  const value = payload?.data?.[key] ?? payload?.[key] ?? payload?.data ?? payload;
  return Array.isArray(value) ? value : [];
};

export default function Products() {
  const { formatCurrency } = useStoreFormatting();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [additionals, setAdditionals] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [modalError, setModalError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [productsResponse, categoriesResponse, additionalsResponse] = await Promise.all([
        api.get("/admin/produtos"),
        api.get("/admin/categorias"),
        api.get("/admin/adicionais"),
      ]);
      setProducts(sortByOrderAndName(asArray(productsResponse.data, "produtos")));
      setCategories(sortByOrderAndName(asArray(categoriesResponse.data, "categorias")));
      setAdditionals(sortByOrderAndName(asArray(additionalsResponse.data, "adicionais"))
        .filter((additional) => additional.ativo !== false));
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Não foi possível consultar o catálogo."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!feedback) return undefined;
    const timer = window.setTimeout(() => setFeedback(null), 2800);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
    return products.filter((product) => {
      const matchesQuery = !normalizedQuery
        || `${product.nome} ${product.descricao || ""}`.toLocaleLowerCase("pt-BR").includes(normalizedQuery);
      const matchesCategory = !category || String(product.id_categoria) === category;
      return matchesQuery && matchesCategory;
    });
  }, [category, products, query]);

  const openCreate = () => {
    setForm(emptyForm);
    setModalError("");
    setModal({ type: "create", product: null });
  };

  const openEdit = (product) => {
    const activeAdditionalIds = new Set(additionals.map((additional) => String(
      additional.id_adicional ?? additional.id,
    )));
    const linkedAdditionalIds = (product.adicionais || [])
      .map((additional) => additional.id_adicional ?? additional.id)
      .filter((id) => activeAdditionalIds.has(String(id)));
    const additionalsWereConfigured = Boolean(product.adicionais_configurados)
      || linkedAdditionalIds.length > 0;

    setForm({
      nome: product.nome || "",
      descricao: product.descricao || "",
      preco: product.preco ?? "",
      id_categoria: product.id_categoria ?? "",
      ativo: Boolean(product.ativo ?? true),
      destaque: Boolean(product.destaque ?? false),
      ordem: Number(product.ordem ?? 0),
      imagem: null,
      adicionais: additionalsWereConfigured
        ? linkedAdditionalIds
        : additionals.map((additional) => additional.id_adicional ?? additional.id),
    });
    setModalError("");
    setModal({ type: "edit", product });
  };

  const closeModal = () => {
    if (saving) return;
    setModal(null);
    setForm(emptyForm);
    setModalError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setModalError("");

    const body = new FormData();
    body.append("nome", form.nome.trim());
    body.append("descricao", form.descricao.trim());
    body.append("preco", String(form.preco));
    body.append("id_categoria", String(form.id_categoria));
    body.append("ativo", form.ativo ? "1" : "0");
    body.append("destaque", form.destaque ? "1" : "0");
    body.append("ordem", String(form.ordem || 0));
    body.append("adicionais", JSON.stringify(form.adicionais));
    if (form.imagem) body.append("imagem", form.imagem);

    try {
      let response;
      if (modal.type === "edit") {
        body.append("_method", "PUT");
        response = await api.post(`/admin/produtos/${modal.product.id_produto}`, body);
      } else {
        response = await api.post("/admin/produtos", body);
      }

      const saved = response.data?.data ?? response.data;
      clearCatalogCache();
      if (modal.type === "edit") {
        setProducts((current) => sortByOrderAndName(current.map((product) => (
          product.id_produto === saved.id_produto ? saved : product
        ))));
        setFeedback({ message: "Produto atualizado com sucesso.", tone: "success" });
      } else {
        setProducts((current) => sortByOrderAndName([...current, saved]));
        setFeedback({ message: "Produto criado com sucesso.", tone: "success" });
      }
      setModal(null);
      setForm(emptyForm);
    } catch (requestError) {
      setModalError(getErrorMessage(requestError, "Não foi possível salvar o produto."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Desativar “${product.nome}”? O histórico de pedidos será preservado.`,
    );
    if (!confirmed) return;

    try {
      await api.delete(`/admin/produtos/${product.id_produto}`);
      clearCatalogCache();
      setProducts((current) => current.filter((item) => item.id_produto !== product.id_produto));
      setFeedback({ message: "Produto removido do catálogo.", tone: "success" });
    } catch (requestError) {
      setFeedback({ message: getErrorMessage(requestError, "Não foi possível remover o produto."), tone: "error" });
    }
  };

  if (loading && products.length === 0) return <AdminLoading label="Organizando o catálogo…" />;
  if (error && products.length === 0) return <AdminError message={error} onRetry={load} />;

  return (
    <div className="admin-page">
      <AdminPageHeader
        eyebrow="Catálogo"
        title="Produtos"
        description="Edite o que o cliente vê, mantendo preço, disponibilidade e destaque sob controle."
        actions={(
          <button type="button" className="admin-button admin-button--primary" onClick={openCreate}>
            <FiPlus aria-hidden="true" />
            Novo produto
          </button>
        )}
      />

      {feedback && (
        <div
          className={`admin-feedback admin-feedback--${feedback.tone}`}
          role={feedback.tone === "error" ? "alert" : "status"}
          aria-live={feedback.tone === "error" ? "assertive" : "polite"}
        >
          {feedback.message}
        </div>
      )}

      <section className="admin-toolbar" aria-label="Filtros de produtos">
        <label className="admin-search">
          <FiSearch aria-hidden="true" />
          <span className="sr-only">Buscar produto</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nome ou descrição"
          />
        </label>
        <label className="admin-select-field">
          <span className="sr-only">Filtrar por categoria</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">Todas as categorias</option>
            {categories.map((item) => (
              <option key={item.id_categoria} value={item.id_categoria}>{item.nome}</option>
            ))}
          </select>
        </label>
        <span className="admin-toolbar__count">{filteredProducts.length} produto(s)</span>
      </section>

      {filteredProducts.length > 0 ? (
        <section className="admin-product-grid" aria-label="Produtos cadastrados">
          {filteredProducts.map((product) => (
            <article className={`admin-product-card${product.ativo === false ? " is-inactive" : ""}`} key={product.id_produto}>
              <div className="admin-product-card__image">
                {product.imagem || product.imagem_url ? (
                  <img src={assetUrl(product.imagem_url || product.imagem)} alt="" loading="lazy" />
                ) : (
                  <FiImage aria-hidden="true" />
                )}
                <span className={`admin-availability${product.ativo === false ? " is-off" : ""}`}>
                  {product.ativo === false ? "Indisponível" : "Ativo"}
                </span>
                {product.destaque ? <span className="admin-featured"><FiStar aria-hidden="true" /> Destaque</span> : null}
              </div>
              <div className="admin-product-card__body">
                <p className="admin-product-card__category">{product.categoria?.nome || "Sem categoria"}</p>
                <h2>{product.nome}</h2>
                <p>{product.descricao || "Sem descrição cadastrada."}</p>
                <div className="admin-product-card__footer">
                  <strong>{formatCurrency(product.preco)}</strong>
                  <div>
                    <button type="button" onClick={() => openEdit(product)} aria-label={`Editar ${product.nome}`}>
                      <FiEdit3 aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => handleDelete(product)} aria-label={`Desativar ${product.nome}`}>
                      <FiTrash2 aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <AdminEmpty
          title="Nenhum produto encontrado"
          description={products.length ? "Ajuste os filtros para ampliar a busca." : "Cadastre o primeiro item do seu catálogo."}
          action={!products.length ? (
            <button type="button" className="admin-button admin-button--primary" onClick={openCreate}>Novo produto</button>
          ) : null}
        />
      )}

      <AdminModal
        open={Boolean(modal)}
        onClose={closeModal}
        title={modal?.type === "edit" ? "Editar produto" : "Novo produto"}
        description="As alterações ficam disponíveis no catálogo assim que forem salvas."
        size="large"
      >
        <form className="admin-form" onSubmit={handleSubmit}>
          {modalError && <div className="admin-form__error" role="alert">{modalError}</div>}
          <div className="admin-form__grid">
            <label className="admin-field admin-field--wide">
              <span>Nome do produto</span>
              <input
                type="text"
                value={form.nome}
                onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))}
                maxLength={100}
                required
              />
            </label>

            <label className="admin-field">
              <span>Preço</span>
              <input
                type="number"
                min="0"
                max="999999.99"
                step="0.01"
                value={form.preco}
                onChange={(event) => setForm((current) => ({ ...current, preco: event.target.value }))}
                required
              />
            </label>

            <label className="admin-field">
              <span>Categoria</span>
              <select
                value={form.id_categoria}
                onChange={(event) => setForm((current) => ({ ...current, id_categoria: event.target.value }))}
              >
                <option value="">Sem categoria</option>
                {categories.map((item) => (
                  <option key={item.id_categoria} value={item.id_categoria}>{item.nome}</option>
                ))}
              </select>
            </label>

            <label className="admin-field admin-field--wide">
              <span>Descrição</span>
              <textarea
                rows="4"
                value={form.descricao}
                onChange={(event) => setForm((current) => ({ ...current, descricao: event.target.value }))}
                maxLength={1000}
              />
            </label>

            <fieldset className="admin-field admin-field--wide admin-additional-picker">
              <legend>Adicionais permitidos</legend>
              <small>
                Selecione somente os complementos que fazem sentido para este produto. Deixe vazio para não oferecer adicionais.
              </small>
              {additionals.length > 0 ? (
                <div className="admin-additional-picker__grid">
                  {additionals.map((additional) => {
                    const id = additional.id_adicional ?? additional.id;
                    const checked = form.adicionais.some((selectedId) => String(selectedId) === String(id));
                    const selectionLimitReached = form.adicionais.length >= 100;
                    return (
                      <label
                        className={`admin-additional-option${checked ? " is-selected" : ""}`}
                        key={id}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={!checked && selectionLimitReached}
                          onChange={(event) => setForm((current) => ({
                            ...current,
                            adicionais: event.target.checked
                              ? [...current.adicionais, id]
                              : current.adicionais.filter((selectedId) => String(selectedId) !== String(id)),
                          }))}
                        />
                        <span>
                          <strong>{additional.nome}</strong>
                          <small>{formatCurrency(additional.preco)}</small>
                        </span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <p className="admin-additional-picker__empty">
                  Cadastre adicionais ativos na área de categorias e adicionais para vinculá-los aqui.
                </p>
              )}
            </fieldset>

            <label className="admin-field">
              <span>Ordem de exibição</span>
              <input
                type="number"
                min="0"
                max="9999"
                value={form.ordem}
                onChange={(event) => setForm((current) => ({ ...current, ordem: event.target.value }))}
              />
            </label>

            <label className="admin-field admin-file-field">
              <span>Imagem</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => setForm((current) => ({ ...current, imagem: event.target.files?.[0] || null }))}
              />
              <small>{form.imagem?.name || "JPG, PNG ou WebP — até 4 MB"}</small>
            </label>
          </div>

          <div className="admin-form__switches">
            <label className="admin-switch">
              <input
                type="checkbox"
                checked={form.ativo}
                onChange={(event) => setForm((current) => ({ ...current, ativo: event.target.checked }))}
              />
              <span aria-hidden="true" />
              Disponível no catálogo
            </label>
            <label className="admin-switch">
              <input
                type="checkbox"
                checked={form.destaque}
                onChange={(event) => setForm((current) => ({ ...current, destaque: event.target.checked }))}
              />
              <span aria-hidden="true" />
              Mostrar nos destaques
            </label>
          </div>

          <footer className="admin-form__actions">
            <button type="button" className="admin-button admin-button--ghost" onClick={closeModal} disabled={saving}>Cancelar</button>
            <button type="submit" className="admin-button admin-button--primary" disabled={saving}>
              {saving ? <span className="admin-spinner" aria-hidden="true" /> : null}
              {saving ? "Salvando…" : "Salvar produto"}
            </button>
          </footer>
        </form>
      </AdminModal>
    </div>
  );
}
