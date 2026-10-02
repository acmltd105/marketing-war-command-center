import { describe, expect, it, vi, beforeEach } from "vitest";

describe("gatewayClient mock path", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("VITE_USE_MOCK_API", "true");
    vi.stubEnv("VITE_GATEWAY_BASE_URL", "");
  });

  it("fetchHealth returns mock payload", async () => {
    const { fetchHealth } = await import("./gatewayClient");
    const h = await fetchHealth();
    expect(h.status).toBe("ok");
    expect(h.version).toContain("mock");
  });

  it("listParties returns seed rows", async () => {
    const { listParties, resetMockParties } = await import("./gatewayClient");
    resetMockParties();
    const rows = await listParties();
    expect(rows.length).toBeGreaterThanOrEqual(2);
    expect(rows[0].displayName).toBeTruthy();
  });
});
