import { useCallback, useEffect, useRef, useState } from "react";
import { FiMessageCircle, FiRefreshCw, FiSearch, FiUser, FiUsers } from "react-icons/fi";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { AdminEmpty, AdminError, AdminLoading } from "../../components/admin/AdminPageState";
import { api, getErrorMessage } from "../../services/api";

const formatPhone = (value = "") => {
  const digits = String(value).replace(/\D/g, "");
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return value || "—";
};

const normalizeWhatsapp = (value = "") => {
  const digits = String(value).replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("55") ? digits : `55${digits}`;
};

const asArray = (payload) => {
  const value = payload?.data?.clientes ?? payload?.clientes ?? payload?.data ?? payload;
  return Array.isArray(value) ? value : [];
};

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1, total: 0 });
  const requestIdRef = useRef(0);

  const load = useCallback(async ({ page = 1, append = false, search = "" } = {}) => {
    const requestId = ++requestIdRef.current;
    if (append) setLoadingMore(true);
    else setLoading(true);
    setError("");
    try {
      const response = await api.get("/admin/clientes", {
        params: { page, per_page: 50, q: search || undefined },
      });
      if (requestId !== requestIdRef.current) return;

      const pageCustomers = asArray(response.data);
      setCustomers((current) => {
        if (!append) return pageCustomers;
        const merged = new Map(current.map((customer) => [customer.id ?? customer.id_cliente, customer]));
        pageCustomers.forEach((customer) => merged.set(customer.id ?? customer.id_cliente, customer));
        return [...merged.values()];
      });

      const meta = response.data?.pagination ?? {};
      setPagination({
        currentPage: Number(meta.current_page || page),
        lastPage: Number(meta.last_page || 1),
        total: Number(meta.total ?? pageCustomers.length),
      });
    } catch (requestError) {
      if (requestId === requestIdRef.current) {
        setError(getErrorMessage(requestError, "Não foi possível carregar a base de clientes."));
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(
      () => load({ search: query.trim() }),
      query.trim() ? 300 : 0,
    );
    return () => window.clearTimeout(timer);
  }, [load, query]);

  if (loading && !customers.length) return <AdminLoading label="Carregando relacionamentos…" />;
  if (error && !customers.length) return <AdminError message={error} onRetry={load} />;

  return (
    <div className="admin-page">
      <AdminPageHeader
        eyebrow="Relacionamento"
        title="Clientes"
        description="Uma visão simples e respeitosa dos contatos que já compraram com você."
        actions={(
          <button
            type="button"
            className="admin-button admin-button--ghost"
            onClick={() => load({ search: query.trim() })}
            disabled={loading || loadingMore}
          >
            <FiRefreshCw className={loading ? "is-spinning" : ""} aria-hidden="true" />
            Atualizar
          </button>
        )}
      />

      <section className="admin-customer-summary" aria-label="Resumo de clientes">
        <article>
          <span><FiUsers aria-hidden="true" /></span>
          <div><strong>{pagination.total}</strong><p>{query.trim() ? "clientes encontrados" : "clientes cadastrados"}</p></div>
        </article>
        <p>Os dados aparecem apenas para administradores autenticados e devem ser usados somente no atendimento.</p>
      </section>

      <section className="admin-toolbar">
        <label className="admin-search">
          <FiSearch aria-hidden="true" />
          <span className="sr-only">Buscar cliente</span>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nome ou telefone" />
        </label>
        <span className="admin-toolbar__count">{customers.length} de {pagination.total} resultado(s)</span>
      </section>

      {error && customers.length > 0 && <div className="admin-inline-warning" role="alert">{error}</div>}

      {customers.length ? (
        <>
          <section className="admin-panel admin-customer-list" aria-busy={loading || loadingMore}>
          {customers.map((customer) => {
            const whatsapp = normalizeWhatsapp(customer.telefone);
            return (
              <article className="admin-customer-row" key={customer.id ?? customer.id_cliente}>
                <span className="admin-customer-row__avatar"><FiUser aria-hidden="true" /></span>
                <div>
                  <strong>{customer.nome}</strong>
                  <small>{formatPhone(customer.telefone)}</small>
                </div>
                {whatsapp && (
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-button admin-button--whatsapp"
                    aria-label={`Conversar com ${customer.nome} no WhatsApp`}
                  >
                    <FiMessageCircle aria-hidden="true" />
                    Conversar
                  </a>
                )}
              </article>
            );
          })}
          </section>
          {pagination.currentPage < pagination.lastPage && (
            <div className="admin-pagination">
              <button
                type="button"
                className="admin-button admin-button--ghost"
                onClick={() => load({
                  page: pagination.currentPage + 1,
                  append: true,
                  search: query.trim(),
                })}
                disabled={loading || loadingMore}
              >
                {loadingMore ? "Carregando…" : "Carregar mais clientes"}
              </button>
              <small>{customers.length} de {pagination.total} clientes carregados</small>
            </div>
          )}
        </>
      ) : (
        <AdminEmpty
          title={query.trim() ? "Nenhum cliente encontrado" : "Sua base ainda está vazia"}
          description={query.trim() ? "Tente buscar por outro nome ou telefone." : "Os clientes aparecerão aqui após se identificarem no checkout."}
        />
      )}
    </div>
  );
}
