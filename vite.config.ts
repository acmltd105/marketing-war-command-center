import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const base = mode === "production" ? process.env.VITE_BASE_PATH ?? "./" : "/";

  return {
    base,
    server: {
      host: "::",
      port: 8080,
      strictPort: true,
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
    test: {
      environment: "jsdom",
      globals: true,
      include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    },
  };
});
