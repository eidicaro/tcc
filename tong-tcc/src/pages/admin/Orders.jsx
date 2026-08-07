import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiMapPin,
  FiMessageCircle,
  FiRefreshCw,
  FiSearch,
  FiShoppingBag,
} from "react-icons/fi";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { AdminEmpty, AdminError, AdminLoading } from "../../components/admin/AdminPageState";
import { useStoreFormatting } from "../../hooks/useStoreFormatting";
import { api, getErrorMessage } from "../../services/api";

const orderStatuses = [
  ["novo", "Novo"],
  ["confirmado", "Confirmado"],
  ["preparando", "Em preparo"],
  ["saiu_entrega", "Em entrega"],
  ["concluido", "Concluído"],
  ["cancelado", "Cancelado"],
];

const paymentStatuses = [
  ["pendente", "Pendente"],
  ["pago", "Pago"],
  ["cancelado", "Cancelado"],
];

const orderStatusLabel = Object.fromEntries(orderStatuses);
const paymentStatusLabel = Object.fromEntries(paymentStatuses);

export const orderItemTotal = (item) => {
  const additions = (item.adicionais || []).reduce(
    (sum, additional) => sum + Number(additional.preco_unitario || 0) * Number(additional.quantidade || 0),
    0,
  );
  return (Number(item.preco_unitario || 0) + additions) * Number(item.quantidade || 1);
};

const asArray = (payload) => {
  const value = payload?.data?.pedidos ?? payload?.pedidos ?? payload?.data ?? payload;
  return Array.isArray(value) ? value : [];
};

const phoneForWhatsapp = (value = "") => {
  const digits = String(value).replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("55") ? digits : `55${digits}`;
};

const buildWhatsappMessage = (order, formatCurrency) => {
  const items = (order.itens || []).map((item) => {
    const productName = item.produto?.nome || item.produto_nome || "Produto";
    const extras = (item.adicionais || []).map((extra) => {
      const name = extra.adicional?.nome || extra.adicional_nome || "Adicional";
      return `   + ${extra.quantidade}x ${name}`;
    });
    return [`• ${item.quantidade}x ${productName}`, ...extras].join("\n");
  }).join("\n");

  const change = order.troco ? `\nTroco para: ${formatCurrency(order.troco)}` : "";
  const observation = order.observacao ? `\nObservação: ${order.observacao}` : "";
  const destination = order.tipo_pedido === "local" ? "Retirada / consumo local" : order.endereco;

  return [
    `Olá, ${order.cliente?.nome || "cliente"}! Seu pedido #${order.id_pedido} foi recebido.`,
    "",
    items || "Itens confirmados.",
    observation,
    "",
    `Entrega: ${destination || "A combinar"}`,
    `Pagamento: ${order.forma_pagamento}${change}`,
    `Total: ${formatCurrency(order.total)}`,
    "",
    "Obrigado pela preferência!",
  ].filter((line) => line !== "").join("\n");
};

