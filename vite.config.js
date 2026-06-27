import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    // ❗ disable visualizer in production builds
    process.env.NODE_ENV === "development" &&
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
        emitFile: false,
      }),
  ].filter(Boolean),

  server: {
    proxy: {
      "/api": {
        target: "http://192.168.29.144:8090",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    outDir: "build",

    // ⭐ FIX 1: chunk splitting (VERY IMPORTANT)
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },

    // ⭐ FIX 2: reduce warning noise
    chunkSizeWarningLimit: 1000,

    // ⭐ FIX 3: faster build cache
    cacheDir: "node_modules/.vite",
  },
});