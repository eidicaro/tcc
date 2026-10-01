import { useCallback, useEffect, useMemo, useState } from "react";
import { FiEdit3, FiImage, FiLayers, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import AdminModal from "../../components/admin/AdminModal";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { AdminEmpty, AdminError, AdminLoading } from "../../components/admin/AdminPageState";
import { useStoreFormatting } from "../../hooks/useStoreFormatting";
import { clearCatalogCache } from "../../hooks/useCatalog";
import { api, assetUrl, getErrorMessage } from "../../services/api";
import { sortByOrderAndName } from "../../utils/catalog";

const asArray = (payload, key) => {
  const value = payload?.data?.[key] ?? payload?.[key] ?? payload?.data ?? payload;
  return Array.isArray(value) ? value : [];
};

const emptyCategory = { nome: "", ativo: true, ordem: 0 };
const emptyExtra = { nome: "", preco: "", ativo: true, ordem: 0, imagem: null };

export default function Catalog() {
  const { formatCurrency } = useStoreFormatting();
  const [tab, setTab] = useState("categorias");
  const [categories, setCategories] = useState([]);
  const [extras, setExtras] = useState([]);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyCategory);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [modalError, setModalError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [categoryResponse, extrasResponse] = await Promise.all([
        api.get("/admin/categorias"),
        api.get("/admin/adicionais"),
      ]);
      setCategories(sortByOrderAndName(asArray(categoryResponse.data, "categorias")));
      setExtras(sortByOrderAndName(asArray(extrasResponse.data, "adicionais")));
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Não foi possível carregar categorias e adicionais."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!feedback) return undefined;
    const timer = window.setTimeout(() => setFeedback(null), 3000);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const list = tab === "categorias" ? categories : extras;
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    return list.filter((item) => !normalized || item.nome.toLocaleLowerCase("pt-BR").includes(normalized));
  }, [list, query]);

  const openCreate = () => {
    setForm(tab === "categorias" ? emptyCategory : emptyExtra);
    setModalError("");
    setModal({ type: "create", entity: tab, item: null });
  };

  const openEdit = (item) => {
    setForm(tab === "categorias"
      ? { nome: item.nome || "", ativo: Boolean(item.ativo ?? true), ordem: Number(item.ordem || 0) }
      : {
        nome: item.nome || "",
        preco: item.preco ?? "",
        ativo: Boolean(item.ativo ?? true),
        ordem: Number(item.ordem || 0),
        imagem: null,
      });
    setModalError("");
    setModal({ type: "edit", entity: tab, item });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setModalError("");

    try {
      let response;
      if (modal.entity === "categorias") {
        const body = { nome: form.nome.trim(), ativo: form.ativo, ordem: Number(form.ordem || 0) };
        response = modal.type === "edit"
          ? await api.put(`/admin/categorias/${modal.item.id_categoria}`, body)
          : await api.post("/admin/categorias", body);
      } else {
        const body = new FormData();
        body.append("nome", form.nome.trim());
        body.append("preco", String(form.preco));
        body.append("ativo", form.ativo ? "1" : "0");
        body.append("ordem", String(form.ordem || 0));
        if (form.imagem) body.append("imagem", form.imagem);
        if (modal.type === "edit") body.append("_method", "PUT");
        response = modal.type === "edit"
          ? await api.post(`/admin/adicionais/${modal.item.id_adicional}`, body)
          : await api.post("/admin/adicionais", body);
      }

      const saved = response.data?.data ?? response.data;
      clearCatalogCache();
      if (modal.entity === "categorias") {
        setCategories((current) => sortByOrderAndName(modal.type === "edit"
          ? current.map((item) => item.id_categoria === saved.id_categoria ? saved : item)
          : [...current, saved]));
      } else {
        setExtras((current) => sortByOrderAndName(modal.type === "edit"
          ? current.map((item) => item.id_adicional === saved.id_adicional ? saved : item)
          : [...current, saved]));
      }
      setFeedback({
        message: modal.type === "edit" ? "Alterações salvas." : "Item adicionado ao catálogo.",
        tone: "success",
      });
      setModal(null);
    } catch (requestError) {
      setModalError(getErrorMessage(requestError, "Não foi possível salvar o item."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    const label = tab === "categorias" ? "categoria" : "adicional";
    const impact = tab === "categorias"
      ? " Categorias vinculadas a produtos não serão removidas; reclassifique esses produtos primeiro."
      : "";
    if (!window.confirm(`Remover ${label} “${item.nome}”?${impact}`)) return;

    try {
      if (tab === "categorias") {
        await api.delete(`/admin/categorias/${item.id_categoria}`);
        setCategories((current) => current.filter((entry) => entry.id_categoria !== item.id_categoria));
      } else {
        await api.delete(`/admin/adicionais/${item.id_adicional}`);
        setExtras((current) => current.filter((entry) => entry.id_adicional !== item.id_adicional));
      }
      clearCatalogCache();
      setFeedback({ message: "Item removido com segurança.", tone: "success" });
    } catch (requestError) {
      setFeedback({ message: getErrorMessage(requestError, "Este item está em uso e não pode ser removido."), tone: "error" });
    }
  };

  if (loading && !categories.length && !extras.length) return <AdminLoading label="Carregando a estrutura do catálogo…" />;
  if (error && !categories.length && !extras.length) return <AdminError message={error} onRetry={load} />;

  return (
    <div className="admin-page">
      <AdminPageHeader
        eyebrow="Organização"
        title="Estrutura do catálogo"
        description="Categorias guiam a descoberta; adicionais deixam cada pedido do jeito do cliente."
        actions={(
          <button type="button" className="admin-button admin-button--primary" onClick={openCreate}>
            <FiPlus aria-hidden="true" />
            {tab === "categorias" ? "Nova categoria" : "Novo adicional"}
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

      <div className="admin-tabs">
        <button
          type="button"
          aria-pressed={tab === "categorias"}
          className={tab === "categorias" ? "is-active" : ""}
          onClick={() => { setTab("categorias"); setQuery(""); }}
        >
          Categorias <span>{categories.length}</span>
        </button>
        <button
          type="button"
          aria-pressed={tab === "adicionais"}
          className={tab === "adicionais" ? "is-active" : ""}
          onClick={() => { setTab("adicionais"); setQuery(""); }}
        >
          Adicionais <span>{extras.length}</span>
        </button>
      </div>

      <section className="admin-toolbar">
        <label className="admin-search">
          <FiSearch aria-hidden="true" />
          <span className="sr-only">Buscar</span>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Buscar ${tab}`} />
        </label>
      </section>

      {filtered.length ? (
        <section className="admin-panel admin-catalog-table-wrap">
          <div className="admin-table-scroll">
            <table className="admin-table">
              <caption className="sr-only">Lista de {tab}</caption>
              <thead>
                <tr>
                  {tab === "adicionais" && <th scope="col">Imagem</th>}
                  <th scope="col">Nome</th>
                  {tab === "adicionais" && <th scope="col">Preço</th>}
                  <th scope="col">Ordem</th>
                  <th scope="col">Situação</th>
                  <th scope="col"><span className="sr-only">Ações</span></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id_categoria ?? item.id_adicional}>
                    {tab === "adicionais" && (
                      <td>
                        <span className="admin-table-image">
                          {item.imagem || item.imagem_url
                            ? <img src={assetUrl(item.imagem_url || item.imagem)} alt="" loading="lazy" />
                            : <FiImage aria-hidden="true" />}
                        </span>
                      </td>
                    )}
                    <td><strong>{item.nome}</strong></td>
                    {tab === "adicionais" && <td>{formatCurrency(item.preco)}</td>}
                    <td>{item.ordem ?? 0}</td>
                    <td><span className={`admin-availability${item.ativo === false ? " is-off" : ""}`}>{item.ativo === false ? "Inativo" : "Ativo"}</span></td>
                    <td>
                      <div className="admin-table-actions">
                        <button type="button" onClick={() => openEdit(item)} aria-label={`Editar ${item.nome}`}><FiEdit3 aria-hidden="true" /></button>
                        <button type="button" onClick={() => handleDelete(item)} aria-label={`Remover ${item.nome}`}><FiTrash2 aria-hidden="true" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <AdminEmpty
          title={`Nenhum${tab === "categorias" ? "a" : ""} ${tab === "categorias" ? "categoria" : "adicional"} encontrado`}
          description="Crie uma estrutura clara para que o cliente encontre e personalize com facilidade."
          action={<button type="button" className="admin-button admin-button--primary" onClick={openCreate}><FiPlus /> Adicionar</button>}
        />
      )}

      <AdminModal
        open={Boolean(modal)}
        onClose={() => {
          if (!saving) {
            setModal(null);
            setModalError("");
          }
        }}
        title={`${modal?.type === "edit" ? "Editar" : "Nova"} ${modal?.entity === "categorias" ? "categoria" : "adicional"}`}
      >
        <form className="admin-form" onSubmit={handleSubmit}>
          {modalError && <div className="admin-form__error" role="alert">{modalError}</div>}
          <label className="admin-field">
            <span>Nome</span>
            <input value={form.nome || ""} onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))} maxLength={100} required />
          </label>

          {modal?.entity === "adicionais" && (
            <label className="admin-field">
              <span>Preço</span>
              <input type="number" min="0" max="999999.99" step="0.01" value={form.preco ?? ""} onChange={(event) => setForm((current) => ({ ...current, preco: event.target.value }))} required />
            </label>
          )}

          <label className="admin-field">
            <span>Ordem de exibição</span>
            <input type="number" min="0" max="9999" value={form.ordem || 0} onChange={(event) => setForm((current) => ({ ...current, ordem: event.target.value }))} />
          </label>

          {modal?.entity === "adicionais" && (
            <label className="admin-field admin-file-field">
              <span>Imagem</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setForm((current) => ({ ...current, imagem: event.target.files?.[0] || null }))} />
              <small>{form.imagem?.name || "JPG, PNG ou WebP — até 2 MB"}</small>
            </label>
          )}

          <label className="admin-switch">
            <input type="checkbox" checked={Boolean(form.ativo)} onChange={(event) => setForm((current) => ({ ...current, ativo: event.target.checked }))} />
            <span aria-hidden="true" />
            Disponível para os clientes
          </label>

          <footer className="admin-form__actions">
            <button
              type="button"
              className="admin-button admin-button--ghost"
              onClick={() => { setModal(null); setModalError(""); }}
              disabled={saving}
            >
              Cancelar
            </button>
            <button type="submit" className="admin-button admin-button--primary" disabled={saving}>{saving ? "Salvando…" : "Salvar"}</button>
          </footer>
        </form>
      </AdminModal>
    </div>
  );
}
