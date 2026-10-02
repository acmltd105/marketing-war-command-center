import { createRoot } from "react-dom/client";

import { initializeMsal } from "@/lib/msalConfig";
import "./index.css";

async function bootstrap() {
  await initializeMsal();
  const { default: AppRoot } = await import("./AppRoot.tsx");
  const el = document.getElementById("root");
  if (!el) throw new Error("Root element not found");
  createRoot(el).render(<AppRoot />);
}

void bootstrap();
