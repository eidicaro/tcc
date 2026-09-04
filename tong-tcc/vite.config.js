import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[character]);
}

function mediaTypeFromAsset(asset, fallback = "application/octet-stream") {
  const pathname = String(asset).split(/[?#]/, 1)[0].toLowerCase();
  if (pathname.endsWith(".svg")) return "image/svg+xml";
  if (pathname.endsWith(".png")) return "image/png";
  if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) return "image/jpeg";
  if (pathname.endsWith(".webp")) return "image/webp";
  if (pathname.endsWith(".avif")) return "image/avif";
  if (pathname.endsWith(".gif")) return "image/gif";
  if (pathname.endsWith(".ico")) return "image/x-icon";
  return fallback;
}

function whiteLabelAssets(env) {
  const brand = {
    name: env.VITE_STORE_NAME || "Tong Sushi",
    shortName: env.VITE_STORE_SHORT_NAME || env.VITE_STORE_NAME || "Tong Sushi",
    description:
      env.VITE_STORE_DESCRIPTION ||
      "Cardápio digital, pedidos e atendimento em uma experiência premium.",
    title: env.VITE_STORE_PAGE_TITLE || `${env.VITE_STORE_NAME || "Tong Sushi"} | Catálogo e pedidos`,
    themeColor: /^#[0-9a-f]{6}$/i.test(env.VITE_STORE_THEME_COLOR || "")
      ? env.VITE_STORE_THEME_COLOR
      : "#03391D",
    backgroundColor: /^#[0-9a-f]{6}$/i.test(env.VITE_STORE_BACKGROUND_COLOR || "")
      ? env.VITE_STORE_BACKGROUND_COLOR
      : "#F8F5EF",
    icon: env.VITE_STORE_ICON || "/logo.svg",
    ogImage: env.VITE_STORE_OG_IMAGE || "/og-preview.jpg",
  };

  const manifest = JSON.stringify({
    name: brand.title,
    short_name: brand.shortName,
    description: brand.description,
    lang: "pt-BR",
    start_url: "/",
    scope: "/",
    display: "standalone",
    theme_color: brand.themeColor,
    background_color: brand.backgroundColor,
    icons: [{
      src: brand.icon,
      sizes: env.VITE_STORE_ICON_SIZES || (brand.icon.toLowerCase().includes(".svg") ? "any" : "512x512"),
      type: mediaTypeFromAsset(brand.icon),
      purpose: "any",
    }],
  }, null, 2);

  return {
    name: "white-label-assets",
    transformIndexHtml(html) {
      const replacements = {
        "__STORE_NAME__": brand.name,
        "__STORE_TITLE__": brand.title,
        "__STORE_DESCRIPTION__": brand.description,
        "__STORE_THEME_COLOR__": brand.themeColor,
        "__STORE_ICON__": brand.icon,
        "__STORE_ICON_TYPE__": mediaTypeFromAsset(brand.icon),
        "__STORE_OG_IMAGE__": brand.ogImage,
        "__STORE_OG_IMAGE_TYPE__": mediaTypeFromAsset(brand.ogImage),
      };
      return Object.entries(replacements).reduce(
        (result, [token, value]) => result.replaceAll(token, escapeHtml(value)),
        html,
      );
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url?.split("?")[0] !== "/manifest.webmanifest") return next();
        response.statusCode = 200;
        response.setHeader("Content-Type", "application/manifest+json; charset=utf-8");
        response.end(manifest);
      });
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "manifest.webmanifest", source: manifest });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), whiteLabelAssets(env)],
    server: {
      port: 3000,
    },
    preview: {
      port: 4173,
    },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/test/setup.js",
      css: true,
      restoreMocks: true,
    },
  };
});
