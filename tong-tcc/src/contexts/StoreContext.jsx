import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import tongLogo from "../images/tong-2.svg";
import heroImage from "../images/poke.png";
import genericLogo from "../images/store-placeholder.svg";
import genericHero from "../images/store-hero-placeholder.svg";
import { api, assetUrl, getErrorMessage } from "../services/api";
import { getStoreVocabulary } from "../utils/storefront";

const FALLBACK_THEME = {
  ink: "#111111",
  orange: "#F48347",
  green: "#03391D",
  surface: "#F8F5EF",
  muted: "#D9D9D9",
};

const GENERIC_COPY = {
  tagline: "Uma experiência feita para você.",
  description: "Produtos selecionados, atendimento cuidadoso e pedidos preparados em cada detalhe.",
  address: "Endereço ainda não configurado",
  city: "Consulte o estabelecimento",
};

export const FALLBACK_STORE = {
  id: "tong-sushi",
  name: "Tong Sushi",
  shortName: "Tong",
  businessType: "restaurant",
  locale: "pt-BR",
  currency: "BRL",
  timezone: "America/Sao_Paulo",
  tagline: "Culinária japonesa, elevada ao essencial.",
  description:
    "Ingredientes selecionados, técnica precisa e uma experiência preparada em cada detalhe.",
  logo: tongLogo,
  heroImage,
  theme: FALLBACK_THEME,
  contact: {
    phone: "",
    whatsapp: "",
    instagram: "https://www.instagram.com/tongsushidelivery",
    facebook: "https://www.facebook.com/diddyacasadoyakisoba?locale=pt_BR",
  },
  location: {
    address: "Rua Orlando Sartorelli, 45 — Centro",
    city: "Iperó — SP",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4356.226877656857!2d-47.6898667!3d-23.3514105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8396108f88ca8cb3%3A0x87a04fcb137e595!2sTong%20Sushi%20Iper%C3%B3!5e0!3m2!1spt-BR!2sbr!4v1709918912454!5m2!1spt-BR!2sbr",
  },
  hours: [
    { label: "Segunda a quinta", value: "18h30 — 22h" },
    { label: "Sexta e sábado", value: "18h30 — 22h30" },
    { label: "Domingo", value: "Consulte o atendimento" },
  ],
  order: {
    deliveryFee: 3,
    minimum: 0,
    estimate: "40–90 min",
    fulfillment: ["delivery", "local"],
    paymentMethods: ["Pix", "Cartão", "Dinheiro"],
  },
  featuredProductIds: [],
};

const initialName = import.meta.env.VITE_STORE_NAME || FALLBACK_STORE.name;
const initialUsesTongBrand = /tong/i.test(initialName);

const INITIAL_STORE = {
  ...FALLBACK_STORE,
  name: initialName,
  shortName: import.meta.env.VITE_STORE_SHORT_NAME || import.meta.env.VITE_STORE_NAME || FALLBACK_STORE.shortName,
  description: import.meta.env.VITE_STORE_DESCRIPTION || FALLBACK_STORE.description,
  logo: import.meta.env.VITE_STORE_ICON || (initialUsesTongBrand ? FALLBACK_STORE.logo : genericLogo),
  heroImage: import.meta.env.VITE_STORE_HERO_IMAGE
    || (initialUsesTongBrand ? FALLBACK_STORE.heroImage : genericHero),
  theme: normalizeTheme({
    ink: validHexColor(import.meta.env.VITE_STORE_INK_COLOR, FALLBACK_THEME.ink),
    orange: validHexColor(import.meta.env.VITE_STORE_PRIMARY_COLOR, FALLBACK_THEME.orange),
    green: validHexColor(import.meta.env.VITE_STORE_THEME_COLOR, FALLBACK_THEME.green),
    surface: validHexColor(import.meta.env.VITE_STORE_BACKGROUND_COLOR, FALLBACK_THEME.surface),
  }),
};

const StoreContext = createContext(null);

function validHexColor(value, fallback) {
  return /^#[0-9a-f]{6}$/i.test(String(value || "")) ? value : fallback;
}

