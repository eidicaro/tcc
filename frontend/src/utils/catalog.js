import { assetUrl } from "../services/api";

export function normalizeCategory(category) {
  if (!category) return null;
  const id = category.id_categoria ?? category.id;
  if (id === undefined || id === null) return null;
  return {
    ...category,
    id,
    name: category.nome ?? category.name ?? "Categoria",
  };
}

export function normalizeAdditional(additional) {
  if (!additional) return null;
  const id = additional.id_adicional ?? additional.adicional_id ?? additional.id;
  if (id === undefined || id === null) return null;
  return {
    ...additional,
    id,
    name: additional.nome ?? additional.name ?? "Adicional",
    price: Number(additional.preco ?? additional.price ?? 0),
    image: assetUrl(additional.imagem_url ?? additional.imagem ?? additional.image),
  };
}

export function normalizeProduct(product) {
  if (!product) return null;
  const id = product.id_produto ?? product.produto_id ?? product.id;
  if (id === undefined || id === null) return null;

  return {
    ...product,
    id,
    name: product.nome ?? product.name ?? "Produto",
    description: product.descricao ?? product.description ?? "",
    price: Number(product.preco ?? product.price ?? 0),
    categoryId:
      product.id_categoria ?? product.categoria_id ?? product.category_id ?? product.categoria?.id,
    image: assetUrl(product.imagem_url ?? product.imagem ?? product.image),
    featured: Boolean(product.destaque ?? product.featured),
    available: product.disponivel === undefined ? product.available !== false : Boolean(product.disponivel),
  };
}

export function unwrapList(payload, keys = []) {
  if (Array.isArray(payload)) return payload;
  for (const key of [...keys, "data"]) {
    if (Array.isArray(payload?.[key])) return payload[key];
  }
  return [];
}

export function sortByOrderAndName(items = []) {
  return [...items].sort((left, right) => (
    Number(left?.ordem || 0) - Number(right?.ordem || 0)
    || String(left?.nome ?? left?.name ?? "").localeCompare(
      String(right?.nome ?? right?.name ?? ""),
      "pt-BR",
      { sensitivity: "base" },
    )
  ));
}
