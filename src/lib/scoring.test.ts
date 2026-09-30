import { describe, it, expect } from "vitest";
import {
  calculateAdjustedDemand,
  calculateGap,
  calculateBenefitPerRupee,
  minMaxNormalize,
  normalizeWeights,
  scoreProjects,
  allocateBudgets,
  PRESET_WEIGHTS,
} from "./scoring";
import { DistrictConfig, Project } from "./types";

describe("Scoring & Allocation Unit Tests", () => {
  it("normalises adjusted demand with voice-gap correction", () => {
    // District with low digital access (0.3) should receive boosted adjusted demand
    const pop = 1000000;
    const uniqueCitizens = 100;
    const lowAccess = 0.3;
    const highAccess = 0.9;

    const lowAccessDemand = calculateAdjustedDemand(uniqueCitizens, pop, lowAccess);
    const highAccessDemand = calculateAdjustedDemand(uniqueCitizens, pop, highAccess);

    expect(lowAccessDemand).toBeGreaterThan(highAccessDemand);
    expect(lowAccessDemand).toBeCloseTo(3.3333, 2);
  });

  it("calculates gap correctly and falls back to 0.5 for unmapped categories", () => {
    const indicators = {
      road_connectivity: 0.4,
      tap_water: 0.8,
      phc_access: 0.2,
      school_access: 0.7,
      electricity_reliability: 0.9,
      sanitation: 0.5,
    };

    expect(calculateGap("road", indicators)).toBeCloseTo(0.6, 2);
    expect(calculateGap("tap_water" as any, indicators)).toBeCloseTo(0.5, 2); // mapped via 'water'
    expect(calculateGap("water", indicators)).toBeCloseTo(0.2, 2);
    expect(calculateGap("health", indicators)).toBeCloseTo(0.8, 2);
    expect(calculateGap("housing", indicators)).toBe(0.5); // default fallback
    expect(calculateGap("other", indicators)).toBe(0.5);
  });

  it("handles zero or negative cost in benefit per rupee without division by zero", () => {
    const pop = 5000;
    const zeroCostBenefit = calculateBenefitPerRupee(pop, 0);
    expect(zeroCostBenefit).toBeGreaterThan(0);
    expect(Number.isFinite(zeroCostBenefit)).toBe(true);

    const negativeCostBenefit = calculateBenefitPerRupee(pop, -1);
    expect(Number.isFinite(negativeCostBenefit)).toBe(true);
  });

  it("min-max normalises lists and handles all-equal values gracefully", () => {
    const distinct = [10, 20, 30, 40, 50];
    const norm = minMaxNormalize(distinct);
    expect(norm[0]).toBe(0);
    expect(norm[norm.length - 1]).toBe(1);

    const equalValues = [42, 42, 42];
    const equalNorm = minMaxNormalize(equalValues);
    expect(equalNorm).toEqual([1.0, 1.0, 1.0]);
  });

  it("auto-normalises weights to sum strictly to 1.0", () => {
    const customWeights = { demand: 2, gap: 2, urgency: 2, value: 2 };
    const normW = normalizeWeights(customWeights);
    const sum = normW.demand + normW.gap + normW.urgency + normW.value;
    expect(sum).toBeCloseTo(1.0, 3);
    expect(normW.demand).toBe(0.25);
  });

  it("re-ranks deterministically when switching to Equity First preset", () => {
    const dummyDistricts: DistrictConfig[] = [
      {
        id: "dist_a",
        name: "District A",
        lat: 0,
        lng: 0,
        population: 500000,
        digital_access_rate: 0.3,
        indicators: {
          road_connectivity: 0.2, // severe gap = 0.8
          tap_water: 0.9,
          phc_access: 0.8,
          school_access: 0.8,
          electricity_reliability: 0.8,
          sanitation: 0.8,
        },
      },
      {
        id: "dist_b",
        name: "District B",
        lat: 0,
        lng: 0,
        population: 500000,
        digital_access_rate: 0.9,
        indicators: {
          road_connectivity: 0.9, // small gap = 0.1
          tap_water: 0.9,
          phc_access: 0.9,
          school_access: 0.9,
          electricity_reliability: 0.9,
          sanitation: 0.9,
        },
      },
    ];

    const dummyProjects: Project[] = [
      {
        id: "P1",
        state: "test",
        district: "dist_a",
        category: "road",
        title: "P1 Poor Road",
        sub_issue: "Road gap",
        village_texts: ["V1"],
        request_ids: ["R1"],
        issue_count: 5,
        unique_citizens: 5,
        avg_urgency: 3,
        est_affected_population: 2000,
        est_cost_crore: 0.5,
        scheme_routing: {
          primary_scheme_id: "PMGSY",
          secondary_scheme_id: null,
          reasoning: "Road",
          catalog_basis: "Catalog",
          confidence: 0.9,
          human_check_needed: false,
        },
        priority_score: 0,
        funding_status: "Funded",
        status_timeline: [],
      },
      {
        id: "P2",
        state: "test",
        district: "dist_b",
        category: "road",
        title: "P2 Good Road Area",
        sub_issue: "Road maintenance",
        village_texts: ["V2"],
        request_ids: ["R2"],
        issue_count: 10,
        unique_citizens: 10,
        avg_urgency: 4,
        est_affected_population: 8000,
        est_cost_crore: 0.3,
        scheme_routing: {
          primary_scheme_id: "PMGSY",
          secondary_scheme_id: null,
          reasoning: "Road",
          catalog_basis: "Catalog",
          confidence: 0.9,
          human_check_needed: false,
        },
        priority_score: 0,
        funding_status: "Funded",
        status_timeline: [],
      },
    ];

    // Under Equity First (gap weight 0.5), P1 with huge gap should score strongly
    const equityRanked = scoreProjects(dummyProjects, dummyDistricts, PRESET_WEIGHTS.equity_first);
    expect(equityRanked[0].id).toBe("P1");
  });

  it("correctly allocates budget, marks overflow as unfunded, and tries secondary scheme", () => {
    const projects: Project[] = [
      {
        id: "P1",
        state: "test",
        district: "d1",
        category: "road",
        title: "High priority road",
        sub_issue: "Road",
        village_texts: ["V1"],
        request_ids: ["R1"],
        issue_count: 10,
        unique_citizens: 10,
        avg_urgency: 5,
        est_affected_population: 5000,
        est_cost_crore: 6.0,
        scheme_routing: {
          primary_scheme_id: "PMGSY",
          secondary_scheme_id: "MGNREGA",
          reasoning: "Road",
          catalog_basis: "Catalog",
          confidence: 0.9,
          human_check_needed: false,
        },
        priority_score: 95,
        funding_status: "Under Review",
        status_timeline: [],
      },
      {
        id: "P2",
        state: "test",
        district: "d1",
        category: "road",
        title: "Second road",
        sub_issue: "Road",
        village_texts: ["V2"],
        request_ids: ["R2"],
        issue_count: 5,
        unique_citizens: 5,
        avg_urgency: 4,
        est_affected_population: 3000,
        est_cost_crore: 5.0,
        scheme_routing: {
          primary_scheme_id: "PMGSY",
          secondary_scheme_id: "MGNREGA",
          reasoning: "Road",
          catalog_basis: "Catalog",
          confidence: 0.9,
          human_check_needed: false,
        },
        priority_score: 80,
        funding_status: "Under Review",
        status_timeline: [],
      },
    ];

    // PMGSY budget is only 8.0 crore. P1 takes 6.0, leaving 2.0.
    // P2 requires 5.0 crore, so PMGSY cannot fund it.
    // But MGNREGA has 10.0 crore, so P2 should be funded under MGNREGA!
    const budgets = {
      PMGSY: 8.0,
      MGNREGA: 10.0,
    };

    const result = allocateBudgets(projects, budgets);

    const allocatedP1 = result.projects.find((p) => p.id === "P1");
    const allocatedP2 = result.projects.find((p) => p.id === "P2");

    expect(allocatedP1?.funding_status).toBe("Funded");
    expect(allocatedP1?.allocated_scheme_id).toBe("PMGSY");

    expect(allocatedP2?.funding_status).toBe("Funded");
    expect(allocatedP2?.allocated_scheme_id).toBe("MGNREGA"); // secondary fallback!
    expect(result.budgetSummaries.PMGSY.remaining_budget).toBe(2.0);
    expect(result.budgetSummaries.MGNREGA.remaining_budget).toBe(5.0);
  });
});
