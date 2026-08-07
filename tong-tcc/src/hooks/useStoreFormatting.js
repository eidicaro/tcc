import { useCallback, useMemo } from "react";
import { useStore } from "../contexts/StoreContext";

function safeLocale(value) {
  const locale = String(value || "pt-BR").replace("_", "-");
  try {
    new Intl.NumberFormat(locale);
    return locale;
  } catch {
    return "pt-BR";
  }
}

function safeCurrency(value) {
  const currency = String(value || "BRL").toUpperCase();
  return /^[A-Z]{3}$/.test(currency) ? currency : "BRL";
}

function safeTimezone(value) {
  const timezone = String(value || "America/Sao_Paulo");
  try {
    new Intl.DateTimeFormat("pt-BR", { timeZone: timezone });
    return timezone;
  } catch {
    return "America/Sao_Paulo";
  }
}

export function useStoreFormatting() {
  const { store } = useStore();
  const locale = safeLocale(store.locale);
  const currencyCode = safeCurrency(store.currency);
  const timezone = safeTimezone(store.timezone);
  const currencyFormatter = useMemo(
    () => new Intl.NumberFormat(locale, { style: "currency", currency: currencyCode }),
    [currencyCode, locale],
  );
  const dateTimeFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: timezone,
    }),
    [locale, timezone],
  );

  const formatCurrency = useCallback((value) => {
    const amount = Number(value);
    return currencyFormatter.format(Number.isFinite(amount) ? amount : 0);
  }, [currencyFormatter]);

  const formatDateTime = useCallback((value, fallback = "—") => {
    if (!value) return fallback;
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? fallback : dateTimeFormatter.format(date);
  }, [dateTimeFormatter]);

  return { currencyCode, locale, timezone, formatCurrency, formatDateTime };
}
