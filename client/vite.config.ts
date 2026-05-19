<<<<<<< HEAD
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base = (env.VITE_BASE_PATH || "/").trim();

  return {
    base,
    plugins: [react()],
    cacheDir: ".vite",
    server: { strictPort: true },
  };
=======
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
  server: { strictPort: true },
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
});
