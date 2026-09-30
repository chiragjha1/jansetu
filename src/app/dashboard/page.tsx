"use client";

import { useEffect, useState, useMemo } from "react";
import {
  CitizenRequest,
  DistrictConfig,
  PriorityWeights,
  Project,
  Scheme,
  StateConfig,
} from "@/lib/types";
import {
  PRESET_WEIGHTS,
  scoreProjects,
  allocateBudgets,
  SchemeBudgetSummary,
} from "@/lib/scoring";
import { KpiRow } from "@/components/dashboard/KpiRow";
import { PrioritySliders } from "@/components/dashboard/PrioritySliders";
import { BudgetEditor } from "@/components/dashboard/BudgetEditor";
import { ProjectTable } from "@/components/dashboard/ProjectTable";
import { ProjectDrawer } from "@/components/dashboard/ProjectDrawer";
import { StateCompare } from "@/components/dashboard/StateCompare";
import { MapView } from "@/components/dashboard/MapView";
import {
  MapPin,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Filter,
  X,
} from "lucide-react";

export default function DashboardPage() {
  const [states, setStates] = useState<StateConfig[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [selectedStateId, setSelectedStateId] = useState<string>("rajasthan");
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("all");
  const [weights, setWeights] = useState<PriorityWeights>(PRESET_WEIGHTS.balanced);

  const [rawProjects, setRawProjects] = useState<Project[]>([]);
  const [allRequests, setAllRequests] = useState<CitizenRequest[]>([]);
  const [customBudgets, setCustomBudgets] = useState<Record<string, number>>({});

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [whatChangedBanner, setWhatChangedBanner] = useState<string | null>(null);
  const [isNarrating, setIsNarrating] = useState(false);

  // Initial data load from API
  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setStates(data.states || []);
        setSchemes(data.schemes || []);
        setRawProjects(data.projects || []);
        setAllRequests(data.requests || []);

        if (data.states && data.states.length > 0) {
          const defaultState = data.states[0];
          setSelectedStateId(defaultState.id);
          setCustomBudgets({ ...defaultState.scheme_budgets });
        }
      })
      .catch((e) => console.error("Dashboard init error:", e));
  }, []);

  // Current active state config
  const currentState = useMemo(() => {
    return states.find((s) => s.id === selectedStateId) || states[0];
  }, [states, selectedStateId]);

  // When switching states, reset custom budgets to that state's defaults
  const handleStateChange = (stateId: string) => {
    setSelectedStateId(stateId);
    setSelectedDistrictId("all");
    setWhatChangedBanner(null);
    const targetState = states.find((s) => s.id === stateId);
    if (targetState) {
      setCustomBudgets({ ...targetState.scheme_budgets });
    }
  };

  // State-specific projects
  const stateProjects = useMemo(() => {
    return rawProjects.filter((p) => p.state === selectedStateId);
  }, [rawProjects, selectedStateId]);

  // Step 1: Score projects with current weights
  const scoredProjects = useMemo(() => {
    if (!currentState) return [];
    return scoreProjects(stateProjects, currentState.districts, weights);
  }, [stateProjects, currentState, weights]);

  // Step 2: Allocate budgets
  const { allocatedProjects, summaries } = useMemo(() => {
    const budgets = Object.keys(customBudgets).length > 0 ? customBudgets : currentState?.scheme_budgets || {};
    const res = allocateBudgets(scoredProjects, budgets);
    return {
      allocatedProjects: res.projects,
      summaries: res.budgetSummaries,
    };
  }, [scoredProjects, customBudgets, currentState]);

  // Filtered by district if specified
  const displayedProjects = useMemo(() => {
    if (selectedDistrictId === "all") return allocatedProjects;
    return allocatedProjects.filter(
      (p) => p.district.toLowerCase() === selectedDistrictId.toLowerCase()
    );
  }, [allocatedProjects, selectedDistrictId]);

  // Top KPIs
  const totalStateRequests = useMemo(() => {
    return allRequests.filter((r) => r.state === selectedStateId).length;
  }, [allRequests, selectedStateId]);

  const fundedCount = useMemo(() => {
    return allocatedProjects.filter((p) => p.funding_status === "Funded").length;
  }, [allocatedProjects]);

  const unfundedCount = allocatedProjects.length - fundedCount;

  const totalBudgetCrore = useMemo(() => {
    return Object.values(customBudgets).reduce((acc, b) => acc + b, 0);
  }, [customBudgets]);

  const totalAllocatedCrore = useMemo(() => {
    return Object.values(summaries).reduce((acc, s) => acc + s.allocated_budget, 0);
  }, [summaries]);

  // Multi-state project mapping for Compare States view
  const projectsByState = useMemo(() => {
    const map: Record<string, Project[]> = {};
    for (const st of states) {
      const pList = rawProjects.filter((p) => p.state === st.id);
      const scored = scoreProjects(pList, st.districts, weights);
      const alloc = allocateBudgets(scored, st.scheme_budgets);
      map[st.id] = alloc.projects;
    }
    return map;
  }, [states, rawProjects, weights]);

  // Handle "What Changed?" trigger
  const handleWhatChanged = async () => {
    setIsNarrating(true);
    try {
      // Find top 5 movers
      const movers = allocatedProjects
        .map((p) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          district: p.district,
          previous_rank: p.previous_rank ?? p.rank,
          current_rank: p.rank,
          delta: (p.previous_rank ?? p.rank ?? 0) - (p.rank ?? 0),
        }))
        .filter((m) => m.delta !== 0)
        .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
        .slice(0, 5);

      if (movers.length === 0) {
        setWhatChangedBanner("No rank shifts detected with current weight adjustments.");
        setIsNarrating(false);
        return;
      }

      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "what_changed",
          movers,
        }),
      });

      const data = await res.json();
      if (data.narrative) {
        setWhatChangedBanner(data.narrative);
      }
    } catch (e) {
      console.error(e);
      setWhatChangedBanner(
        "Priority distribution adjusted. Higher-gap and higher-need interventions advanced to senior funding ranks."
      );
    } finally {
      setIsNarrating(false);
    }
  };

  const handleBudgetChange = (schemeId: string, newCap: number) => {
    setCustomBudgets((prev) => ({
      ...prev,
      [schemeId]: newCap,
    }));
  };

  const handleResetBudgets = () => {
    if (currentState) {
      setCustomBudgets({ ...currentState.scheme_budgets });
    }
  };

  const handleMarkScheduled = (projectId: string) => {
    alert(`Project ${projectId} marked as Scheduled for tendering and fund sanction.`);
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 md:py-8 flex flex-col">
      {/* Top Bar: State Selector & Presets */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Policymaker Ledger
            </span>
            <span className="text-xs text-slate-400">&bull;</span>
            <span className="text-xs text-slate-500">Track 1: AI for Digital Infrastructure</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Priority &amp; Delivery Allocation
          </h1>
        </div>

        {/* State Selector Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-start md:self-auto border border-slate-200">
          {states.map((st) => (
            <button
              key={st.id}
              onClick={() => handleStateChange(st.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer ${
                selectedStateId === st.id
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {st.name} <span className="text-slate-400 font-normal">({st.language_code.toUpperCase()})</span>
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <KpiRow
        requestCount={totalStateRequests}
        projectCount={allocatedProjects.length}
        fundedCount={fundedCount}
        unfundedCount={unfundedCount}
        budgetAllocatedCrore={totalAllocatedCrore}
        budgetTotalCrore={totalBudgetCrore}
      />

      {/* Sliders & Weight Engine */}
      <PrioritySliders
        weights={weights}
        onWeightsChange={setWeights}
        onWhatChanged={handleWhatChanged}
        isNarrating={isNarrating}
      />

      {/* "What Changed?" Dynamic Narration Banner */}
      {whatChangedBanner && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6 flex items-start justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider block mb-0.5">
                AI Impact Narration ("What Changed?")
              </span>
              <p className="text-xs md:text-sm text-indigo-950 font-medium leading-relaxed">
                {whatChangedBanner}
              </p>
            </div>
          </div>
          <button
            onClick={() => setWhatChangedBanner(null)}
            className="text-indigo-400 hover:text-indigo-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Scheme Budget Caps Editor */}
      <BudgetEditor
        schemes={schemes}
        budgets={customBudgets}
        summaries={summaries}
        onBudgetChange={handleBudgetChange}
        onResetBudgets={handleResetBudgets}
      />

      {/* District Filter Bar */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-semibold flex items-center gap-1 flex-shrink-0">
          <Filter className="w-3.5 h-3.5" />
          Filter District:
        </span>
        <button
          onClick={() => setSelectedDistrictId("all")}
          className={`px-3 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
            selectedDistrictId === "all"
              ? "bg-slate-900 text-white"
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
          }`}
        >
          All Districts ({allocatedProjects.length})
        </button>
        {currentState?.districts.map((d) => {
          const count = allocatedProjects.filter(
            (p) => p.district.toLowerCase() === d.id.toLowerCase()
          ).length;
          return (
            <button
              key={d.id}
              onClick={() => setSelectedDistrictId(d.id)}
              className={`px-3 py-1 rounded-lg font-medium cursor-pointer transition-colors capitalize ${
                selectedDistrictId.toLowerCase() === d.id.toLowerCase()
                  ? "bg-blue-700 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {d.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Main Split: Left 60% Table, Right 40% Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-7">
          <ProjectTable
            projects={displayedProjects}
            selectedProjectId={selectedProject?.id}
            onSelectProject={(p) => setSelectedProject(p)}
          />
        </div>

        <div className="lg:col-span-5 h-[450px] lg:h-auto">
          <MapView
            districts={currentState?.districts || []}
            projects={allocatedProjects}
            selectedDistrictId={selectedDistrictId}
            onSelectDistrict={(id) => setSelectedDistrictId(id)}
          />
        </div>
      </div>

      {/* Multi-State Comparison Section */}
      <StateCompare
        states={states}
        projectsByState={projectsByState}
        onSelectProject={(p) => {
          setSelectedStateId(p.state);
          setSelectedProject(p);
        }}
        onSwitchState={(stId) => handleStateChange(stId)}
      />

      {/* Project Details Right Drawer */}
      <ProjectDrawer
        project={selectedProject}
        requests={allRequests}
        onClose={() => setSelectedProject(null)}
        onMarkScheduled={handleMarkScheduled}
      />
    </div>
  );
}