function relativeLuminance(hex) {
  const channels = hex.slice(1).match(/.{2}/g).map((value) => parseInt(value, 16) / 255);
  const [red, green, blue] = channels.map((value) => (
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  ));
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(left, right) {
  const light = Math.max(relativeLuminance(left), relativeLuminance(right));
  const dark = Math.min(relativeLuminance(left), relativeLuminance(right));
  return (light + 0.05) / (dark + 0.05);
}

export function normalizeTheme(theme = {}) {
  const inkCandidate = validHexColor(theme.ink, FALLBACK_THEME.ink);
  const ink = contrastRatio(inkCandidate, "#FFFFFF") >= 4.5
    && contrastRatio(inkCandidate, FALLBACK_THEME.orange) >= 4.5
    && contrastRatio(inkCandidate, FALLBACK_THEME.surface) >= 4.5
    ? inkCandidate
    : FALLBACK_THEME.ink;
  const greenCandidate = validHexColor(theme.green, FALLBACK_THEME.green);
  const green = contrastRatio(greenCandidate, "#FFFFFF") >= 4.5
    ? greenCandidate
    : FALLBACK_THEME.green;
  const orangeCandidate = validHexColor(theme.orange, FALLBACK_THEME.orange);
  const orange = contrastRatio(orangeCandidate, ink) >= 4.5
    ? orangeCandidate
    : FALLBACK_THEME.orange;
  const surfaceCandidate = validHexColor(theme.surface, FALLBACK_THEME.surface);
  const surface = contrastRatio(surfaceCandidate, ink) >= 4.5
    ? surfaceCandidate
    : FALLBACK_THEME.surface;

  return {
    ink,
    orange,
    green,
    surface,
    muted: validHexColor(theme.muted, FALLBACK_THEME.muted),
  };
}

function safeExternalUrl(value, fallback = "") {
  if (!value) return fallback;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : fallback;
  } catch {
    return fallback;
  }
}

