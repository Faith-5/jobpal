import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      devOptions: {
        enabled: true,
        type: "module",
      },
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "logo.svg",
        "icons/*.png",
        "icons/*.svg",
      ],
      manifest: {
        id: "/",
        name: "JobPal AI - Career Co-pilot & ATS Optimizer",
        short_name: "JobPal",
        description:
          "AI-powered resume tailoring, ATS score analysis, and cover letter optimization platform.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        display_override: ["window-controls-overlay", "standalone", "minimal-ui"],
        orientation: "portrait-primary",
        background_color: "#131313",
        theme_color: "#131313",
        categories: ["productivity", "business", "utilities"],
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/maskable-icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/icons/maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/logo.svg",
            sizes: "150x150",
            type: "image/svg+xml",
            purpose: "any",
          },
        ],
        shortcuts: [
          {
            name: "Tailored CV",
            short_name: "Tailor CV",
            description: "View and customize your AI-tailored resume",
            url: "/tailored-cv",
            icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
          },
          {
            name: "ATS Score Analyzer",
            short_name: "ATS Score",
            description: "Analyze and optimize ATS match score",
            url: "/ats-score",
            icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
          },
          {
            name: "Cover Letter",
            short_name: "Cover Letter",
            description: "Generate targeted cover letters",
            url: "/cover-letter",
            icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
          },
          {
            name: "Dashboard",
            short_name: "Dashboard",
            description: "Overview of your career applications",
            url: "/dashboard",
            icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "google-fonts-stylesheets",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
    hmr: process.env.DISABLE_HMR !== "true",
    watch: process.env.DISABLE_HMR === "true" ? null : {},
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
});
