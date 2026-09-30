import fs from "fs";
import path from "path";
import { CitizenRequest, Project, Scheme, StateConfig } from "./types";

const CONFIG_STATES_DIR = path.join(process.cwd(), "config", "states");
const DATA_DIR = path.join(process.cwd(), "data");
const SCHEMES_FILE = path.join(DATA_DIR, "schemes.json");
const STORE_FILE = path.join(DATA_DIR, "store.json");
const PRECOMPUTED_DIR = path.join(DATA_DIR, "precomputed");

interface StoreData {
  requests: CitizenRequest[];
  projects: Project[];
  custom_budgets: Record<string, Record<string, number>>; // stateId -> schemeId -> crore
}

class JanSetuStore {
  private statesCache: Map<string, StateConfig> = new Map();
  private schemesCache: Scheme[] = [];
  private data: StoreData = { requests: [], projects: [], custom_budgets: {} };
  private initialized = false;

  constructor() {
    this.ensureDataDirectories();
  }

  private ensureDataDirectories() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(PRECOMPUTED_DIR)) {
      fs.mkdirSync(PRECOMPUTED_DIR, { recursive: true });
    }
  }

  public init() {
    if (this.initialized) return;
    this.loadStates();
    this.loadSchemes();
    this.loadStoreData();
    this.initialized = true;
  }

  private loadStates() {
    this.statesCache.clear();
    if (!fs.existsSync(CONFIG_STATES_DIR)) return;
    const files = fs.readdirSync(CONFIG_STATES_DIR).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(CONFIG_STATES_DIR, file), "utf-8");
        const state: StateConfig = JSON.parse(content);
        this.statesCache.set(state.id, state);
      } catch (err) {
        console.error(`Error loading state file ${file}:`, err);
      }
    }
  }

  private loadSchemes() {
    if (fs.existsSync(SCHEMES_FILE)) {
      try {
        const content = fs.readFileSync(SCHEMES_FILE, "utf-8");
        this.schemesCache = JSON.parse(content);
      } catch (err) {
        console.error("Error loading schemes file:", err);
      }
    }
  }

  private loadStoreData() {
    if (fs.existsSync(STORE_FILE)) {
      try {
        const content = fs.readFileSync(STORE_FILE, "utf-8");
        this.data = JSON.parse(content);
        return;
      } catch (err) {
        console.error("Error reading store.json, falling back to precomputed:", err);
      }
    }

    // Fall back to precomputed data if available
    const precomputedProjects = path.join(PRECOMPUTED_DIR, "projects.json");
    const precomputedRequests = path.join(PRECOMPUTED_DIR, "requests.json");

    let projects: Project[] = [];
    let requests: CitizenRequest[] = [];

    if (fs.existsSync(precomputedProjects)) {
      try {
        projects = JSON.parse(fs.readFileSync(precomputedProjects, "utf-8"));
      } catch (e) {
        console.error("Error parsing precomputed projects:", e);
      }
    }

    if (fs.existsSync(precomputedRequests)) {
      try {
        requests = JSON.parse(fs.readFileSync(precomputedRequests, "utf-8"));
      } catch (e) {
        console.error("Error parsing precomputed requests:", e);
      }
    }

    this.data = {
      projects,
      requests,
      custom_budgets: {},
    };

    this.persist();
  }

  private persist() {
    try {
      fs.writeFileSync(STORE_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to persist store.json:", err);
    }
  }

  public getStates(): StateConfig[] {
    this.init();
    return Array.from(this.statesCache.values());
  }

  public getState(id: string): StateConfig | undefined {
    this.init();
    return this.statesCache.get(id);
  }

  public getSchemes(): Scheme[] {
    this.init();
    return this.schemesCache;
  }

  public getRequests(stateId?: string, districtId?: string): CitizenRequest[] {
    this.init();
    return this.data.requests.filter((r) => {
      if (stateId && r.state !== stateId) return false;
      if (districtId && r.district !== districtId) return false;
      return true;
    });
  }

  public getRequest(id: string): CitizenRequest | undefined {
    this.init();
    return this.data.requests.find((r) => r.id === id);
  }

  public addRequest(request: CitizenRequest): void {
    this.init();
    const existingIdx = this.data.requests.findIndex((r) => r.id === request.id);
    if (existingIdx >= 0) {
      this.data.requests[existingIdx] = request;
    } else {
      this.data.requests.unshift(request);
    }
    this.persist();
  }

  public getProjects(stateId?: string): Project[] {
    this.init();
    return this.data.projects.filter((p) => {
      if (stateId && p.state !== stateId) return false;
      return true;
    });
  }

  public getProject(id: string): Project | undefined {
    this.init();
    return this.data.projects.find((p) => p.id === id);
  }

  public saveProject(project: Project): void {
    this.init();
    const idx = this.data.projects.findIndex((p) => p.id === project.id);
    if (idx >= 0) {
      this.data.projects[idx] = project;
    } else {
      this.data.projects.push(project);
    }
    this.persist();
  }

  public saveProjects(projects: Project[]): void {
    this.init();
    for (const p of projects) {
      const idx = this.data.projects.findIndex((item) => item.id === p.id);
      if (idx >= 0) {
        this.data.projects[idx] = p;
      } else {
        this.data.projects.push(p);
      }
    }
    this.persist();
  }

  public setCustomBudget(stateId: string, schemeId: string, budgetCrore: number) {
    this.init();
    if (!this.data.custom_budgets[stateId]) {
      this.data.custom_budgets[stateId] = {};
    }
    this.data.custom_budgets[stateId][schemeId] = budgetCrore;
    this.persist();
  }

  public getBudgets(stateId: string): Record<string, number> {
    this.init();
    const state = this.getState(stateId);
    const defaults = state ? { ...state.scheme_budgets } : {};
    const customs = this.data.custom_budgets[stateId] || {};
    return { ...defaults, ...customs };
  }

  public resetDemo(): void {
    if (fs.existsSync(STORE_FILE)) {
      try {
        fs.unlinkSync(STORE_FILE);
      } catch (e) {
        console.error("Error unlinking store.json:", e);
      }
    }
    this.initialized = false;
    this.init();
  }
}

export const store = new JanSetuStore();