function nonEmptyString(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function normalizeStore(payload) {
  const raw = payload?.store ?? payload?.estabelecimento ?? payload ?? {};
  const theme = raw.theme ?? raw.tema ?? raw.cores ?? {};
  const contact = raw.contact ?? raw.contato ?? {};
  const location = raw.location ?? raw.localizacao ?? {};
  const order = raw.order ?? raw.pedido ?? {};
  const explicitName = nonEmptyString(raw.name ?? raw.nome, "");
  const usesTongBrand = /tong/i.test(`${raw.id ?? raw.slug ?? ""} ${explicitName}`)
    || explicitName === "";
  const copyFallback = usesTongBrand ? FALLBACK_STORE : GENERIC_COPY;
  const address = nonEmptyString(
    location.address ?? location.endereco ?? raw.endereco,
    usesTongBrand ? FALLBACK_STORE.location.address : GENERIC_COPY.address,
  );
  const city = nonEmptyString(
    location.city ?? location.cidade ?? raw.cidade,
    usesTongBrand ? FALLBACK_STORE.location.city : GENERIC_COPY.city,
  );
  const genericMapUrl = `https://www.google.com/maps?q=${encodeURIComponent(`${address}, ${city}`)}&output=embed`;

  return {
    ...FALLBACK_STORE,
    id: raw.id ?? raw.slug ?? FALLBACK_STORE.id,
    name: explicitName || FALLBACK_STORE.name,
    shortName: nonEmptyString(
      raw.short_name ?? raw.nome_curto ?? raw.name ?? raw.nome,
      usesTongBrand ? FALLBACK_STORE.shortName : explicitName,
    ),
    businessType: raw.business_type ?? raw.tipo_negocio ?? FALLBACK_STORE.businessType,
    locale: raw.locale ?? FALLBACK_STORE.locale,
    currency: raw.currency ?? FALLBACK_STORE.currency,
    timezone: raw.timezone ?? FALLBACK_STORE.timezone,
    tagline: nonEmptyString(raw.tagline ?? raw.slogan, copyFallback.tagline),
    description: nonEmptyString(raw.description ?? raw.descricao, copyFallback.description),
    logo: assetUrl(raw.logo_url ?? raw.logo, usesTongBrand ? FALLBACK_STORE.logo : genericLogo),
    heroImage: assetUrl(
      raw.hero_image_url ?? raw.imagem_capa,
      usesTongBrand ? FALLBACK_STORE.heroImage : genericHero,
    ),
    theme: normalizeTheme({
      ink: validHexColor(theme.ink ?? theme.preto, FALLBACK_THEME.ink),
      orange: validHexColor(theme.orange ?? theme.laranja, FALLBACK_THEME.orange),
      green: validHexColor(theme.green ?? theme.verde, FALLBACK_THEME.green),
      surface: validHexColor(theme.surface ?? theme.fundo, FALLBACK_THEME.surface),
      muted: validHexColor(theme.muted ?? theme.cinza, FALLBACK_THEME.muted),
    }),
    contact: {
      phone: contact.phone ?? contact.telefone ?? raw.telefone ?? "",
      whatsapp: contact.whatsapp ?? raw.whatsapp ?? contact.phone ?? contact.telefone ?? "",
      instagram: safeExternalUrl(contact.instagram),
      facebook: safeExternalUrl(contact.facebook),
    },
    location: {
      address,
      city,
      mapUrl: safeExternalUrl(
        location.map_url ?? location.mapa_url ?? raw.mapa_url,
        genericMapUrl,
      ),
    },
    hours: Array.isArray(raw.hours ?? raw.horarios)
      ? (raw.hours ?? raw.horarios).map((hour) => ({
          label: hour.label ?? hour.dia ?? "Atendimento",
          value: hour.value ?? hour.horario ?? "Consulte-nos",
        }))
      : FALLBACK_STORE.hours,
    order: {
      deliveryFee: Number(order.delivery_fee ?? order.taxa_entrega ?? FALLBACK_STORE.order.deliveryFee),
      minimum: Number(order.minimum ?? order.pedido_minimo ?? FALLBACK_STORE.order.minimum),
      estimate: order.estimate ?? order.prazo ?? FALLBACK_STORE.order.estimate,
      fulfillment: Array.isArray(order.fulfillment)
        ? order.fulfillment
        : FALLBACK_STORE.order.fulfillment,
      paymentMethods: Array.isArray(order.payment_methods ?? order.formas_pagamento)
        ? order.payment_methods ?? order.formas_pagamento
        : FALLBACK_STORE.order.paymentMethods,
    },
    featuredProductIds: Array.isArray(raw.featured_product_ids ?? raw.produtos_destaque)
      ? raw.featured_product_ids ?? raw.produtos_destaque
      : [],
  };
}

export function StoreProvider({ children }) {
  const [store, setStore] = useState(INITIAL_STORE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingFallback, setUsingFallback] = useState(true);

  const loadStore = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/store");
      setStore(normalizeStore(response.data));
      setUsingFallback(false);
    } catch (requestError) {
      setStore(INITIAL_STORE);
      setUsingFallback(true);
      setError(getErrorMessage(requestError, "Não foi possível carregar a configuração da loja."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStore();
  }, [loadStore]);

  useEffect(() => {
    const root = document.documentElement;
    const vocabulary = getStoreVocabulary(store);
    const pageTitle = `${store.name} | ${vocabulary.catalog} e pedidos`;
    const variables = {
      "--store-ink": store.theme.ink,
      "--store-orange": store.theme.orange,
      "--store-green": store.theme.green,
      "--store-surface": store.theme.surface,
      "--store-muted": store.theme.muted,
    };
    Object.entries(variables).forEach(([name, value]) => root.style.setProperty(name, value));

    document.documentElement.lang = String(store.locale || "pt-BR").replace("_", "-");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", store.theme.green);
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", store.description);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", pageTitle);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", store.description);
    document
      .querySelector('meta[name="twitter:title"]')
      ?.setAttribute("content", pageTitle);
    document
      .querySelector('meta[name="twitter:description"]')
      ?.setAttribute("content", store.description);
  }, [store]);

  const value = useMemo(
    () => ({
      store,
      loading,
      error,
      usingFallback,
      commerceReady: !loading && !usingFallback,
      reload: loadStore,
    }),
    [store, loading, error, usingFallback, loadStore],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore deve ser usado dentro de StoreProvider");
  return context;
}
