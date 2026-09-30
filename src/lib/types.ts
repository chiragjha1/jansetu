import { z } from "zod";

export type Category =
  | "road"
  | "water"
  | "health"
  | "education"
  | "electricity"
  | "sanitation"
  | "housing"
  | "irrigation"
  | "other";

export const CATEGORIES: Category[] = [
  "road",
  "water",
  "health",
  "education",
  "electricity",
  "sanitation",
  "housing",
  "irrigation",
  "other",
];

export interface DistrictIndicators {
  road_connectivity: number;
  tap_water: number;
  phc_access: number;
  school_access: number;
  electricity_reliability: number;
  sanitation: number;
  [key: string]: number;
}

export interface DistrictConfig {
  id: string;
  name: string;
  native_name?: string;
  lat: number;
  lng: number;
  population: number;
  digital_access_rate: number;
  indicators: DistrictIndicators;
}

export interface StateConfig {
  id: string;
  name: string;
  native_name?: string;
  language_code: string;
  language_name: string;
  districts: DistrictConfig[];
  scheme_budgets: Record<string, number>;
}

export interface CitizenRequest {
  id: string;
  channel: "voice" | "text" | "chat";
  original_text: string;
  audio_ref?: string;
  photo_ref?: string;
  state: string;
  district: string;
  village_text: string;
  phone_hash: string;
  created_at: string;
  synthetic?: boolean;
  extraction?: ExtractionResult;
  project_id?: string;
}

export const ExtractionResultSchema = z.object({
  language_detected: z.string(),
  transcript: z.string().nullable().optional(),
  translation_en: z.string(),
  category: z.enum([
    "road",
    "water",
    "health",
    "education",
    "electricity",
    "sanitation",
    "housing",
    "irrigation",
    "other",
  ]),
  sub_issue: z.string(),
  urgency: z.number().int().min(1).max(5),
  urgency_reason: z.string(),
  affected_population_estimate: z.number().int().nullable().optional(),
  confidence: z.number().min(0).max(1),
  needs_clarification: z.boolean(),
  clarifying_question: z.string().nullable().optional(),
});

export type ExtractionResult = z.infer<typeof ExtractionResultSchema>;

export const SchemeRoutingSchema = z.object({
  primary_scheme_id: z.string(),
  secondary_scheme_id: z.string().nullable().optional(),
  reasoning: z.string().max(300),
  catalog_basis: z.string(),
  confidence: z.number().min(0).max(1),
  human_check_needed: z.boolean(),
  is_live_ai: z.boolean().optional(),
});

export type SchemeRoutingResult = z.infer<typeof SchemeRoutingSchema>;

export interface ScoreComponents {
  adjusted_demand: number;
  gap: number;
  avg_urgency: number;
  benefit_per_rupee: number;
  norm_adjusted_demand: number;
  norm_gap: number;
  norm_avg_urgency: number;
  norm_benefit_per_rupee: number;
}

export interface PriorityWeights {
  demand: number;
  gap: number;
  urgency: number;
  value: number;
}

export interface StatusTimelineEntry {
  stage: "received" | "grouped" | "prioritised" | "funded" | "completed";
  timestamp: string;
  note: string;
  photo_url?: string;
}

export interface Project {
  id: string;
  state: string;
  district: string;
  category: Category;
  title: string;
  sub_issue: string;
  village_texts: string[];
  request_ids: string[];
  issue_count: number;
  unique_citizens: number;
  avg_urgency: number;
  est_affected_population: number;
  est_cost_crore: number;
  embedding?: number[];
  scheme_routing: SchemeRoutingResult;
  score_components?: ScoreComponents;
  priority_score: number;
  funding_status: "Funded" | "Unfunded - High Priority" | "Under Review";
  allocated_scheme_id?: string;
  rank?: number;
  previous_rank?: number;
  explanation?: string;
  is_live_ai_explanation?: boolean;
  status_timeline: StatusTimelineEntry[];
  verification?: VerificationResult;
}

export interface Scheme {
  id: string;
  name: string;
  purpose: string;
  eligible_works: string;
  exclusions: string;
  unit_cost_crore: number;
  disclaimer: string;
}

export const VerificationResultSchema = z.object({
  matches_reported_issue: z.boolean(),
  shows_completion: z.boolean(),
  evidence_notes: z.string().max(250),
  confidence: z.number().min(0).max(1),
  verdict: z.enum(["verified", "unclear", "not_verified"]),
  is_live_ai: z.boolean().optional(),
});

export type VerificationResult = z.infer<typeof VerificationResultSchema>;