export default function Orders() {
  const { formatCurrency, formatDateTime } = useStoreFormatting();
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ativos");
  const [expanded, setExpanded] = useState(new Set());
  const [updating, setUpdating] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1, total: 0 });

  const load = useCallback(async ({ silent = false, page = 1, append = false } = {}) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const response = await api.get("/admin/pedidos", { params: { page, per_page: 50 } });
      const pageOrders = asArray(response.data);
      setOrders((current) => {
        if (!append && !silent) return pageOrders;
        const merged = new Map(current.map((order) => [order.id_pedido, order]));
        pageOrders.forEach((order) => merged.set(order.id_pedido, order));
        return [...merged.values()].sort((left, right) => right.id_pedido - left.id_pedido);
      });

      const meta = response.data?.pagination ?? {};
      setPagination((current) => ({
        currentPage: append
          ? Number(meta.current_page || page)
          : silent
            ? Math.max(current.currentPage, Number(meta.current_page || 1))
            : Number(meta.current_page || 1),
        lastPage: Number(meta.last_page || 1),
        total: Number(meta.total ?? pageOrders.length),
      }));
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Não foi possível sincronizar os pedidos."));
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = window.setInterval(() => load({ silent: true, page: 1 }), 60000);
    return () => window.clearInterval(interval);
  }, [load]);

  useEffect(() => {
    if (!feedback) return undefined;
    const timer = window.setTimeout(() => setFeedback(null), 2600);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    const activeStatuses = new Set(["novo", "confirmado", "preparando", "saiu_entrega"]);
    return orders.filter((order) => {
      const matchesStatus = status === "todos"
        || (status === "ativos" ? activeStatuses.has(order.status_pedido || "novo") : order.status_pedido === status);
      const haystack = `${order.id_pedido} ${order.cliente?.nome || ""} ${order.cliente?.telefone || ""} ${order.endereco || ""}`.toLocaleLowerCase("pt-BR");
      return matchesStatus && (!normalized || haystack.includes(normalized));
    });
  }, [orders, query, status]);

  const summary = useMemo(() => ({
    active: orders.filter((order) => ["novo", "confirmado", "preparando", "saiu_entrega"].includes(order.status_pedido || "novo")).length,
    new: orders.filter((order) => (order.status_pedido || "novo") === "novo").length,
    preparing: orders.filter((order) => order.status_pedido === "preparando").length,
  }), [orders]);

  const toggleExpanded = (id) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const updateStatus = async (order, field, value) => {
    const key = `${order.id_pedido}-${field}`;
    if (updating.has(key)) return;
    setUpdating((current) => new Set(current).add(key));

    try {
      const response = await api.put(`/admin/pedidos/${order.id_pedido}/status`, { [field]: value });
      const updated = response.data?.pedido ?? response.data?.data ?? { ...order, [field]: value };
      setOrders((current) => current.map((entry) => entry.id_pedido === order.id_pedido ? { ...entry, ...updated, [field]: value } : entry));
      setFeedback({ message: "Status atualizado.", tone: "success" });
    } catch (requestError) {
      setFeedback({ message: getErrorMessage(requestError, "Não foi possível atualizar o pedido."), tone: "error" });
    } finally {
      setUpdating((current) => {
        const next = new Set(current);
        next.delete(key);
        return next;
      });
    }
  };

  const openWhatsapp = (order) => {
    const number = phoneForWhatsapp(order.cliente?.telefone);
    if (!number) {
      setFeedback({ message: "Este pedido não possui telefone para contato.", tone: "error" });
      return;
    }
    const windowRef = window.open(`https://wa.me/${number}?text=${encodeURIComponent(buildWhatsappMessage(order, formatCurrency))}`, "_blank", "noopener,noreferrer");
    if (windowRef) windowRef.opener = null;
  };

  if (loading && !orders.length) return <AdminLoading label="Sincronizando pedidos…" />;
  if (error && !orders.length) return <AdminError message={error} onRetry={load} />;

  return (
    <div className="admin-page">
      <AdminPageHeader
        eyebrow="Operação ao vivo"
        title="Pedidos"
        description="Do recebimento à entrega, cada etapa clara para a equipe e para o cliente."
        actions={(
          <button type="button" className="admin-button admin-button--ghost" onClick={() => load()} disabled={loading}>
            <FiRefreshCw className={loading ? "is-spinning" : ""} aria-hidden="true" />
            Atualizar
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
      {error && <div className="admin-inline-warning" role="status">{error}</div>}

      <section className="admin-order-summary" aria-label="Resumo de pedidos ativos">
        <article><strong>{summary.active}</strong><span>ativos agora</span></article>
        <article><strong>{summary.new}</strong><span>novos</span></article>
        <article><strong>{summary.preparing}</strong><span>em preparo</span></article>
      </section>

      <section className="admin-toolbar admin-toolbar--orders">
        <label className="admin-search">
          <FiSearch aria-hidden="true" />
          <span className="sr-only">Buscar pedido</span>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pedido, cliente, telefone ou endereço" />
        </label>
        <label className="admin-select-field">
          <span className="sr-only">Filtrar por status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="ativos">Pedidos ativos</option>
            <option value="todos">Todos os pedidos</option>
            {orderStatuses.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
          </select>
        </label>
      </section>

      {filtered.length ? (
        <section className="admin-orders-list" aria-label="Lista de pedidos">
            {filtered.map((order) => {
            const isExpanded = expanded.has(order.id_pedido);
            return (
              <article className={`admin-order-card admin-order-card--${order.status_pedido || "novo"}`} key={order.id_pedido}>
                <header className="admin-order-card__header">
                  <div className="admin-order-card__identity">
                    <span className="admin-order-card__number">#{String(order.id_pedido).padStart(4, "0")}</span>
                    <div>
                      <h2>{order.cliente?.nome || "Cliente não identificado"}</h2>
                      <p><FiClock aria-hidden="true" /> {formatDateTime(order.created_at, "Horário indisponível")}</p>
                    </div>
                  </div>
                  <span className={`admin-status admin-status--${order.status_pedido || "novo"}`}>
                    {orderStatusLabel[order.status_pedido || "novo"]}
                  </span>
                  <strong className="admin-order-card__total">{formatCurrency(order.total)}</strong>
                </header>

                <div className="admin-order-card__meta">
                  <p><FiMapPin aria-hidden="true" /><span>{order.tipo_pedido === "local" ? "Retirada / consumo local" : order.endereco || "Endereço não informado"}</span></p>
                  <p><FiShoppingBag aria-hidden="true" /><span>{(order.itens || []).reduce((sum, item) => sum + Number(item.quantidade || 0), 0)} item(ns)</span></p>
                </div>

                <div className="admin-order-card__controls">
                  <label>
                    <span>Andamento</span>
                    <select
                      value={order.status_pedido || "novo"}
                      onChange={(event) => updateStatus(order, "status_pedido", event.target.value)}
                      disabled={updating.has(`${order.id_pedido}-status_pedido`)}
                    >
                      {orderStatuses.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
                    </select>
                  </label>
                  <label>
                    <span>Pagamento</span>
                    <select
                      value={order.status_pagamento || "pendente"}
                      onChange={(event) => updateStatus(order, "status_pagamento", event.target.value)}
                      disabled={updating.has(`${order.id_pedido}-status_pagamento`)}
                    >
                      {paymentStatuses.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
                    </select>
                  </label>
                  <button type="button" className="admin-button admin-button--whatsapp" onClick={() => openWhatsapp(order)}>
                    <FiMessageCircle aria-hidden="true" /> WhatsApp
                  </button>
                  <button type="button" className="admin-order-card__expand" onClick={() => toggleExpanded(order.id_pedido)} aria-expanded={isExpanded}>
                    Detalhes {isExpanded ? <FiChevronUp aria-hidden="true" /> : <FiChevronDown aria-hidden="true" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="admin-order-details">
                    <div className="admin-order-details__items">
                      {(order.itens || []).map((item) => (
                        <div className="admin-order-item" key={item.id}>
                          <span>{item.quantidade}×</span>
                          <div>
                            <strong>{item.produto?.nome || item.produto_nome || "Produto"}</strong>
                            {(item.adicionais || []).length > 0 && (
                              <ul>
                                {item.adicionais.map((extra) => (
                                  <li key={extra.id}>{extra.quantidade}× {extra.adicional?.nome || extra.adicional_nome || "Adicional"}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <strong>{formatCurrency(orderItemTotal(item))}</strong>
                        </div>
                      ))}
                    </div>
                    <dl className="admin-order-details__summary">
                      <div><dt>Subtotal</dt><dd>{formatCurrency(order.subtotal ?? (Number(order.total || 0) - Number(order.taxa_entrega || 0)))}</dd></div>
                      <div><dt>Entrega</dt><dd>{formatCurrency(order.taxa_entrega)}</dd></div>
                      <div><dt>Pagamento</dt><dd>{order.forma_pagamento} · {paymentStatusLabel[order.status_pagamento || "pendente"]}</dd></div>
                      {order.troco && <div><dt>Troco para</dt><dd>{formatCurrency(order.troco)}</dd></div>}
                      {order.observacao && <div className="admin-order-details__note"><dt>Observação</dt><dd>{order.observacao}</dd></div>}
                    </dl>
                  </div>
                )}
              </article>
            );
            })}
        </section>
      ) : (
        <AdminEmpty
          title="Nenhum pedido neste filtro"
          description={orders.length ? "Altere o status ou a busca para ver outros pedidos." : "Os novos pedidos aparecerão aqui automaticamente."}
        />
      )}
      {pagination.currentPage < pagination.lastPage && (
        <div className="admin-pagination">
          <button
            type="button"
            className="admin-button admin-button--ghost"
            onClick={() => load({ page: pagination.currentPage + 1, append: true })}
            disabled={loading}
          >
            {loading ? "Carregando…" : "Carregar pedidos anteriores"}
          </button>
          <small>{orders.length} de {pagination.total} pedidos carregados</small>
        </div>
      )}
    </div>
  );
}
