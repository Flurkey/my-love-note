import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
// For GitHub Pages: set BASE_PATH to repo name; we use relative base so assets resolve correctly.
const basePath = process.env.BASE_PATH;
const base = basePath ? "./" : "/";

export default defineConfig({
  base,
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
