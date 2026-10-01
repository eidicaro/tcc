export function moneyToCents(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? Math.round(amount * 100) : 0;
}

export function centsToMoney(value) {
  return Math.round(Number(value) || 0) / 100;
}

export function getItemUnitTotalCents(item) {
  const basePrice = moneyToCents(item?.price ?? item?.preco ?? item?.preco_unitario ?? 0);
  const additions = item?.additionals ?? item?.adicionais ?? [];
  const additionsTotal = additions.reduce((total, additional) => {
    const price = moneyToCents(additional?.price ?? additional?.preco ?? additional?.preco_unitario ?? 0);
    const quantity = Math.max(0, Math.trunc(Number(additional?.quantity ?? additional?.quantidade ?? 1)));
    return total + price * quantity;
  }, 0);
  return basePrice + additionsTotal;
}

export function getItemUnitTotal(item) {
  return centsToMoney(getItemUnitTotalCents(item));
}

export function getItemTotalCents(item) {
  const quantity = Math.max(0, Math.trunc(Number(item?.quantity ?? item?.quantidade ?? 1)));
  return getItemUnitTotalCents(item) * quantity;
}

export function getItemTotal(item) {
  return centsToMoney(getItemTotalCents(item));
}

export function getCartSubtotalCents(items = []) {
  return items.reduce((total, item) => total + getItemTotalCents(item), 0);
}

export function getCartSubtotal(items = []) {
  return centsToMoney(getCartSubtotalCents(items));
}

export function getCartQuantity(items = []) {
  return items.reduce(
    (total, item) => total + Math.max(0, Math.trunc(Number(item?.quantity ?? item?.quantidade ?? 0))),
    0,
  );
}
