import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const base = mode === "production" ? process.env.VITE_BASE_PATH ?? "./" : "/";
  const devHost = process.env.DEV_HOST ?? "0.0.0.0";
  const devPort = Number(process.env.DEV_PORT ?? 5173);
  const previewHost = process.env.PREVIEW_HOST ?? "0.0.0.0";
  const previewPort = Number(process.env.PREVIEW_PORT ?? 4173);

  return {
    base,
    server: {
      host: devHost,
      port: devPort,
    },
    preview: {
      host: previewHost,
      port: previewPort,
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
