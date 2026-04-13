import type { LifecycleStage } from "./companyLifecycle";

const STORAGE_KEY = "mwcc:company-workspace-v1";

export type CompanyWorkspaceStateV1 = {
  version: 1;
  displayName: string;
  legalName: string;
  lifecycleStage: LifecycleStage;
  jurisdiction: string;
  websiteUrl: string;
  /** Last 4 of EIN only — never store full FEIN in localStorage */
  feinLastFour: string;
  pressNotes: string;
  milestoneNotes: string;
  /** task id -> done */
  tasksDone: Record<string, boolean>;
  updatedAt: string;
};

const emptyState = (): CompanyWorkspaceStateV1 => ({
  version: 1,
  displayName: "",
  legalName: "",
  lifecycleStage: "idea",
  jurisdiction: "",
  websiteUrl: "",
  feinLastFour: "",
  pressNotes: "",
  milestoneNotes: "",
  tasksDone: {},
  updatedAt: new Date().toISOString(),
});

export function readCompanyWorkspace(): CompanyWorkspaceStateV1 {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<CompanyWorkspaceStateV1>;
    if (parsed.version !== 1) return emptyState();
    return {
      ...emptyState(),
      ...parsed,
      tasksDone: typeof parsed.tasksDone === "object" && parsed.tasksDone !== null ? parsed.tasksDone : {},
    };
  } catch {
    return emptyState();
  }
}

export function writeCompanyWorkspace(state: CompanyWorkspaceStateV1) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...state, updatedAt: new Date().toISOString() }),
    );
  } catch (e) {
    console.warn("Unable to persist company workspace", e);
  }
}

export function clearCompanyWorkspace() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
