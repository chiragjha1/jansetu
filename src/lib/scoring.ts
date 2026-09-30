import { Category, DistrictConfig, PriorityWeights, Project, ScoreComponents } from "./types";

export const CATEGORY_INDICATOR_MAP: Record<Category, string> = {
  road: "road_connectivity",
  water: "tap_water",
  health: "phc_access",
  education: "school_access",
  electricity: "electricity_reliability",
  sanitation: "sanitation",
  housing: "default",
  irrigation: "default",
  other: "default",
};

export const PRESET_WEIGHTS: Record<string, PriorityWeights> = {
  balanced: {
    demand: 0.25,
    gap: 0.25,
    urgency: 0.25,
    value: 0.25,
  },
  equity_first: {
    demand: 0.2,
    gap: 0.5,
    urgency: 0.2,
    value: 0.1,
  },
  urgent_first: {
    demand: 0.1667,
    gap: 0.1667,
    urgency: 0.5,
    value: 0.1666,
  },
  best_value: {
    demand: 0.1667,
    gap: 0.1667,
    urgency: 0.1666,
    value: 0.5,
  },
};

/**
 * 1. DEMAND ADJUSTMENT (Voice-gap correction)
 * demand_per_10k = unique_citizens / district_population * 10000
 * adjusted_demand = demand_per_10k / max(digital_access_rate, 0.2)
 */
export function calculateAdjustedDemand(
  uniqueCitizens: number,
  districtPopulation: number,
  digitalAccessRate: number
): number {
  if (districtPopulation <= 0) return 0;
  const safeAccessRate = Math.max(digitalAccessRate, 0.2);
  const demandPer10k = (uniqueCitizens / districtPopulation) * 10000;
  return Number((demandPer10k / safeAccessRate).toFixed(4));
}

/**
 * 2. SERVICE GAP
 * gap = 1 - district indicator for project category (default 0.5 if unmapped)
 */
export function calculateGap(
  category: Category,
  districtIndicators: Record<string, number>
): number {
  const indicatorKey = CATEGORY_INDICATOR_MAP[category];
  if (!indicatorKey || indicatorKey === "default" || districtIndicators[indicatorKey] === undefined) {
    return 0.5;
  }
  const val = districtIndicators[indicatorKey];
  return Number(Math.max(0, Math.min(1, 1 - val)).toFixed(4));
}

/**
 * 3. BENEFIT PER RUPEE (Value for Money)
 * benefit_per_rupee = est_affected_population / max(est_cost_crore, 0.01)
 */
export function calculateBenefitPerRupee(
  affectedPopulation: number,
  costCrore: number
): number {
  const safeCost = Math.max(costCrore, 0.01);
  return Number((affectedPopulation / safeCost).toFixed(2));
}

/**
 * 4. MIN-MAX NORMALISATION
 * Handles edge case where min === max by returning 1.0 (or 0 if all 0)
 */
export function minMaxNormalize(values: number[]): number[] {
  if (values.length === 0) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  if (range === 0) {
    return values.map(() => 1.0);
  }

  return values.map((v) => Number(((v - min) / range).toFixed(4)));
}

/**
 * Normalise weights so they strictly sum to 1.0
 */
export function normalizeWeights(weights: PriorityWeights): PriorityWeights {
  const sum = weights.demand + weights.gap + weights.urgency + weights.value;
  if (sum <= 0) {
    return { demand: 0.25, gap: 0.25, urgency: 0.25, value: 0.25 };
  }
  return {
    demand: Number((weights.demand / sum).toFixed(4)),
    gap: Number((weights.gap / sum).toFixed(4)),
    urgency: Number((weights.urgency / sum).toFixed(4)),
    value: Number((weights.value / sum).toFixed(4)),
  };
}

/**
 * 5. COMPUTE PRIORITY SCORES & SCORE COMPONENTS
 * Pure deterministic calculation across a state's projects.
 */
