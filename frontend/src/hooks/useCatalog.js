import { useCallback, useEffect, useState } from "react";
import { api, getErrorMessage } from "../services/api";
import {
  normalizeAdditional,
  normalizeCategory,
  normalizeProduct,
  unwrapList,
} from "../utils/catalog";

const CACHE_TTL = 60_000;
let catalogCache;
let catalogRequest;

async function requestCatalog() {
  const [productsResult, categoriesResult, additionalsResult] = await Promise.allSettled([
    api.get("/produtos"),
    api.get("/categoria"),
    api.get("/adicionais"),
  ]);

  if (productsResult.status === "rejected") throw productsResult.reason;

  const products = unwrapList(productsResult.value.data, ["produtos"])
    .map(normalizeProduct)
    .filter(Boolean);
  const categories =
    categoriesResult.status === "fulfilled"
      ? unwrapList(categoriesResult.value.data, ["categorias"]).map(normalizeCategory).filter(Boolean)
      : [];
  const additionals =
    additionalsResult.status === "fulfilled"
      ? unwrapList(additionalsResult.value.data, ["adicionais"])
          .map(normalizeAdditional)
          .filter(Boolean)
      : [];

  return {
    products,
    categories,
    additionals,
    partial:
      categoriesResult.status === "rejected" || additionalsResult.status === "rejected",
    loadedAt: Date.now(),
  };
}

function loadCatalog(force = false) {
  if (!force && catalogCache && Date.now() - catalogCache.loadedAt < CACHE_TTL) {
    return Promise.resolve(catalogCache);
  }
  if (!force && catalogRequest) return catalogRequest;

  catalogRequest = requestCatalog()
    .then((result) => {
      catalogCache = result;
      return result;
    })
    .finally(() => {
      catalogRequest = undefined;
    });
  return catalogRequest;
}

export function useCatalog() {
  const [data, setData] = useState(
    catalogCache ?? { products: [], categories: [], additionals: [], partial: false },
  );
  const [loading, setLoading] = useState(!catalogCache);
  const [error, setError] = useState("");

  const reload = useCallback(async ({ force = true } = {}) => {
    setLoading(true);
    setError("");
    try {
      const result = await loadCatalog(force);
      setData(result);
      return result;
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Não foi possível carregar o cardápio."));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(!catalogCache);
    loadCatalog()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((requestError) => {
        if (active) {
          setError(getErrorMessage(requestError, "Não foi possível carregar o cardápio."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { ...data, loading, error, reload };
}

export function clearCatalogCache() {
  catalogCache = undefined;
  catalogRequest = undefined;
}

