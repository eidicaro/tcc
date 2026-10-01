const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatCurrency(value) {
  const amount = Number(value);
  return brlFormatter.format(Number.isFinite(amount) ? amount : 0);
}

export function normalizeSearch(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

export function slugify(value) {
  return normalizeSearch(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

export function whatsappUrl(phone, message = "") {
  let digits = digitsOnly(phone);
  if (digits && !digits.startsWith("55")) digits = `55${digits}`;
  if (!digits) return "";
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${query}`;
}

export function safeJsonParse(value, fallback = null) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function createOrderToken() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `pedido-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