export function scoreProjects(
  projects: Project[],
  districts: DistrictConfig[],
  weights: PriorityWeights = PRESET_WEIGHTS.balanced
): Project[] {
  if (projects.length === 0) return [];

  const districtMap = new Map<string, DistrictConfig>();
  for (const d of districts) {
    districtMap.set(d.id.toLowerCase(), d);
  }

  // Step A: Calculate raw metrics for all projects
  const rawAdjustedDemand: number[] = [];
  const rawGap: number[] = [];
  const rawUrgency: number[] = [];
  const rawBenefit: number[] = [];

  const intermediateList = projects.map((p) => {
    const district = districtMap.get(p.district.toLowerCase());
    const pop = district ? district.population : 1000000;
    const access = district ? district.digital_access_rate : 0.5;
    const indicators = district ? district.indicators : {};

    const adjDemand = calculateAdjustedDemand(p.unique_citizens, pop, access);
    const gap = calculateGap(p.category, indicators);
    const urgency = p.avg_urgency || 3;
    const benefit = calculateBenefitPerRupee(p.est_affected_population, p.est_cost_crore);

    rawAdjustedDemand.push(adjDemand);
    rawGap.push(gap);
    rawUrgency.push(urgency);
    rawBenefit.push(benefit);

    return {
      project: p,
      adjDemand,
      gap,
      urgency,
      benefit,
    };
  });

  // Step B: Min-Max normalise across projects in the state
  const normDemand = minMaxNormalize(rawAdjustedDemand);
  const normGap = minMaxNormalize(rawGap);
  const normUrgency = minMaxNormalize(rawUrgency);
  const normBenefit = minMaxNormalize(rawBenefit);

  const w = normalizeWeights(weights);

  // Step C: Compute priority score = 100 * sum(w_i * norm_i)
  const scoredProjects: Project[] = intermediateList.map((item, idx) => {
    const p = item.project;
    const components: ScoreComponents = {
      adjusted_demand: item.adjDemand,
      gap: item.gap,
      avg_urgency: item.urgency,
      benefit_per_rupee: item.benefit,
      norm_adjusted_demand: normDemand[idx],
      norm_gap: normGap[idx],
      norm_avg_urgency: normUrgency[idx],
      norm_benefit_per_rupee: normBenefit[idx],
    };

    const compositeScore =
      w.demand * components.norm_adjusted_demand +
      w.gap * components.norm_gap +
      w.urgency * components.norm_avg_urgency +
      w.value * components.norm_benefit_per_rupee;

    const priorityScore = Number((compositeScore * 100).toFixed(1));

    return {
      ...p,
      score_components: components,
      priority_score: priorityScore,
    };
  });

  // Sort descending by priority_score
  scoredProjects.sort((a, b) => b.priority_score - a.priority_score);

  // Assign 1-indexed ranks and record previous rank for delta tracking
  return scoredProjects.map((p, index) => {
    const currentRank = index + 1;
    return {
      ...p,
      previous_rank: p.rank ?? currentRank,
      rank: currentRank,
    };
  });
}

/**
 * 6. BUDGET ALLOCATION (Deterministic)
 * For each scheme in the state:
 * - Sort projects by priority descending
 * - Fund while remaining budget >= est_cost_crore
 * - Else mark "Unfunded — high priority" and try secondary_scheme_id once
 * Returns updated projects + scheme budget utilisation summary
 */
export interface SchemeBudgetSummary {
  scheme_id: string;
  total_budget: number;
  allocated_budget: number;
  remaining_budget: number;
  funded_count: number;
  unfunded_count: number;
}

export function allocateBudgets(
  projects: Project[],
  schemeBudgets: Record<string, number>
): {
  projects: Project[];
  budgetSummaries: Record<string, SchemeBudgetSummary>;
} {
  // Initialize remaining budgets
  const remaining: Record<string, number> = {};
  const summaries: Record<string, SchemeBudgetSummary> = {};

  for (const [schemeId, budget] of Object.entries(schemeBudgets)) {
    remaining[schemeId] = budget;
    summaries[schemeId] = {
      scheme_id: schemeId,
      total_budget: budget,
      allocated_budget: 0,
      remaining_budget: budget,
      funded_count: 0,
      unfunded_count: 0,
    };
  }

  // Work on a copy sorted by priority score descending
  const sorted = [...projects].sort((a, b) => b.priority_score - a.priority_score);

  const updatedProjects: Project[] = sorted.map((p) => {
    const cost = p.est_cost_crore;
    const primaryScheme = p.scheme_routing?.primary_scheme_id;
    const secondaryScheme = p.scheme_routing?.secondary_scheme_id;

    // Try primary scheme
    if (primaryScheme && (remaining[primaryScheme] ?? 0) >= cost) {
      remaining[primaryScheme] = Number((remaining[primaryScheme] - cost).toFixed(2));
      summaries[primaryScheme].allocated_budget = Number(
        (summaries[primaryScheme].allocated_budget + cost).toFixed(2)
      );
      summaries[primaryScheme].remaining_budget = remaining[primaryScheme];
      summaries[primaryScheme].funded_count += 1;

      return {
        ...p,
        funding_status: "Funded" as const,
        allocated_scheme_id: primaryScheme,
      };
    }

    // Try secondary scheme fallback once if primary exhausted
    if (secondaryScheme && (remaining[secondaryScheme] ?? 0) >= cost) {
      remaining[secondaryScheme] = Number((remaining[secondaryScheme] - cost).toFixed(2));
      summaries[secondaryScheme].allocated_budget = Number(
        (summaries[secondaryScheme].allocated_budget + cost).toFixed(2)
      );
      summaries[secondaryScheme].remaining_budget = remaining[secondaryScheme];
      summaries[secondaryScheme].funded_count += 1;

      return {
        ...p,
        funding_status: "Funded" as const,
        allocated_scheme_id: secondaryScheme,
      };
    }

    // Unfunded
    if (primaryScheme && summaries[primaryScheme]) {
      summaries[primaryScheme].unfunded_count += 1;
    }

    return {
      ...p,
      funding_status: "Unfunded - High Priority" as const,
      allocated_scheme_id: undefined,
    };
  });

  return {
    projects: updatedProjects,
    budgetSummaries: summaries,
  };
}
