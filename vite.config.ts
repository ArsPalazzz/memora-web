import path from "node:path";
import { readFileSync } from "node:fs";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const manifest = JSON.parse(
  readFileSync(new URL("./public/manifest.json", import.meta.url), "utf8"),
) as {
  name: string;
  short_name: string;
  start_url: string;
  display: "standalone";
  orientation: "portrait";
  theme_color: string;
  background_color: string;
  icons: Array<{ src: string; sizes: string; type: string }>;
};

const FIREBASE_SW_PATH = "/firebase-messaging-sw.js";

/** Service-Worker-Allowed header for standalone FCM SW registration in dev. */
function firebaseSwHeadersPlugin(): Plugin {
  return {
    name: "firebase-sw-headers",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith(FIREBASE_SW_PATH)) {
          res.setHeader("Service-Worker-Allowed", "/");
          res.setHeader("Content-Type", "application/javascript; charset=utf-8");
          res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith(FIREBASE_SW_PATH)) {
          res.setHeader("Service-Worker-Allowed", "/");
          res.setHeader("Content-Type", "application/javascript; charset=utf-8");
          res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
        }
        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiUrl = env.VITE_API_URL || "http://localhost:3001";
  const isProd = mode === "production";

  return {
    plugins: [
      react(),
      firebaseSwHeadersPlugin(),
      VitePWA({
        registerType: "autoUpdate",
        strategies: "injectManifest",
        srcDir: "src",
        filename: "sw.ts",
        injectRegister: "auto",
        includeAssets: [
          "logo.png",
          "icons/logo-192x192.png",
          "icons/logo-512x512.png",
        ],
        manifest: {
          name: manifest.name,
          short_name: manifest.short_name,
          start_url: manifest.start_url,
          display: manifest.display,
          orientation: manifest.orientation,
          theme_color: manifest.theme_color,
          background_color: manifest.background_color,
          icons: manifest.icons,
        },
        injectManifest: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2}"],
          globIgnores: [
            "**/firebase-messaging-sw.js",
            "**/firebase-messaging-sw-template.js",
          ],
        },
        devOptions: {
          enabled: false,
        },
        disable: !isProd,
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: "0.0.0.0",
      port: 3000,
      proxy: {
        "/api": {
          target: apiUrl,
          changeOrigin: true,
          rewrite: (requestPath) => requestPath.replace(/^\/api/, ""),
        },
      },
    },
    preview: {
      host: "0.0.0.0",
      port: 3000,
      proxy: {
        "/api": {
          target: apiUrl,
          changeOrigin: true,
          rewrite: (requestPath) => requestPath.replace(/^\/api/, ""),
        },
      },
    },
  };
});
