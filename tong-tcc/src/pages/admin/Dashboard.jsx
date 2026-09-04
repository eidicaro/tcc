import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiArrowUpRight,
  FiBox,
  FiClock,
  FiDollarSign,
  FiRefreshCw,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";
import { Link } from "../../routing/Router";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { AdminError, AdminLoading } from "../../components/admin/AdminPageState";
import { useStoreFormatting } from "../../hooks/useStoreFormatting";
import { api, getErrorMessage } from "../../services/api";

const statusLabels = {
  novo: "Novo",
  confirmado: "Confirmado",
  preparando: "Em preparo",
  saiu_entrega: "Em entrega",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

export default function Dashboard() {
  const { formatCurrency, formatDateTime } = useStoreFormatting();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/admin/dashboard");
      setData(response.data?.data ?? response.data ?? {});
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Tente novamente em alguns instantes."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const metrics = data?.metrics ?? {};
  const recentOrders = data?.recent_orders ?? [];
  const sales = data?.sales_last_7_days ?? [];
  const maxSales = useMemo(
    () => Math.max(...sales.map((entry) => Number(entry.total || entry.value || 0)), 1),
    [sales],
  );

  if (loading && !data) return <AdminLoading label="Preparando sua visão geral…" />;
  if (error && !data) return <AdminError message={error} onRetry={loadDashboard} />;

  const cards = [
    {
      label: "Pedidos hoje",
      value: Number(metrics.orders_today ?? 0),
      hint: `${Number(metrics.pending_orders ?? 0)} aguardando ação`,
      icon: FiShoppingBag,
      tone: "orange",
    },
    {
      label: "Faturamento hoje",
      value: formatCurrency(metrics.revenue_today),
      hint: "Pedidos não cancelados",
      icon: FiDollarSign,
      tone: "green",
    },
    {
      label: "Clientes",
      value: Number(metrics.customers ?? metrics.total_customers ?? 0),
      hint: "Base de relacionamento",
      icon: FiUsers,
      tone: "ink",
    },
    {
      label: "Produtos ativos",
      value: Number(metrics.active_products ?? metrics.total_products ?? 0),
      hint: "Disponíveis no catálogo",
      icon: FiBox,
      tone: "cream",
    },
  ];

  return (
    <div className="admin-page admin-dashboard">
      <AdminPageHeader
        eyebrow="Central de operação"
        title="Visão geral"
        description="Acompanhe o que merece atenção agora e tome decisões sem perder o ritmo."
        actions={(
          <button type="button" className="admin-button admin-button--ghost" onClick={loadDashboard} disabled={loading}>
            <FiRefreshCw aria-hidden="true" className={loading ? "is-spinning" : ""} />
            Atualizar
          </button>
        )}
      />

      {error && <div className="admin-inline-warning" role="status">{error}</div>}

      <section className="admin-metrics" aria-label="Indicadores do dia">
        {cards.map(({ label, value, hint, icon: Icon, tone }) => (
          <article key={label} className={`admin-metric-card admin-metric-card--${tone}`}>
            <span className="admin-metric-card__icon"><Icon aria-hidden="true" /></span>
            <div>
              <p>{label}</p>
              <strong>{value}</strong>
              <small>{hint}</small>
            </div>
          </article>
        ))}
      </section>

      <div className="admin-dashboard-grid">
        <section className="admin-panel admin-sales-panel">
          <header className="admin-panel__header">
            <div>
              <p className="admin-panel__eyebrow">Últimos 7 dias</p>
              <h2>Ritmo de vendas</h2>
            </div>
            <span className="admin-panel__total">
              {formatCurrency(sales.reduce((sum, entry) => sum + Number(entry.total || entry.value || 0), 0))}
            </span>
          </header>

          {sales.length > 0 ? (
            <div className="admin-mini-chart" aria-label="Vendas dos últimos sete dias">
              {sales.map((entry) => {
                const value = Number(entry.total || entry.value || 0);
                return (
                  <div className="admin-mini-chart__column" key={entry.date || entry.label}>
                    <span className="admin-mini-chart__value">{formatCurrency(value)}</span>
                    <span className="admin-mini-chart__track">
                      <span style={{ height: `${Math.max((value / maxSales) * 100, 4)}%` }} />
                    </span>
                    <small>{entry.label || entry.date}</small>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="admin-chart-empty">
              <FiClock aria-hidden="true" />
              <p>As vendas aparecerão aqui assim que os primeiros pedidos entrarem.</p>
            </div>
          )}
        </section>

        <aside className="admin-panel admin-quick-panel">
          <header className="admin-panel__header">
            <div>
              <p className="admin-panel__eyebrow">Atalhos</p>
              <h2>Agilize a rotina</h2>
            </div>
          </header>
          <Link to="/admin/pedidos" className="admin-quick-link">
            <span><FiShoppingBag aria-hidden="true" /></span>
            <div><strong>Abrir pedidos</strong><small>Atualizar preparo e entrega</small></div>
            <FiArrowUpRight aria-hidden="true" />
          </Link>
          <Link to="/admin/produtos" className="admin-quick-link">
            <span><FiBox aria-hidden="true" /></span>
            <div><strong>Editar catálogo</strong><small>Preço, foto e disponibilidade</small></div>
            <FiArrowUpRight aria-hidden="true" />
          </Link>
        </aside>
      </div>

      <section className="admin-panel admin-recent-orders">
        <header className="admin-panel__header">
          <div>
            <p className="admin-panel__eyebrow">Tempo real</p>
            <h2>Pedidos recentes</h2>
          </div>
          <Link to="/admin/pedidos" className="admin-text-link">Ver todos <FiArrowUpRight aria-hidden="true" /></Link>
        </header>

        {recentOrders.length > 0 ? (
          <div className="admin-order-list">
            {recentOrders.map((order) => (
              <article key={order.id_pedido} className="admin-order-row">
                <span className="admin-order-row__id">#{String(order.id_pedido).padStart(4, "0")}</span>
                <div className="admin-order-row__customer">
                  <strong>{order.cliente?.nome || "Cliente não identificado"}</strong>
                  <small>{order.tipo_pedido === "local" ? "Retirada / local" : order.endereco || "Delivery"}</small>
                </div>
                <span className={`admin-status admin-status--${order.status_pedido || "novo"}`}>
                  {statusLabels[order.status_pedido] || order.status_pedido || "Novo"}
                </span>
                <time dateTime={order.created_at}>{formatDateTime(order.created_at)}</time>
                <strong className="admin-order-row__total">{formatCurrency(order.total)}</strong>
              </article>
            ))}
          </div>
        ) : (
          <p className="admin-panel__empty">Nenhum pedido registrado ainda.</p>
        )}
      </section>
    </div>
  );
}
